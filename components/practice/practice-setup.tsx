"use client";

import { useEffect, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import { practiceTypeData } from "@/constants/practice-type-data";
import { Button } from "../ui/button";
import CheckAudioAccess from "./check-audio-access";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { PracticeFormValues } from "@/lib/practice-form";
import {
  MicrophoneState,
  useMicrophone,
} from "@/context/MicrophoneContextProvider";

interface PracticeSetupProps {
  onNext: () => Promise<void>;
}

export default function PracticeSetup({ onNext }: PracticeSetupProps) {
  const { setValue, watch } = useFormContext<PracticeFormValues>();
  const [hasAudioAccess, setHasAudioAccess] = useState(false);
  const selectedType = watch("practiceType");
  const isNextDisabled = !hasAudioAccess || !selectedType;

  return (
    <Card>
      <CardHeader className="border-b">
        <h1 className="text-3xl font-bold text-foreground">
          Get Ready to Practice
        </h1>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-16">
        <CheckAudioAccess
          onAccessChange={(hasAccess) => {
            setHasAudioAccess(hasAccess);
            if (!hasAccess) {
              console.warn("Microphone access denied.");
            }
          }}
        />
        <div className="text-muted-foreground flex flex-col items-start">
          <h2 className="text-2xl font-semibold text-foreground">
            Welcome to Practice Mode
          </h2>
          <p className="mt-2 text-lg">
            In this mode, you can practice your speech and get real-time
            feedback on your performance.
          </p>

          <Label className="mt-4 text-lg text-foreground">
            Select your practice mode
          </Label>

          {/* 5. Connect Select to React Hook Form */}
          <Select
            value={selectedType}
            onValueChange={(value) => {
              if (value) {
                setValue("practiceType", value, { shouldValidate: true });
              }
            }}
          >
            <SelectTrigger className="w-full h-14! text-lg mt-4">
              <SelectValue placeholder="Select a practice mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {practiceTypeData.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <p className="mt-4! text-lg italic text-primary">
            {practiceTypeData.find((t) => t.value === selectedType)
              ?.description || ""}
          </p>
        </div>
      </CardContent>

      <CardFooter className="flex justify-end gap-4 items-center">
        {!hasAudioAccess && (
          <p className="text-sm text-destructive font-medium">
            Please enable microphone access to continue.
          </p>
        )}
        <Button onClick={() => onNext()} size="xl" disabled={isNextDisabled}>
          {hasAudioAccess ? "Start Practice" : "Waiting for Mic..."}
        </Button>
      </CardFooter>
    </Card>
  );
}
