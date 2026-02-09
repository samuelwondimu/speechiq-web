import { PracticeTabs } from "@/constants/practice-type-data";
import { Button } from "../ui/button";

interface PracticeAnalysisStepProps {
  setTab: (tab: PracticeTabs) => void;
}
export default function PracticeAnalysisStep({
  setTab,
}: PracticeAnalysisStepProps) {
  return (
    <div>
      PracticeAnalysisStep
      <Button onClick={() => setTab(PracticeTabs.Report)} className="mt-4">
        View Report
      </Button>
    </div>
  );
}
