import { getSessionFromRequest } from "@/lib/auth";
import { RevAiApiClient } from "revai-node-sdk";
import { Readable } from "stream";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";

const MAX_POLL_ATTEMPTS = 60;
const POLL_INTERVAL_MS = 2000;
const FREE_TRIAL_MINUTES = 10;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function getUserUsage(userId: string) {
  const usage = await prisma.usage.findUnique({ where: { userId } });
  if (usage) return usage;

  return prisma.usage.create({
    data: { userId, minutesUsed: 0, sessionsUsed: 0, resetAt: new Date() },
  });
}

function checkFreeTrial(
  planTier: string,
  minutesUsed: number,
  minutesToCharge: number,
) {
  if (
    planTier === "FREE" &&
    minutesUsed + minutesToCharge > FREE_TRIAL_MINUTES
  ) {
    return true;
  }
  return false;
}

async function pollJobUntilDone(client: RevAiApiClient, jobId: string) {
  for (let attempt = 0; attempt < MAX_POLL_ATTEMPTS; attempt++) {
    const details = await client.getJobDetails(jobId);
    if (details.status === "transcribed") return details;
    if (details.status === "failed") throw new Error("Transcription failed");
    await sleep(POLL_INTERVAL_MS);
  }
  throw new Error("Transcription timed out");
}

export async function POST(request: Request) {
  const session = await getSessionFromRequest(request);
  const user = session?.user;
  if (!user)
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });

  const formData = await request.formData();
  const file = formData.get("file");
  const durationField = formData.get("durationSeconds");

  if (!file || !(file instanceof File))
    return new Response(JSON.stringify({ error: "Missing audio file" }), {
      status: 400,
    });

  const durationSeconds = Number(durationField);
  if (!durationSeconds || isNaN(durationSeconds))
    return new Response(
      JSON.stringify({ error: "Could not determine audio duration" }),
      { status: 400 },
    );

  const minutesToCharge = Number((durationSeconds / 60).toFixed(3));

  const userData = await prisma.user.findUnique({
    where: { id: user.id },
    select: { usage: true, planTier: true },
  });
  if (!userData)
    return new Response(JSON.stringify({ error: "User not found" }), {
      status: 404,
    });

  const usage = await getUserUsage(user.id);

  if (checkFreeTrial(userData.planTier, usage.minutesUsed, minutesToCharge)) {
    return new Response(
      JSON.stringify({
        error: "Free trial limit reached",
        minutesUsed: usage.minutesUsed,
        minutesAllowed: FREE_TRIAL_MINUTES,
      }),
      { status: 402 },
    );
  }

  const token = process.env.REVAI_ACCESS_TOKEN;
  if (!token)
    return new Response(
      JSON.stringify({ error: "Missing REVAI_ACCESS_TOKEN" }),
      { status: 500 },
    );

  const client = new RevAiApiClient(token);
  const buffer = Buffer.from(await file.arrayBuffer());
  const stream = Readable.from(buffer);

  try {
    const job = await client.submitJobAudioData(
      stream,
      file.name || "audio.webm",
      { skip_postprocessing: true },
    );
    await pollJobUntilDone(client, job.id);

    const transcriptText = await client.getTranscriptObject(job.id);

    await prisma.usage.update({
      where: { userId: user.id },
      data: {
        minutesUsed: { increment: minutesToCharge },
        sessionsUsed: { increment: 1 },
      },
    });

    return new Response(
      JSON.stringify({ transcript: transcriptText, jobId: job.id }),
      { status: 200 },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: (error as Error).message || "Transcription error" }),
      { status: 500 },
    );
  }
}
