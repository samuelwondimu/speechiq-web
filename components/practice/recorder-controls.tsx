import React from "react";
import { Button } from "@/components/ui/button";
import { useAudioRecorder } from "./audio-recoder";

export default function RecorderControls() {
  const { start, stop, isRecording, lastBlob } = useAudioRecorder();
  return (
    <div className="flex justify-between w-full gap-3">
      <div>
        <Button
          onClick={() => {
            if (isRecording) {
              stop();
            } else {
              start();
            }
          }}
          size="xl"
          className="h-16 text-xl mr-4 hover:cursor-pointer"
        >
          {isRecording ? "Restart" : "Start"}
        </Button>
      </div>
      <Button
        disabled={isRecording || !lastBlob}
        onClick={() => {}}
        size="xl"
        className="h-16 text-xl hover:cursor-pointer"
      >
        Stop & Analyze
      </Button>
    </div>
  );
}
