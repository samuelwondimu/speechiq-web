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
import { Card, CardHeader, CardFooter } from "@/components/ui/card";
import RecorderControls from "@/components/practice/recorder-controls";
import RecordingStatus from "./recording-status";
import { PracticeTabs } from "@/constants/practice-type-data";

interface StepRecordProps {
  setTab: (tab: PracticeTabs) => void;
}

export default function StepRecord({ setTab }: StepRecordProps) {
  return (
    <div className="flex flex-col justify-between w-full lg:flex-row gap-4 h-[90vh]">
      <RecordingStatus />
      <div className="grid place-items-start gap-6 w-full max-w-full h-full">
        <Card className="w-full h-full">
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
            <Button
              onClick={() => setTab(PracticeTabs.Analysis)}
              className="self-end"
            >
              Analyze Recording
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
