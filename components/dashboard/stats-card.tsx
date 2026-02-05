import { TrendingDown, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export function StatsCard() {
  const sessionsThisMonth = 12; // Example static data
  const avgClarity = 8.5; // Example static data
  const avgConfidence = 7.8; // Example static data
  const avgPace = 6.9; // Example static data
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Sessions This Month</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {sessionsThisMonth}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <TrendingUp /> {sessionsThisMonth > 0 ? "+100%" : "0%"}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Track your speaking practice
          </div>
          <div className="text-muted-foreground">
            Total sessions completed this month
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Average Clarity Score</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {avgClarity.toFixed(1)} / 10
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {avgClarity >= 7 ? <TrendingUp /> : <TrendingDown />}
              {avgClarity >= 7 ? "+ " : "- "}
              {avgClarity.toFixed(1)}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="flex gap-2 font-medium">
            Measure your speech clarity
          </div>
          <div className="text-muted-foreground">
            Higher clarity helps you sound confident and professional
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Average Confidence Score</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {avgConfidence.toFixed(1)} / 10
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {avgConfidence >= 7 ? <TrendingUp /> : <TrendingDown />}
              {avgConfidence >= 7 ? "+ " : "- "}
              {avgConfidence.toFixed(1)}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Your delivery confidence
          </div>
          <div className="text-muted-foreground">
            AI helps you track and improve session by session
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Average Pace Score</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {avgPace.toFixed(1)} / 10
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {avgPace >= 7 ? <TrendingUp /> : <TrendingDown />}
              {avgPace >= 7 ? "+ " : "- "}
              {avgPace.toFixed(1)}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Maintain an optimal pace
          </div>
          <div className="text-muted-foreground">
            Speak at a pace that keeps your audience engaged
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
