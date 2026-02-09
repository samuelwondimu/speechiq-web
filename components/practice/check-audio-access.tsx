"use client";

import { useEffect, useRef, useState } from "react";
import LottieWave from "../lottie-wave";
import { Button } from "../ui/button";

type AccessStatus =
  | "idle"
  | "checking"
  | "granted"
  | "denied"
  | "unsupported"
  | "error";

enum AccessStatusEnum {
  idle = "idle",
  checking = "checking",
  granted = "granted",
  denied = "denied",
  unsupported = "unsupported",
  error = "error",
}

interface CheckAudioAccessProps {
  onAccessChange?: (hasAccess: boolean) => void;
}

export default function CheckAudioAccess({
  onAccessChange,
}: CheckAudioAccessProps) {
  const [status, setStatus] = useState<AccessStatus>("idle");
  const [message, setMessage] = useState<string | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

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
      stream.getTracks().forEach((t) => t.stop());
      streamRef.current = null;

      setStatus("granted");
      if (onAccessChange) onAccessChange(true);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Microphone access denied.";
      setStatus("denied");
      setMessage(errorMessage);
      if (onAccessChange) onAccessChange(false);
    }
  }

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
    };
  }, []);

  const isGranted = status === "granted";

  return (
    <div className="flex flex-col items-center justify-center gap-8">
      <LottieWave
        options={{
          autoplay: status === AccessStatusEnum.granted,
          loop: true,
          pause:
            status === AccessStatusEnum.idle ||
            status === AccessStatusEnum.denied ||
            status === AccessStatusEnum.unsupported ||
            status === AccessStatusEnum.error,
        }}
      />
      <div className="text-muted-foreground text-lg">
        {isGranted
          ? "Microphone access granted."
          : "We need access to your microphone to continue."}
      </div>

      {!isGranted && (
        <Button
          onClick={requestAccess}
          disabled={status === AccessStatusEnum.checking}
          size="xl"
          className="hover:cursor-pointer"
        >
          {status === AccessStatusEnum.checking
            ? "Checking…"
            : "Allow Microphone"}
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
