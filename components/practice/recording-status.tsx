import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useAudioRecorder } from "./audio-recoder";
import { Button } from "@/components/ui/button";
import { Mic, MicOff } from "lucide-react";
import { Textarea } from "../ui/textarea";

function RecordingStatus() {
  const { elapsedSeconds, isRecording, start, stop, registerCanvas } =
    useAudioRecorder();
  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <Card className="w-full flex items-center h-full justify-between pb-0 pt-9">
        <div className="relative h-64 w-64">
          {isRecording && (
            <div className="absolute inset-11 flex items-center justify-center pointer-events-none">
              <span className="absolute inline-block w-full h-full rounded-full bg-primary opacity-30 animate-ping" />
              <span className="absolute inline-block w-full h-full rounded-full bg-primary opacity-30 animate-ping" />
              <span className="absolute inline-block w-full h-full rounded-full bg-primary opacity-30 animate-ping" />
            </div>
          )}
          <Button
            onClick={() => (isRecording ? stop() : start())}
            className="rounded-full h-64 w-64 flex items-center justify-center text-5xl hover:cursor-pointer"
            aria-pressed={isRecording}
            variant={isRecording ? "default" : "secondary"}
          >
            {isRecording ? (
              <Mic className="size-36" />
            ) : (
              <MicOff className="size-36" />
            )}
          </Button>
        </div>

        <div className="text-center text-6xl font-extrabold font-mono mt-4">
          {new Date(elapsedSeconds * 1000).toISOString().substr(14, 5)} / 02:00
        </div>

        <CardHeader className="h-24 w-full flex items-center justify-center">
          <canvas
            ref={registerCanvas}
            style={{
              width: "100%",
              height: 96,
              borderRadius: 6,
            }}
          />
        </CardHeader>
        <CardContent className="w-full px-0">
          <div className="text-muted-foreground text-sm py-4 px-2">
            Auto-saved locally
          </div>
          <Textarea
            value={""}
            className="h-44 text-lg!"
            placeholder="transcriptions"
          />
        </CardContent>
      </Card>
    </div>
  );
}

export default RecordingStatus;
