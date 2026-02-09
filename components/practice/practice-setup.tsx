import { PracticeTabs, practiceTypeData } from "@/constants/practice-type-data";
import { Button } from "../ui/button";
import CheckAudioAccess from "./check-audio-access";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface PracticeSetupProps {
  setTab: (tab: PracticeTabs) => void;
}

export default function PracticeSetup({ setTab }: PracticeSetupProps) {
  return (
    <Card>
      <CardHeader className="border-b">
        <h1 className="text-3xl font-bold text-foreground">
          Get Ready to Practice
        </h1>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-16">
        <CheckAudioAccess
          onAccessChange={(hasAccess) => {
            if (!hasAccess) {
              alert(
                "Microphone access is required to practice. Please allow access and refresh the page.",
              );
            }
          }}
        />
        <div className="text-muted-foreground flex flex-col items-start">
          <h2 className="text-2xl font-semibold text-foreground">
            Welcome to Practice Mode
          </h2>
          <p className="mt-2 text-lg">
            In this mode, you can practice your speech and get real-time
            feedback on your performance. Make sure to allow microphone access
            when prompted, and find a quiet space to get the best results.
          </p>
          <Label className="mt-4 text-lg text-foreground">
            Select your practice mode
          </Label>
          <Select>
            <SelectTrigger className="w-full h-14! text-lg mt-4">
              <SelectValue placeholder="Select a practice mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {practiceTypeData.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <p className="mt-4! text-lg">
            {practiceTypeData.find((t) => t.value === "speech-practice")
              ?.description || ""}
          </p>
        </div>
      </CardContent>

      <CardFooter className="flex justify-end">
        <Button onClick={() => setTab(PracticeTabs.Recording)} size="xl">
          Start Practice
        </Button>
      </CardFooter>
    </Card>
  );
}
