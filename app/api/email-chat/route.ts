import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/email-chat
 *
 * Thin server-side proxy to the YantraMate backend's POST /api/v1/email-chat.
 * Body: { accountId: string, question: string }
 * Response: same shape as /api/ask → { success, data: { answer, sources, … } }
 *
 * Running server-side keeps the backend URL and credentials out of
 * the client bundle, and avoids CORS issues.
 */

const BACKEND =
  process.env.YANTRAMATE_API_URL?.replace(/\/$/, "") ?? "http://localhost:3011";

export async function POST(req: NextRequest) {
  let body: unknown;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid JSON body." },
      { status: 400 }
    );
  }

  const b = body as Record<string, unknown>;

  // Validate required fields — backend expects { message, connectionId }
  if (
    typeof body !== "object" ||
    body === null ||
    typeof b.message !== "string" ||
    !b.message
  ) {
    return NextResponse.json(
      {
        success: false,
        error: "Missing required field: message.",
      },
      { status: 400 }
    );
  }

  try {
    const upstream = await fetch(`${BACKEND}/api/v1/email/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // Forward all fields the client sends (message, connectionId, accountUser, history)
      body: JSON.stringify(b),
      signal: AbortSignal.timeout(60_000),
    });

    const data = await upstream.json();
    return NextResponse.json(data, { status: upstream.status });
  } catch (err: unknown) {
    const isTimeout = err instanceof Error && err.name === "TimeoutError";
    console.error("[/api/email-chat proxy]", err);
    return NextResponse.json(
      {
        success: false,
        error: isTimeout
          ? "The AI backend took too long to respond. Please try again."
          : "Could not reach the YantraMate backend. Is it running?",
      },
      { status: isTimeout ? 504 : 502 }
    );
  }
}
