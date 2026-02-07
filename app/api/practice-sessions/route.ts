import prisma from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const session = await getSessionFromRequest(request);
    if (!session?.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const { audioUrl, durationSeconds } = await request.json();

    if (!audioUrl || typeof audioUrl !== "string" || typeof durationSeconds !== "number") {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400 },
      );
    }

    const practiceSession = await prisma.practiceSession.create({
      data: {
        userId: session.user.id,
        audioUrl,
        durationSeconds,
      },
    });

    return new Response(JSON.stringify(practiceSession), { status: 201 });
  } catch (error) {
    console.error("Error creating practice session:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
