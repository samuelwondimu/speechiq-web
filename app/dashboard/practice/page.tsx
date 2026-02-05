"use client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { AudioRecorderProvider } from "@/components/practice/audio-recoder";
import RecordingStatus from "@/components/practice/recording-status";
import RecorderControls from "@/components/practice/recorder-controls";

const PracticePage = () => {
  const questions = [
    {
      id: 1,
      text: "Introduce yourself in 30 seconds",
      hint: "Focus on name, role, and one achievement",
    },
    {
      id: 2,
      text: "Describe a recent challenge you solved",
      hint: "State the problem and your approach",
    },
    {
      id: 3,
      text: "Pitch your product in one minute",
      hint: "Highlight value and audience",
    },
  ];

  return (
    <AudioRecorderProvider onRecordingComplete={(blob) => console.log(blob)}>
      <div className="flex flex-col justify-between w-full lg:flex-row gap-4 h-[90vh]">
        <RecordingStatus />
        <div className="grid place-items-start gap-6 w-full max-w-full">
          <Card className="w-full">
            <CardHeader>
              <div className="flex flex-col items-start gap-3 w-full">
                <Label className="text-2xl font-extrabold">Practice Type</Label>
                <Select>
                  <SelectTrigger className="w-full h-14! text-xl font-bold">
                    <SelectValue placeholder="Theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardHeader>
              <CardTitle>Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-decimal space-y-4 text-sm">
                {questions.map((q) => (
                  <li key={q.id} className="flex flex-col">
                    <div className="flex items-center justify-between gap-3">
                      <div className="font-bold text-xl">{q.text}</div>
                      <div className="text-muted-foreground text-lg">Hint</div>
                    </div>
                    <div className="text-muted-foreground mt-1 text-lg">
                      {q.hint}
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="gap-3">
              <div className="text-muted-foreground text-sm">
                3 practice prompts
              </div>
              <div className="ml-auto">
                <Button size="lg">Shuffle</Button>
              </div>
            </CardFooter>
            <CardFooter>
              <RecorderControls />
            </CardFooter>
          </Card>
        </div>
      </div>
    </AudioRecorderProvider>
  );
};

export default PracticePage;
