// app/api/analyze/metrics/route.ts

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
  "you know",
  "ah",
]);

export async function POST(req: Request) {
  const { transcript } = (await req.json()) as { transcript: RevTranscript };

  if (!transcript) {
    return new Response(JSON.stringify({ error: "Missing transcript" }), {
      status: 400,
    });
  }

  const words: RevWord[] = [];
  const fillerWords: string[] = [];

  let startTime = Infinity;
  let endTime = 0;

  for (const m of transcript.monologues ?? []) {
    for (const el of m.elements ?? []) {
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
  const wpm =
    durationSeconds > 0
      ? Math.round((wordCount / durationSeconds) * 60)
      : 0;

  // ---------------------------
  // PAUSE DETECTION (ADVANCED)
  // ---------------------------
  let pauseCount = 0;
  let longPauses = 0;

  for (let i = 1; i < words.length; i++) {
    const gap = words[i].ts - words[i - 1].end_ts;

    if (gap >= 0.6) pauseCount++;
    if (gap >= 1.2) longPauses++;
  }

  // ---------------------------
  // CLARITY SCORE
  // ---------------------------
  const avgWordConfidence =
    words.reduce((s, w) => s + w.confidence, 0) / Math.max(1, wordCount);

  const fillerPenalty = Math.min(0.15, fillerWords.length * 0.03);
  const clarityScore = Number(
    ((avgWordConfidence * (1 - fillerPenalty)) * 10).toFixed(1)
  );

  // ---------------------------
  // PACE SCORE (CURVE-BASED)
  // ---------------------------
  let paceScore = 10;
  if (wpm < 110) paceScore -= (110 - wpm) * 0.05;
  if (wpm > 160) paceScore -= (wpm - 160) * 0.04;
  paceScore = Math.max(0, Number(paceScore.toFixed(1)));

  // ---------------------------
  // CONFIDENCE SCORE (DECAY MODEL)
  // ---------------------------
  let confidenceScore = 10;

  confidenceScore -= fillerWords.length * 0.6;
  confidenceScore -= longPauses * 0.8;

  // Ending hesitation penalty
  const lastQuarterIndex = Math.floor(words.length * 0.75);
  const lateFillers = words
    .slice(lastQuarterIndex)
    .filter(w => FILLER_WORDS.has(w.value.toLowerCase())).length;

  confidenceScore -= lateFillers * 0.8;

  confidenceScore = Math.max(0, Number(confidenceScore.toFixed(1)));

  const transcriptText = words.map(w => w.value).join(" ");

  return new Response(
    JSON.stringify({
      transcriptText,
      durationSeconds: Number(durationSeconds.toFixed(2)),
      wordsPerMinute: wpm,
      fillerWordCount: fillerWords.length,
      fillerWords,
      pauseCount,
      clarityScore,
      confidenceScore,
      paceScore,
    }),
    { headers: { "Content-Type": "application/json" } }
  );
}
