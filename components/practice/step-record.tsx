import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardFooter,
  CardContent,
} from "@/components/ui/card";
import RecordingStatus from "./recording-status";
import { useFormContext } from "react-hook-form";
import { PracticeFormValues } from "@/lib/practice-form";
import {
  MicrophoneState,
  useMicrophone,
} from "@/context/MicrophoneContextProvider";
import { useEffect, useRef, useState } from "react";

interface StepRecordProps {
  onNext: () => Promise<void>;
  onBack: () => void;
}

type RevWord = {
  type: "text";
  value: string;
  ts: number;
  end_ts: number;
  confidence: number;
};

type RevElement = RevWord | { type: "punct"; value: string };

type RevTranscript = {
  monologues: {
    speaker: number;
    elements: RevElement[];
  }[];
};

export default function StepRecord({ onNext, onBack }: StepRecordProps) {
  const { setValue, watch } = useFormContext<PracticeFormValues>();
  const selectedType = watch("practiceType");
  const caption = watch("transcript");
  const audioBlob = watch("audioBlob");
  const [statusText, setStatusText] = useState<string>("");
  const chunksRef = useRef<BlobPart[]>([]);
  const isTranscribingRef = useRef<boolean>(false);

  const { microphone, startMicrophone, stopMicrophone, microphoneState } =
    useMicrophone();

  useEffect(() => {
    if (!microphone) return;

    const handleStart = () => {
      chunksRef.current = [];
      setStatusText("");
    };

    const handleData = (event: BlobEvent) => {
      if (event.data && event.data.size > 0) {
        chunksRef.current.push(event.data);
      }
    };

    const handleStop = async () => {
      if (chunksRef.current.length === 0) return;
      const blob = new Blob(chunksRef.current, { type: "audio/webm" });
      chunksRef.current = [];

      setValue("audioBlob", blob, { shouldValidate: true });

      try {
        isTranscribingRef.current = true;
        setStatusText("Transcribing...");

        const formData = new FormData();
        formData.append("file", blob, "recording.webm");

        const response = await fetch("/api/rev-ai", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          setStatusText("Transcription failed.");
          return;
        }

        const data = (await response.json()) as {
          transcript?: RevTranscript;
        };
        const transcript = data.transcript;

        const caption = transcript?.monologues
          .flatMap((m) =>
            m.elements
              .filter((el): el is RevWord => el.type === "text")
              .map((el) => el.value),
          )
          .join(" ");

        setValue("transcript", caption ?? "", { shouldValidate: false });
        setValue("revTranscript", transcript, { shouldValidate: false });

        setStatusText("");
      } catch {
        setStatusText("Transcription failed.");
      } finally {
        isTranscribingRef.current = false;
      }
    };

    microphone.addEventListener("start", handleStart);
    microphone.addEventListener("dataavailable", handleData);
    microphone.addEventListener("stop", handleStop);

    return () => {
      microphone.removeEventListener("start", handleStart);
      microphone.removeEventListener("dataavailable", handleData);
      microphone.removeEventListener("stop", handleStop);
    };
  }, [microphone, setValue]);

  return (
    <Card>
      <CardHeader className="border-b">
        <h1 className="text-3xl font-bold text-foreground">
          Step 2: Record Your Practice ({selectedType})
        </h1>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-16">
        <RecordingStatus />
        {(statusText || caption) && (
          <div className="w-full max-w-2xl border border-border bg-muted/40 p-4 text-left text-lg font-semibold leading-relaxed text-foreground whitespace-pre-wrap max-h-48 overflow-y-auto">
            {statusText || caption}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end gap-4 items-center">
        <Button onClick={onBack} variant="outline">
          Back
        </Button>
        <Button
          onClick={() => {
            if (microphoneState === MicrophoneState.Open) {
              stopMicrophone();
            } else {
              startMicrophone();
              setValue("audioBlob", undefined as unknown as Blob, {
                shouldValidate: true,
              });
            }
          }}
          size="xl"
          className="hover:cursor-pointer"
        >
          {microphoneState === MicrophoneState.Open
            ? "Stop Recording"
            : audioBlob
              ? "Restart Recording"
              : "Start Recording"}
        </Button>
        <Button
          disabled={!audioBlob || microphoneState === MicrophoneState.Open}
          onClick={() => onNext()}
          className="self-end"
          size="xl"
        >
          Analyze Recording
        </Button>
      </CardFooter>
    </Card>
  );
}
