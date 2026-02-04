import { Badge } from "@/components/ui/badge";
import type { ComponentType, SVGProps } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowRight,
  Speech,
  Highlighter,
  MessageSquareQuote,
  Signal,
  FileText,
  Eye,
  BarChart,
  TrendingUp,
  Award,
} from "lucide-react";

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

interface FeatureProps {
  title: string;
  description: string;
  icons: IconComponent[];
}

const features: FeatureProps[] = [
  {
    title: "Real Time AI Speech Feedback",
    description:
      "Record your voice and get instant, actionable feedback on clarity, confidence, pacing, filler words, and delivery so you know exactly what to improve after every practice.",
    icons: [Speech, Signal, MessageSquareQuote],
  },
  {
    title: "Transcript Based Insights",
    description:
      "Every session is transcribed and analyzed. See highlighted filler words, pauses, and pacing issues directly in your transcript for clear, concrete improvements.",
    icons: [FileText, Highlighter, Eye],
  },
  {
    title: "Progress You Can Measure",
    description:
      "Track your speaking performance over time with clear scores and metrics. Watch your clarity, confidence, and delivery improve session by session. Set goals and celebrate.",
    icons: [BarChart, TrendingUp, Award],
  },
];

const featureList: string[] = [
  "Instant AI coaching after every practice",
  "See exactly where you lose clarity or confidence",
  "Filler word detection and pacing analysis",
  "Track measurable improvement over time",
  "Practice privately before real-world speaking",
  "Optimized for presentations, interviews, and pitches",
  "Modern, minimalist interface",
  "Accessible on any device",
  "Upgrade anytime as you grow",
];

export const Features = () => {
  return (
    <section id="features" className="max-w-7xl mx-auto px-6 space-y-12 py-24">
      <h2 className="text-3xl lg:text-4xl font-bold">
        Many{" "}
        <span className="bg-linear-to-r from-primary to-primary/10 text-transparent bg-clip-text animate-gradient">
          Great Features
        </span>
      </h2>

      <div className="flex flex-wrap md:justify-left gap-4">
        {featureList.map((feature: string) => (
          <div key={feature}>
            <Badge variant="default" className="text-md p-3">
              {feature}
            </Badge>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map(({ title, description, icons }: FeatureProps) => (
          <Card key={title}>
            <CardHeader>
              <CardTitle className="text-lg font-bold text-primary">
                {title}
              </CardTitle>
            </CardHeader>

            <CardContent className="text-[16px]">{description}</CardContent>

            <CardFooter className="w-full p-0 ">
              <div className="grid grid-cols-5 w-full">
                {icons.flatMap((Icon, index) => {
                  const iconCell = (
                    <div
                      key={`icon-${index}`}
                      className="flex items-center justify-center h-20"
                    >
                      <div className="inline-flex items-center justify-center w-12 text-primary">
                        <Icon className="h-6 w-6" aria-hidden />
                      </div>
                    </div>
                  );

                  if (index < icons.length - 1) {
                    const arrowCell = (
                      <div
                        key={`arrow-${index}`}
                        className="flex items-center justify-center h-20"
                      >
                        <ArrowRight className="h-6 w-6 text-accent/40" />
                      </div>
                    );

                    return [iconCell, arrowCell];
                  }

                  return [iconCell];
                })}
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
};
