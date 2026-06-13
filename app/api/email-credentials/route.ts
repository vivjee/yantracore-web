import { NextRequest, NextResponse } from "next/server";

/**
 * /api/email-credentials
 *
 * GET  → list all saved email accounts
 *         proxies → GET  {BACKEND}/api/email-credentials
 *
 * POST → add / register a new email account
 *         body: { email, password, provider, label, host, port }
 *         proxies → POST {BACKEND}/api/email-credentials
 *
 * Running server-side keeps the backend URL and any future API keys
 * out of the client bundle, and avoids CORS issues.
 *
 * NOTE: The email endpoints are NOT versioned (/api/v1/…).
 * They live directly under /api/email-credentials on the backend.
 */

const BACKEND =
  process.env.YANTRAMATE_API_URL?.replace(/\/$/, "") ?? "http://localhost:3011";

/* ── GET ── list accounts ─────────────────────────────────────────── */
export async function GET() {
  try {
    const upstream = await fetch(`${BACKEND}/api/v1/email/credentials`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      signal: AbortSignal.timeout(15_000),
    });

    const data = await upstream.json();
    return NextResponse.json(data, { status: upstream.status });
  } catch (err: unknown) {
    const isTimeout = err instanceof Error && err.name === "TimeoutError";
    console.error("[/api/email-credentials GET proxy]", err);
    return NextResponse.json(
      {
        success: false,
        error: isTimeout
          ? "The backend took too long to respond."
          : "Could not reach the YantraMate backend. Is it running?",
      },
      { status: isTimeout ? 504 : 502 }
    );
  }
}

/* ── POST ── add account ──────────────────────────────────────────── */
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

  // Basic validation — backend expects { host, port, user, password, secure }
  if (
    typeof body !== "object" ||
    body === null ||
    !("user" in body) ||
    typeof (body as Record<string, unknown>).user !== "string" ||
    !(body as Record<string, unknown>).user
  ) {
    return NextResponse.json(
      { success: false, error: "Missing required field: user." },
      { status: 400 }
    );
  }

  try {
    const upstream = await fetch(`${BACKEND}/api/v1/email/credentials`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(20_000),
    });

    const data = await upstream.json();
    return NextResponse.json(data, { status: upstream.status });
  } catch (err: unknown) {
    const isTimeout = err instanceof Error && err.name === "TimeoutError";
    console.error("[/api/email-credentials POST proxy]", err);
    return NextResponse.json(
      {
        success: false,
        error: isTimeout
          ? "The backend took too long to respond."
          : "Could not reach the YantraMate backend. Is it running?",
      },
      { status: isTimeout ? 504 : 502 }
    );
  }
}
