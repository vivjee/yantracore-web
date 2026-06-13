import { NextRequest, NextResponse } from "next/server";

/**
 * /api/email/list
 *
 * GET → GET /api/v1/email/list
 * Passes all query params through verbatim.
 * Required params (from client): host, user, password
 * Optional: port, secure, mailbox, limit, page, search, from, to,
 *           subject, since, before, seen, flagged, hasAttachment,
 *           includeBody, includeAttachments
 */

const BACKEND =
  process.env.YANTRAMATE_API_URL?.replace(/\/$/, "") ?? "http://localhost:3011";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  // Forward all query params to the backend
  const qs = searchParams.toString();

  try {
    const upstream = await fetch(`${BACKEND}/api/v1/email/list?${qs}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      signal: AbortSignal.timeout(30_000),
    });
    const data = await upstream.json();
    return NextResponse.json(data, { status: upstream.status });
  } catch (err: unknown) {
    const isTimeout = err instanceof Error && err.name === "TimeoutError";
    console.error("[/api/email/list GET]", err);
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
 * POST variant for clients that shouldn't put credentials in the URL.
 * Body is forwarded as query params.
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
    const upstream = await fetch(`${BACKEND}/api/v1/email/list?${qs}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      signal: AbortSignal.timeout(30_000),
    });
    const data = await upstream.json();
    return NextResponse.json(data, { status: upstream.status });
  } catch (err: unknown) {
    const isTimeout = err instanceof Error && err.name === "TimeoutError";
    console.error("[/api/email/list POST->GET]", err);
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
