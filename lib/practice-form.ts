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
  transcriptAnalyzed: z.object({
    transcriptText: z.string(),
    durationSeconds: z.number(),
    wordsPerMinute: z.number(),
    fillerWordCount: z.number(),
    fillerWords: z.array(z.string()),
    pauseCount: z.number(),
    clarityScore: z.number(),
    confidenceScore: z.number(),
    paceScore: z.number(),
  }).optional(),
  speechFeedback: z.object({
    summary: z.string(),
    scores: z.object({
      clarity: z.number(),
      confidence: z.number(),
      pace: z.number(),
    }),
    strengths: z.array(z.string()),
    improvements: z.array(z.string()),
    tips: z.array(z.string()),
    practiceExercises: z.array(z.object({
      title: z.string(),
      instructions: z.string(),
    })),
  }).optional(),
});
export type PracticeFormValues = z.infer<typeof masterSchema>;
