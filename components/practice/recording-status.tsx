"use client";

import { Button } from "@/components/ui/button";

import {
  MicrophoneState,
  useMicrophone,
} from "@/context/MicrophoneContextProvider";
import { Mic, MicOff } from "lucide-react";
import Visualizer from "./visualizer";
import { useEffect } from "react";

function RecordingStatus() {
  const {
    microphone,
    setupMicrophone,
    startMicrophone,
    stopMicrophone,
    microphoneState,
  } = useMicrophone();

  useEffect(() => {
    setupMicrophone();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col items-center justify-center gap-6 text-center">
      <div className="h-64 w-64">
        <Button
          onClick={() =>
            microphoneState === MicrophoneState.Open
              ? stopMicrophone()
              : startMicrophone()
          }
          className="rounded-full h-64 w-64 flex items-center justify-center text-5xl hover:cursor-pointer"
          aria-pressed={microphoneState === MicrophoneState.Open}
          variant={
            microphoneState === MicrophoneState.Open ? "default" : "secondary"
          }
        >
          {microphoneState === MicrophoneState.Open ? (
            <Mic className="size-36" />
          ) : (
            <MicOff className="size-36" />
          )}
        </Button>
      </div>
      {microphone && <Visualizer microphone={microphone} />}
    </div>
  );
}

export default RecordingStatus;
