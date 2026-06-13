import { NextRequest, NextResponse } from "next/server";

/**
 * /api/email/sync
 *
 * POST → POST /api/v1/email/sync
 * Body: { connectionId: string, mailbox?: string, limit?: number }
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

  if (
    typeof body !== "object" ||
    body === null ||
    !("connectionId" in body) ||
    typeof (body as Record<string, unknown>).connectionId !== "string" ||
    !(body as Record<string, unknown>).connectionId
  ) {
    return NextResponse.json(
      { success: false, error: "Missing required field: connectionId." },
      { status: 400 }
    );
  }

  try {
    const upstream = await fetch(`${BACKEND}/api/v1/email/sync`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(60_000),
    });
    const data = await upstream.json();
    return NextResponse.json(data, { status: upstream.status });
  } catch (err: unknown) {
    const isTimeout = err instanceof Error && err.name === "TimeoutError";
    console.error("[/api/email/sync POST]", err);
    return NextResponse.json(
      {
        success: false,
        error: isTimeout
          ? "Email sync timed out — your mailbox may be large. Try a smaller limit."
          : "Could not reach the YantraMate backend. Is it running?",
      },
      { status: isTimeout ? 504 : 502 }
    );
  }
}
