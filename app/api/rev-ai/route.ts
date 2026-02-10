import { RevAiApiClient } from "revai-node-sdk";
import { Readable } from "stream";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_POLL_ATTEMPTS = 60;
const POLL_INTERVAL_MS = 2000;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function POST(request: Request) {
	const token = process.env.REVAI_ACCESS_TOKEN;

	if (!token) {
		return new Response(
			JSON.stringify({ error: "Missing REVAI_ACCESS_TOKEN" }),
			{ status: 500 },
		);
	}

	const formData = await request.formData();
	const file = formData.get("file");

	if (!file || !(file instanceof File)) {
		return new Response(JSON.stringify({ error: "Missing audio file" }), {
			status: 400,
		});
	}

	const arrayBuffer = await file.arrayBuffer();
	const buffer = Buffer.from(arrayBuffer);
	const stream = Readable.from(buffer);

	const client = new RevAiApiClient(token);

	try {
		const job = await client.submitJobAudioData(stream, file.name || "audio.webm", {
			skip_postprocessing: true,
		});

		let attempt = 0;
		let status = "in_progress";
		while (attempt < MAX_POLL_ATTEMPTS) {
			const details = await client.getJobDetails(job.id);
			status = details.status;
			if (status === "transcribed") break;
			if (status === "failed") {
				return new Response(
					JSON.stringify({ error: "Transcription failed", jobId: job.id }),
					{ status: 500 },
				);
			}
			attempt += 1;
			await sleep(POLL_INTERVAL_MS);
		}

		if (status !== "transcribed") {
			return new Response(
				JSON.stringify({ error: "Transcription timed out", jobId: job.id }),
				{ status: 504 },
			);
		}

		const transcriptText = await client.getTranscriptObject(job.id);
		return new Response(
			JSON.stringify({ transcript: transcriptText, jobId: job.id }),
			{ status: 200, headers: { "Content-Type": "application/json" } },
		);
	} catch (error) {
		console.error("Rev AI transcription error:", error);
		return new Response(JSON.stringify({ error: "Transcription error" }), {
			status: 500,
		});
	}
}
