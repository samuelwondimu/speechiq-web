"use client";

import type { ReactNode } from "react";
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

// Example of feedbackJson structure from API
const feedbackJson = {
  summary:
    "Your speech was clear and well-paced. You used minimal filler words and maintained a confident tone throughout.",
  strengths: [
    "Clarity: You articulated each word distinctly, making it easy to understand.",
    "Confidence: Your voice sounded strong and steady, which engages the listener.",
    "Pacing: You maintained a consistent rhythm, avoiding rushing or long pauses.",
  ],
  improvements: [
    "Filler words: Try to reduce 'um' and 'uh' when thinking of your next point.",
    "Pauses: Some short pauses were slightly long; practice pausing strategically.",
    "Sentence endings: Consider using more varied intonation to emphasize key points.",
  ],
  exercises: [
    {
      title: "Filler Word Reduction",
      description:
        "Record yourself reading a short paragraph aloud, aiming to avoid 'um' and 'uh'. Review and repeat.",
      type: "recording_practice",
      targetMetric: {
        fillerCount: 0,
      },
    },
    {
      title: "Pacing Drill",
      description:
        "Read a passage using a metronome at 120 WPM to train consistent pacing.",
      type: "timed_practice",
      targetMetric: {
        wordsPerMinute: 120,
      },
    },
  ],
  metricsSummary: {
    wordsPerMinute: 145,
    fillerCount: 6,
    pauseCount: 12,
    clarityScore: 7.4,
    confidenceScore: 6.8,
    paceScore: 8.2,
  },
  aiModel: "gpt-4o-mini",
  aiCostCents: 3,
  generatedAt: "2026-02-09T14:35:00Z",
};

const formatMetricKey = (key: string) =>
  key
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/^./, (char) => char.toUpperCase());

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
  const generatedAt = new Date(feedbackJson.generatedAt);
  const metrics = feedbackJson.metricsSummary;

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
                <Brain className="size-3" /> {feedbackJson.aiModel}
              </Badge>
            </div>
            <h1 className="text-xl font-bold text-foreground mt-4">
              Practice Report
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <Badge variant="outline" className="gap-1">
              <Clock className="size-3" />
              {generatedAt.toLocaleString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
              })}
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
              value={`${metrics.wordsPerMinute} wpm`}
              icon={<Gauge className="size-4" />}
              helper="Target range: 120 - 160 wpm"
            />
            <MetricCard
              label="Filler words"
              value={metrics.fillerCount}
              icon={<Mic2 className="size-4" />}
              helper="Lower is better"
            />
            <MetricCard
              label="Pauses"
              value={metrics.pauseCount}
              icon={<PauseCircle className="size-4" />}
              helper="Aim for intentional breaks"
            />
            <MetricCard
              label="Pace score"
              value={`${metrics.paceScore.toFixed(1)} / 10`}
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
                value: metrics.clarityScore,
              },
              {
                label: "Confidence",
                value: metrics.confidenceScore,
              },
              {
                label: "Pace",
                value: metrics.paceScore,
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
                {feedbackJson.exercises.map((exercise) => (
                  <AccordionItem key={exercise.title} value={exercise.title}>
                    <AccordionTrigger className="text-sm">
                      <div className="flex flex-1 flex-wrap items-center gap-2">
                        <span className="font-medium text-foreground">
                          {exercise.title}
                        </span>
                        <Badge variant="secondary" className="uppercase">
                          {exercise.type.replace(/_/g, " ")}
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3 text-sm text-muted-foreground">
                        <p>{exercise.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(exercise.targetMetric).map(
                            ([key, value]) => (
                              <Badge key={key} variant="outline">
                                {formatMetricKey(key)}: {value}
                              </Badge>
                            ),
                          )}
                        </div>
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
