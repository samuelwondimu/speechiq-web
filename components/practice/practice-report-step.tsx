"use client";

import { useEffect, type ReactNode } from "react";
import {
  AlertTriangle,
  Brain,
  CheckCircle2,
  Clock,
  Gauge,
  Mic2,
  PauseCircle,
  Sparkles,
  Target,
} from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { useFormContext } from "react-hook-form";
import { PracticeFormValues } from "@/lib/practice-form";
import LottieWave from "../lottie-wave";

function MetricCard({
  label,
  value,
  icon,
  helper,
}: {
  label: string;
  value: string | number;
  icon: ReactNode;
  helper?: string;
}) {
  return (
    <Card className="bg-muted/20">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">{icon}</span>
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold text-foreground">{value}</div>
        {helper ? (
          <p className="text-muted-foreground mt-1 text-xs">{helper}</p>
        ) : null}
      </CardContent>
    </Card>
  );
}

export default function PracticeReportStep() {
  const { setValue, watch } = useFormContext<PracticeFormValues>();
  const revTranscript = watch("revTranscript");
  const transcriptAnalyzed = watch("transcriptAnalyzed");
  const feedbackJson = watch("speechFeedback");

  useEffect(() => {
    const runAnalysis = async () => {
      if (!revTranscript || !transcriptAnalyzed) return;

      const response = await fetch("/api/analyze/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ metrics: transcriptAnalyzed }),
      });

      if (!response.ok) return;

      const data = await response.json();
      setValue("speechFeedback", data, { shouldValidate: false });
    };
    void runAnalysis();
  }, [revTranscript, transcriptAnalyzed, setValue]);

  if (!feedbackJson) {
    return (
      <Card>
        <CardHeader className="border-b">
          <h1 className="text-3xl font-bold text-foreground">
            Generating your practice report...
          </h1>
        </CardHeader>
        {/* <CardContent className="w-full h-64 flex items-center justify-center">
          <LottieWave />
        </CardContent> */}
      </Card>
    );
  }

  return (
    <Card className="shadow-sm">
      <CardHeader className="border-b">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="gap-1">
                <Sparkles className="size-3" /> AI Report
              </Badge>
              <Badge variant="outline" className="gap-1">
                <Brain className="size-3" />
              </Badge>
            </div>
            <h1 className="text-xl font-bold text-foreground mt-4">
              Practice Report
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <Badge variant="outline" className="gap-1">
              <Clock className="size-3" />
            </Badge>
          </div>
        </div>
        <p className="text-muted-foreground mt-2 text-sm">
          {feedbackJson.summary}
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Performance metrics
              </h2>
              <p className="text-muted-foreground text-xs">
                Overall delivery metrics from your session.
              </p>
            </div>
            <Badge variant="outline" className="gap-1">
              <Target className="size-3" /> Session focus
            </Badge>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              label="Words per minute"
              value={`${transcriptAnalyzed?.wordsPerMinute} wpm`}
              icon={<Gauge className="size-4" />}
              helper="Target range: 120 - 160 wpm"
            />
            <MetricCard
              label="Filler words"
              value={transcriptAnalyzed?.fillerWordCount ?? 0}
              icon={<Mic2 className="size-4" />}
              helper="Lower is better"
            />
            <MetricCard
              label="Pauses"
              value={transcriptAnalyzed?.pauseCount ?? 0}
              icon={<PauseCircle className="size-4" />}
              helper="Aim for intentional breaks"
            />
            <MetricCard
              label="Pace score"
              value={`${transcriptAnalyzed?.paceScore.toFixed(1)} / 10`}
              icon={<Clock className="size-4" />}
              helper="Smooth rhythm and tempo"
            />
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader className="border-b">
              <CardTitle className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="size-4 text-emerald-600" /> Strengths
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm text-muted-foreground">
                {feedbackJson.strengths.map((strength) => (
                  <li key={strength} className="flex gap-2 items-center">
                    <CheckCircle2 className="size-4 text-emerald-600" />
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="border-b">
              <CardTitle className="flex items-center gap-2 text-sm">
                <AlertTriangle className="size-4 text-amber-600" />
                Growth opportunities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm text-muted-foreground">
                {feedbackJson.improvements.map((improvement) => (
                  <li key={improvement} className="flex gap-2 items-center">
                    <AlertTriangle className="size-4 text-amber-600" />
                    <span>{improvement}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>

        <section className="grid grid-cols-1">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Delivery scores
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {[
              {
                label: "Clarity",
                value: transcriptAnalyzed?.clarityScore ?? 0,
              },
              {
                label: "Confidence",
                value: transcriptAnalyzed?.confidenceScore ?? 0,
              },
              {
                label: "Pace",
                value: transcriptAnalyzed?.paceScore ?? 0,
              },
            ].map((item, index) => (
              <MetricCard
                key={index}
                label={item.label}
                value={`${item.value.toFixed(1)} / 10`}
                icon={null}
                helper="Smooth rhythm and tempo"
              />
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Recommended exercises
              </h2>
              <p className="text-muted-foreground text-xs">
                Actionable drills to improve your next session.
              </p>
            </div>
            <Badge variant="outline" className="gap-1">
              <Sparkles className="size-3" /> AI curated
            </Badge>
          </div>
          <Card>
            <CardContent>
              <Accordion>
                {feedbackJson.practiceExercises.map((exercise) => (
                  <AccordionItem key={exercise.title} value={exercise.title}>
                    <AccordionTrigger className="text-sm">
                      <div className="flex flex-1 flex-wrap items-center gap-2">
                        <span className="font-medium text-foreground">
                          {exercise.title}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3 text-sm text-muted-foreground">
                        <p>{exercise.instructions}</p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </section>
      </CardContent>

      <CardFooter className="flex flex-wrap justify-between gap-3">
        <div className="text-xs text-muted-foreground">
          Keep practicing to improve your speaking confidence and clarity.
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm">
            Save report
          </Button>
          <Button size="sm">Start next practice</Button>
        </div>
      </CardFooter>
    </Card>
  );
}
