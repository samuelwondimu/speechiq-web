import { z } from "zod";

export const practiceSetupSchema = z.object({
  practiceType: z.enum(["speech-practice", "qa-practice"], {
    message: "Select a practice mode",
  }),
});

export const recordingSchema = z.object({
  audioBlob: z.instanceof(Blob, { message: "Recording is required" }),
});

export const masterSchema = practiceSetupSchema.merge(recordingSchema).extend({
  transcript: z.string().optional(),
  revTranscript: z.any().optional(),
});
export type PracticeFormValues = z.infer<typeof masterSchema>;
