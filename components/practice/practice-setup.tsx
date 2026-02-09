import { PracticeTabs } from "@/constants/practice-type-data";
import { Button } from "../ui/button";

interface PracticeSetupProps {
  setTab: (tab: PracticeTabs) => void;
}

export default function PracticeSetup({ setTab }: PracticeSetupProps) {
  return (
    <div>
      {/* check for audio access */}

      {/* select practice type */}

      {/* continue to the next step */}
      <Button onClick={() => setTab(PracticeTabs.Recording)} className="mt-4">
        Start Practice
      </Button>
    </div>
  );
}
