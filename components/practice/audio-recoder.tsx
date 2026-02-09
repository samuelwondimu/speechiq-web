import { createContext, useContext, useEffect, useRef, useState } from "react";

type RecorderContext = {
  start: () => Promise<void>;
  stop: () => void;
  registerCanvas: (el: HTMLCanvasElement | null) => void;
  isRecording: boolean;
  elapsedSeconds: number;
  permissionError: string | null;
  lastBlob: Blob | null;
};

const AudioRecorderContext = createContext<RecorderContext | null>(null);

type ProviderProps = {
  children?: React.ReactNode;
  onRecordingComplete?: (blob: Blob, durationSeconds?: number) => void;
  mimeType?: string;
};

export function AudioRecorderProvider({
  children,
  onRecordingComplete,
  mimeType,
}: ProviderProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const [isRecording, setIsRecording] = useState(false);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [lastBlob, setLastBlob] = useState<Blob | null>(null);

  async function start() {
    if (isRecording) return;
    setPermissionError(null);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setPermissionError("Microphone not available in this browser.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const AudioContextClass =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioContextClass();
      audioCtxRef.current = audioCtx;

      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 2048;
      analyserRef.current = analyser;

      source.connect(analyser);

      const bufferLength = analyser.frequencyBinCount;
      dataArrayRef.current = new Uint8Array(bufferLength);

      const preferredType =
        mimeType ||
        (typeof MediaRecorder !== "undefined" &&
        MediaRecorder.isTypeSupported &&
        MediaRecorder.isTypeSupported("audio/webm")
          ? "audio/webm"
          : "audio/wav");

      const recorder = new MediaRecorder(
        stream,
        preferredType ? { mimeType: preferredType } : undefined,
      );
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (ev: BlobEvent) => {
        if (ev.data && ev.data.size > 0) chunksRef.current.push(ev.data);
      };

      recorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, {
          type: recorder.mimeType || "audio/webm",
        });
        setLastBlob(blob);
        console.log("Recorded blob size:", blob.size);

        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        await new Promise<void>((resolve) => {
          audio.addEventListener("loadedmetadata", () => resolve(), {
            once: true,
          });
        });
        const duration = audio.duration || 0;
        URL.revokeObjectURL(url);

        console.log("Recorded duration (s):", duration);
        if (onRecordingComplete) onRecordingComplete(blob, duration);
      };

      recorder.start();
      setIsRecording(true);
      startTimeRef.current = performance.now();
      setElapsedSeconds(0);

      const tick = () => {
        if (startTimeRef.current == null) return;
        const elapsed = Math.floor(
          (performance.now() - startTimeRef.current) / 1000,
        );
        setElapsedSeconds(elapsed);
      };
      const intervalId = window.setInterval(tick, 250);

      const draw = () => {
        const canvas = canvasRef.current;
        const analyserNode = analyserRef.current;
        const dataArray = dataArrayRef.current;
        if (!canvas || !analyserNode || !dataArray) {
          rafRef.current = requestAnimationFrame(draw);
          return;
        }

        const dpr = window.devicePixelRatio || 1;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        if (
          canvas.width !== Math.floor(width * dpr) ||
          canvas.height !== Math.floor(height * dpr)
        ) {
          canvas.width = Math.floor(width * dpr);
          canvas.height = Math.floor(height * dpr);
        }

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        analyserNode.getByteTimeDomainData(
          dataArray as unknown as Uint8Array<ArrayBuffer>,
        );

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.lineWidth = 2 * dpr;
        ctx.strokeStyle = isRecording ? "#85cd22" : "#85cd22";
        ctx.beginPath();

        const sliceWidth = (canvas.width / dataArray.length) * 1.0;
        let x = 0;

        for (let i = 0; i < dataArray.length; i++) {
          const v = dataArray[i] / 128.0; // 0..2
          const y = v * (canvas.height / 2);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
          x += sliceWidth;
        }

        ctx.stroke();

        rafRef.current = requestAnimationFrame(draw);
      };

      rafRef.current = requestAnimationFrame(draw);

      const cleanup = () => {
        window.clearInterval(intervalId);
      };

      (
        recorder as MediaRecorder & { _cleanupInterval?: () => void }
      )._cleanupInterval = cleanup;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error(err);
      setPermissionError(err?.message || String(err));
    }
  }

  function stop() {
    if (!isRecording) return;

    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== "inactive") {
      recorder.stop();
      try {
        const cleanup = (
          recorder as MediaRecorder & { _cleanupInterval?: () => void }
        )._cleanupInterval as (() => void) | undefined;
        if (cleanup) cleanup();
      } catch (e) {
        console.warn("Error during cleanup:", e);
      }
    }

    stopEverything();
    setIsRecording(false);
    startTimeRef.current = null;
  }

  function stopEverything() {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      try {
        mediaRecorderRef.current.stop();
      } catch (e) {
        console.warn("Error stopping media recorder:", e);
      }
    }

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      mediaStreamRef.current = null;
    }

    if (analyserRef.current) analyserRef.current.disconnect();
    analyserRef.current = null;

    if (audioCtxRef.current) {
      try {
        audioCtxRef.current.close();
      } catch (e) {
        console.warn("Error closing audio context:", e);
      }
      audioCtxRef.current = null;
    }
  }

  function registerCanvas(el: HTMLCanvasElement | null) {
    canvasRef.current = el;
  }

  useEffect(() => {
    return () => {
      stopEverything();
    };
  }, []);

  const value: RecorderContext = {
    start,
    stop,
    registerCanvas,
    isRecording,
    elapsedSeconds,
    permissionError,
    lastBlob,
  };

  return (
    <AudioRecorderContext.Provider value={value}>
      {children}
    </AudioRecorderContext.Provider>
  );
}

export function useAudioRecorder() {
  const ctx = useContext(AudioRecorderContext);
  if (!ctx)
    throw new Error(
      "useAudioRecorder must be used within an AudioRecorderProvider",
    );
  return ctx;
}
