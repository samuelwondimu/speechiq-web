import { RecentSessions } from "@/components/dashboard/recent-sessions";
import StartNewPractice from "@/components/dashboard/start-new-practice";
import { StatsCard } from "@/components/dashboard/stats-card";

const recentSessionsData = [
  {
    id: "1",
    date: "2024-06-01 at 2:30 PM",
    duration: "15m",
    clarityScore: 8,
    status: "Completed",
    confidenceScore: 7,
    paceScore: 6,
  },
  {
    id: "2",
    date: "2024-06-03 at 10:00 AM",
    duration: "20m",
    clarityScore: 9,
    confidenceScore: 8,
    status: "Completed",
    paceScore: 7,
  },
];

export default function DashboardPage() {
  return (
    <div>
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex items-end justify-end">
            <StartNewPractice />
          </div>
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <StatsCard />
            <h2 className="text-2xl font-bold">Recent Sessions</h2>

            <RecentSessions data={recentSessionsData} />
          </div>
        </div>
      </div>
    </div>
  );
}
