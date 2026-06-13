import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/ask
 *
 * Thin server-side proxy to the YantraMate backend's POST /api/v1/ask.
 * Running this server-side means:
 *   1. No CORS issues — same-origin from the browser's perspective.
 *   2. Backend URL stays out of the client bundle.
 *   3. Easy place to inject auth headers later (API key, bearer token, etc.).
 *
 * Configure the backend URL via YANTRAMATE_API_URL in .env.local.
 * Falls back to http://localhost:3011 for local dev.
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

  // Basic validation — question is required
  if (
    typeof body !== "object" ||
    body === null ||
    !("question" in body) ||
    typeof (body as Record<string, unknown>).question !== "string" ||
    !(body as Record<string, unknown>).question
  ) {
    return NextResponse.json(
      { success: false, error: "Missing required field: question." },
      { status: 400 }
    );
  }

  try {
    const upstream = await fetch(`${BACKEND}/api/v1/ask`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Future: "Authorization": `Bearer ${process.env.YANTRAMATE_API_KEY}`,
      },
      body: JSON.stringify(body),
      // Allow up to 60 s for long AI responses
      signal: AbortSignal.timeout(60_000),
    });

    const data = await upstream.json();

    return NextResponse.json(data, { status: upstream.status });
  } catch (err: unknown) {
    const isTimeout =
      err instanceof Error && err.name === "TimeoutError";

    console.error("[/api/ask proxy]", err);

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
