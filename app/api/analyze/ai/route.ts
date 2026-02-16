import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { z } from "zod";
import { SpeechFeedbackOutput } from "@/types/speechFeedback";

const apiKey = process.env.AI_GATEWAY_API_KEY;

const openai = new OpenAI({
  apiKey,
  baseURL: "https://ai-gateway.vercel.sh/v1",
});

const metricsSchema = z.object({
  transcriptText: z.string(),
  durationSeconds: z.number(),
  wordsPerMinute: z.number(),
  fillerWordCount: z.number(),
  fillerWords: z.array(z.string()),
  pauseCount: z.number(),
  clarityScore: z.number(),
  confidenceScore: z.number(),
  paceScore: z.number(),
});

const inputSchema = z
  .union([z.object({ metrics: metricsSchema }), metricsSchema])
  .transform((data) => ("metrics" in data ? data.metrics : data));

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = inputSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request payload", details: parsed.error.issues },
        { status: 400 },
      );
    }

    const metrics = parsed.data;

    const prompt = `
                    You are an expert speech and communication coach.

                    You analyze recorded spoken responses and provide clear, constructive, and actionable feedback.
                    The user is practicing spoken communication (presentations, interviews, pitches, or general speaking).
                    Your goal is to help them sound clearer, more confident, and more effective — not to judge them.

                    --------------------------------
                    INPUT
                    --------------------------------
                    Full transcript:
                    ${metrics.transcriptText}

                    Metrics:
                    - durationSeconds: ${metrics.durationSeconds}
                    - wordsPerMinute: ${metrics.wordsPerMinute}
                    - fillerWordCount: ${metrics.fillerWordCount}
                    - fillerWords: ${metrics.fillerWords.join(", ")}
                    - pauseCount: ${metrics.pauseCount}
                    - clarityScore: ${metrics.clarityScore}
                    - confidenceScore: ${metrics.confidenceScore}
                    - paceScore: ${metrics.paceScore}

                    --------------------------------
                    OUTPUT REQUIREMENTS
                    --------------------------------
                    Return valid JSON ONLY with this structure:
                    {
                      "summary": string,
                      "scores": {
                        "clarity": number,
                        "confidence": number,
                        "pace": number
                      },
                      "strengths": string[],
                      "improvements": string[],
                      "tips": string[],
                      "practiceExercises": {
                        "title": string,
                        "instructions": string
                      }[]
                    }
                    No explanations, no markdown, no extra text.
                    `;

    const completion = await openai.chat.completions.create({
      model: "openai/gpt-5.2",
      stream: false,
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that provides feedback on spoken communication based on provided metrics and transcripts.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "SpeechFeedbackOutput",
          description:
            "Structured feedback for improving spoken communication based on transcript and metrics analysis.",
          schema: {
            type: "object",
            properties: {
              summary: { type: "string" },
              scores: {
                type: "object",
                properties: {
                  clarity: { type: "number" },
                  confidence: { type: "number" },
                  pace: { type: "number" },
                },
              },
              strengths: {
                type: "array",
                items: { type: "string" },
              },
              improvements: {
                type: "array",
                items: { type: "string" },
              },
              tips: {
                type: "array",
                items: { type: "string" },
              },
              practiceExercises: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    title: { type: "string" },
                    instructions: { type: "string" },
                  },
                },
              },
            },
          },
        },
      },
    });
    const structuredData = JSON.parse(
      completion.choices[0].message.content as string,
    ) as {
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
    };
    return NextResponse.json(structuredData as SpeechFeedbackOutput);
  } catch (err) {
    console.error("Feedback API error:", err);
    return NextResponse.json(
      { error: "Invalid request or server error" },
      { status: 400 },
    );
  }
}
