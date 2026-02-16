import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import LottieWave from "../lottie-wave";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { PracticeFormValues } from "@/lib/practice-form";

interface PracticeAnalysisStepProps {
  onNext: () => Promise<void>;
}
export default function PracticeAnalysisStep({
  onNext,
}: PracticeAnalysisStepProps) {
  const { setValue, watch } = useFormContext<PracticeFormValues>();
  const revTranscript = watch("revTranscript");
  const transcriptAnalyzed = watch("transcriptAnalyzed");

  useEffect(() => {
    const runAnalysis = async () => {
      if (!revTranscript || transcriptAnalyzed) return;

      const response = await fetch("/api/analyze/metrics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript: revTranscript }),
      });

      if (!response.ok) return;

      const data = await response.json();
      setValue("transcriptAnalyzed", data, { shouldValidate: false });
    };

    void runAnalysis();
  }, [revTranscript, transcriptAnalyzed, setValue]);
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
        {transcriptAnalyzed ? (
          <div>
            <h2 className="text-4xl font-semibold text-foreground">
              Your practice report is ready!
            </h2>
            <p>clarityScore: {transcriptAnalyzed.clarityScore}</p>
            <p>confidenceScore: {transcriptAnalyzed.confidenceScore}</p>
            <p>paceScore: {transcriptAnalyzed.paceScore}</p>
            <p>durationSeconds: {transcriptAnalyzed.durationSeconds}</p>
            <p>wordsPerMinute: {transcriptAnalyzed.wordsPerMinute}</p>
            <p>fillerWordCount: {transcriptAnalyzed.fillerWordCount}</p>
            <p>fillerWords: {transcriptAnalyzed.fillerWords.join(", ")}</p>
            <p>pauseCount: {transcriptAnalyzed.pauseCount}</p>
          </div>
        ) : (
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
        )}
      </CardContent>
      <CardFooter className="flex justify-end gap-4 items-center">
        <Button onClick={() => onNext()} size="xl">
          View Report
        </Button>
      </CardFooter>
    </Card>
  );
}
