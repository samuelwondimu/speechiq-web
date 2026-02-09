"use client";

import { useState } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { AudioRecorderProvider } from "./audio-recoder";
import StepRecord from "./step-record";
import PracticeSetup from "./practice-setup";
import PracticeAnalysisStep from "./practice-analysis-step";
import PracticeReportStep from "./practice-report-step";
import { PracticeTabs } from "@/constants/practice-type-data";

export function PracticeSteps() {
  const [activeTab, setActiveTab] = useState<PracticeTabs>(
    PracticeTabs.PracticeSetup,
  );

  const tabs = [
    {
      value: PracticeTabs.PracticeSetup,
      label: "Practice Setup",
      component: <PracticeSetup setTab={setActiveTab} />,
    },
    {
      value: PracticeTabs.Recording,
      label: "Recording",
      component: <StepRecord setTab={setActiveTab} />,
    },
    {
      value: PracticeTabs.Analysis,
      label: "Analysis",
      component: <PracticeAnalysisStep setTab={setActiveTab} />,
    },
    {
      value: PracticeTabs.Report,
      label: "Report",
      component: <PracticeReportStep />,
    },
  ];

  return (
    <AudioRecorderProvider onRecordingComplete={(blob) => console.log(blob)}>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {tabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            {tab.component}
          </TabsContent>
        ))}
      </Tabs>
    </AudioRecorderProvider>
  );
}
