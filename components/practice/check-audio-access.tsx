"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { Mic, MicOff } from "lucide-react";
import { cn } from "@/lib/utils";

type AccessStatus =
  | "idle"
  | "checking"
  | "granted"
  | "denied"
  | "unsupported"
  | "error";

interface CheckAudioAccessProps {
  onAccessChange?: (hasAccess: boolean) => void;
}

export default function CheckAudioAccess({
  onAccessChange,
}: CheckAudioAccessProps) {
  const [status, setStatus] = useState<AccessStatus>("idle");
  const [message, setMessage] = useState<string | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Float32Array<ArrayBuffer> | null>(null);
  const rafRef = useRef<number | null>(null);

  const [volume, setVolume] = useState(0);

  function startVolumeMeter() {
    const analyser = analyserRef.current;
    const dataArray = dataArrayRef.current;

    if (!analyser || !dataArray) return;

    const tick = () => {
      analyser.getFloatTimeDomainData(dataArray);

      let sumSquares = 0;
      for (let i = 0; i < dataArray.length; i++) {
        sumSquares += dataArray[i] * dataArray[i];
      }

      const rms = Math.sqrt(sumSquares / dataArray.length);

      const nextVolume = Math.min(100, rms * 400);

      setVolume(nextVolume);
      rafRef.current = requestAnimationFrame(tick);
    };

    tick();
  }

  async function requestAccess() {
    setMessage(null);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setStatus("unsupported");
      setMessage("Microphone not available in this browser.");
      if (onAccessChange) onAccessChange(false);
      return;
    }

    setStatus("checking");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();

      analyser.fftSize = 1024;

      const dataArray = new Float32Array(analyser.fftSize);

      source.connect(analyser);

      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      dataArrayRef.current = dataArray;

      startVolumeMeter();

      setStatus("granted");
      if (onAccessChange) onAccessChange(true);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Microphone access denied. Please allow access to continue.";
      setStatus("denied");
      setMessage(errorMessage);
      if (onAccessChange) onAccessChange(false);
    }
  }
  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }

      audioContextRef.current?.close();

      streamRef.current = null;
      audioContextRef.current = null;
      analyserRef.current = null;
    };
  }, []);

  const isGranted = status === "granted";
  const isChecking = status === "checking";
  const statusText =
    status === "granted"
      ? "Microphone access granted."
      : status === "checking"
        ? "Requesting microphone access…"
        : status === "unsupported"
          ? "Microphone is not supported in this browser."
          : status === "denied"
            ? "Microphone access was denied."
            : "We need access to your microphone to continue.";

  const buttonLabel = status === "checking" ? "Checking…" : "Allow Microphone";

  return (
    <div className="flex flex-col items-center justify-center gap-6 text-center">
      <div className="relative flex items-center justify-center size-64">
        <div
          className={cn(
            "absolute size-56 rounded-full blur-2xl transition-opacity duration-200",
            isGranted ? "bg-primary/30 animate-pulse" : "bg-muted-background",
          )}
          aria-hidden
        />

        {isGranted ? (
          <Mic
            className={cn("relative size-44 text-primary", {
              isGranted: "text-primary",
            })}
            aria-hidden
          />
        ) : (
          <MicOff
            className="relative size-44 text-muted-foreground"
            aria-hidden
          />
        )}
      </div>

      <div className="text-muted-foreground text-lg">{statusText}</div>

      {isGranted && (
        <div className="w-full max-w-sm">
          <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
            <span>Input level</span>
            <span>{Math.round(volume)}%</span>
          </div>
          <div className="h-14 w-full bg-muted">
            <div
              className="h-14 bg-primary transition-[width] duration-75"
              style={{ width: `${Math.min(volume, 100)}%` }}
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(volume)}
            />
          </div>
        </div>
      )}

      {!isGranted && (
        <Button
          onClick={requestAccess}
          disabled={isChecking}
          size="xl"
          className="hover:cursor-pointer"
          aria-busy={isChecking}
        >
          {buttonLabel}
        </Button>
      )}

      {message && (
        <p className="text-xs text-destructive" role="alert">
          {message}
        </p>
      )}
    </div>
  );
}
