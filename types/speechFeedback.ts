// types/speechFeedback.ts
export interface SpeechMetrics {
  transcriptText: string;
  durationSeconds: number;
  wordsPerMinute: number;
  fillerWordCount: number;
  fillerWords: string[];
  pauseCount: number;
  clarityScore: number;
  confidenceScore: number;
  paceScore: number;
}

export interface SpeechFeedbackOutput {
  summary: string;
  scores: {
    clarity: number;
    confidence: number;
    pace: number;
  };
  strengths: string[];
  improvements: string[];
  tips: string[];
  practiceExercises: {
    title: string;
    instructions: string;
  }[];
}
