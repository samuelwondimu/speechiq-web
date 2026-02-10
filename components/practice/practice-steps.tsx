"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tabs, TabsContent } from "@/components/ui/tabs";

import { masterSchema, PracticeFormValues } from "@/lib/practice-form";

import StepRecord from "./step-record";
import PracticeSetup from "./practice-setup";
import PracticeAnalysisStep from "./practice-analysis-step";
import PracticeReportStep from "./practice-report-step";
import { PracticeTabs } from "@/constants/practice-type-data";
import { MicrophoneContextProvider } from "@/context/MicrophoneContextProvider";

export function PracticeSteps() {
  const [activeTab, setActiveTab] = useState<PracticeTabs>(
    PracticeTabs.PracticeSetup,
  );

  const methods = useForm<PracticeFormValues>({
    resolver: zodResolver(masterSchema),
    defaultValues: {
      practiceType: undefined,
      audioBlob: undefined,
      transcript: "",
      revTranscript: undefined,
    },
  });

  const { handleSubmit, trigger } = methods;

  const handleNextStep = async (nextTab: PracticeTabs) => {
    let isValid = false;

    if (activeTab === PracticeTabs.PracticeSetup) {
      isValid = await trigger(["practiceType"]);
    } else if (activeTab === PracticeTabs.Recording) {
      isValid = await trigger(["audioBlob"]);
    } else {
      isValid = true;
    }

    if (isValid) setActiveTab(nextTab);
  };

  const onSubmit = (data: PracticeFormValues) => {
    console.log("Final Submission Data:", data);
  };

  return (
    <MicrophoneContextProvider>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Tabs value={activeTab} className="w-full">
            <TabsContent value={PracticeTabs.PracticeSetup}>
              <PracticeSetup
                onNext={() => handleNextStep(PracticeTabs.Recording)}
              />
            </TabsContent>

            <TabsContent value={PracticeTabs.Recording}>
              <StepRecord
                onNext={() => handleNextStep(PracticeTabs.Analysis)}
                onBack={() => setActiveTab(PracticeTabs.PracticeSetup)}
              />
            </TabsContent>

            <TabsContent value={PracticeTabs.Analysis}>
              <PracticeAnalysisStep
                onNext={() => handleNextStep(PracticeTabs.Report)}
              />
            </TabsContent>

            <TabsContent value={PracticeTabs.Report}>
              <PracticeReportStep />
            </TabsContent>
          </Tabs>
        </form>
      </FormProvider>
    </MicrophoneContextProvider>
  );
}
