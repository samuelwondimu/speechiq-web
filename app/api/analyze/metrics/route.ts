export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RevWord = {
  type: "text";
  value: string;
  ts: number;
  end_ts: number;
  confidence: number;
};

type RevElement = RevWord | { type: "punct"; value: string };

type RevTranscript = {
  monologues: {
    speaker: number;
    elements: RevElement[];
  }[];
};

const FILLER_WORDS = new Set([
  "um",
  "uh",
  "erm",
  "like",
  "ah",
  "you know",
]);

export async function POST(request: Request) {
  const body = await request.json();

  const transcript: RevTranscript | undefined = body?.transcript;

  if (!transcript) {
    return new Response(
      JSON.stringify({ error: "Missing transcript" }),
      { status: 400 }
    );
  }

  const words: RevWord[] = [];
  const fillerWords: string[] = [];

  let startTime = Infinity;
  let endTime = 0;

  for (const monologue of transcript.monologues ?? []) {
    for (const el of monologue.elements ?? []) {
      if (el.type === "text") {
        words.push(el);
        startTime = Math.min(startTime, el.ts);
        endTime = Math.max(endTime, el.end_ts);

        if (FILLER_WORDS.has(el.value.toLowerCase())) {
          fillerWords.push(el.value.toLowerCase());
        }
      }
    }
  }

  const durationSeconds =
    startTime < Infinity ? endTime - startTime : 0;

  const wordCount = words.length;
  const minutes = durationSeconds > 0 ? durationSeconds / 60 : 0;
  const wordsPerMinute =
    minutes > 0 ? Math.round(wordCount / minutes) : 0;

  // Pause detection (>= 0.8s)
  let pauseCount = 0;
  for (let i = 1; i < words.length; i++) {
    const gap = words[i].ts - words[i - 1].end_ts;
    if (gap >= 0.8) pauseCount++;
  }

  // Clarity score (based on avg word confidence)
  const avgConfidence =
    wordCount > 0
      ? words.reduce((sum, w) => sum + w.confidence, 0) / wordCount
      : 0;

  const clarityScore = Math.min(
    10,
    Math.round(avgConfidence * 10 * 10) / 10
  );

  // Confidence score (fillers + pauses)
  let confidenceScore = 10;
  confidenceScore -= Math.min(4, fillerWords.length * 0.5);
  confidenceScore -= Math.min(4, pauseCount * 0.5);
  confidenceScore = Math.max(0, Math.round(confidenceScore * 10) / 10);

  // Pace score
  let paceScore = 10;
  if (wordsPerMinute < 90) paceScore -= 3;
  else if (wordsPerMinute > 170) paceScore -= 2;
  paceScore = Math.max(0, paceScore);

  const transcriptText = words.map(w => w.value).join(" ");

  return new Response(
    JSON.stringify({
      transcriptText,
      durationSeconds: Math.round(durationSeconds * 100) / 100,
      wordsPerMinute,
      fillerWordCount: fillerWords.length,
      fillerWords,
      pauseCount,
      clarityScore,
      confidenceScore,
      paceScore,
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}
