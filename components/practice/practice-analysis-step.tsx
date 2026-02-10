import LottieWave from "../lottie-wave";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";

// Progress steps:

// Transcribing

// Analyzing

// Generating feedback show next step

interface PracticeAnalysisStepProps {
  onNext: () => Promise<void>;
}
export default function PracticeAnalysisStep({ onNext }: PracticeAnalysisStepProps) {
  return (
    <Card>
      <CardHeader className="border-b">
        <h1 className="text-3xl font-bold text-foreground">
          Step 3: Analyzing Your Practice Report
        </h1>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-16 items-center justify-center">
        <div className="w-full h-full flex items-center justify-center">
          <LottieWave />
        </div>
        <div className="text-muted-foreground flex flex-col items-center justify-center text-center">
          <h2 className="text-4xl font-semibold text-foreground">
            Your practice report is bing generated
          </h2>
          <p className="mt-2 text-lg">
            Our AI is analyzing your speech for <br />
            clarity, <br />
            confidence, <br />
            pacing, <br />
            and filler words. This may take a moment.
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-4 items-center">
        <Button onClick={() => onNext()} size="xl">
          View Report
        </Button>
      </CardFooter>
    </Card>
  );
}
