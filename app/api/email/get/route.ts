import { NextRequest, NextResponse } from "next/server";

/**
 * /api/email/get
 *
 * GET → GET /api/v1/email/get
 * Passes all query params through verbatim.
 * Required: host, user, password, uid
 * Optional: port, secure, mailbox, includeAttachmentContent
 */

const BACKEND =
  process.env.YANTRAMATE_API_URL?.replace(/\/$/, "") ?? "http://localhost:3011";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const qs = searchParams.toString();

  try {
    const upstream = await fetch(`${BACKEND}/api/v1/email/get?${qs}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      signal: AbortSignal.timeout(30_000),
    });
    const data = await upstream.json();
    return NextResponse.json(data, { status: upstream.status });
  } catch (err: unknown) {
    const isTimeout = err instanceof Error && err.name === "TimeoutError";
    console.error("[/api/email/get GET]", err);
    return NextResponse.json(
      {
        success: false,
        error: isTimeout
          ? "IMAP connection timed out. Please try again."
          : "Could not reach the YantraMate backend. Is it running?",
      },
      { status: isTimeout ? 504 : 502 }
    );
  }
}

/**
 * POST variant — body fields forwarded as query params.
 */
export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid JSON body." }, { status: 400 });
  }

  const qs = new URLSearchParams(
    Object.fromEntries(
      Object.entries(body)
        .filter(([, v]) => v !== undefined && v !== null)
        .map(([k, v]) => [k, String(v)])
    )
  ).toString();

  try {
    const upstream = await fetch(`${BACKEND}/api/v1/email/get?${qs}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      signal: AbortSignal.timeout(30_000),
    });
    const data = await upstream.json();
    return NextResponse.json(data, { status: upstream.status });
  } catch (err: unknown) {
    const isTimeout = err instanceof Error && err.name === "TimeoutError";
    console.error("[/api/email/get POST->GET]", err);
    return NextResponse.json(
      {
        success: false,
        error: isTimeout
          ? "IMAP connection timed out. Please try again."
          : "Could not reach the YantraMate backend. Is it running?",
      },
      { status: isTimeout ? 504 : 502 }
    );
  }
}
