import { NextRequest, NextResponse } from "next/server";

/**
 * /api/drive/sync
 *
 * GET  → GET  /api/v1/drive/sync/status
 * POST ?action=bootstrap → POST /api/v1/drive/sync/bootstrap
 * POST ?action=delta     → POST /api/v1/drive/sync/delta
 */

const BACKEND =
  process.env.YANTRAMATE_API_URL?.replace(/\/$/, "") ?? "http://localhost:3011";

export async function GET() {
  try {
    const upstream = await fetch(`${BACKEND}/api/v1/drive/sync/status`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      signal: AbortSignal.timeout(15_000),
    });
    const data = await upstream.json();
    return NextResponse.json(data, { status: upstream.status });
  } catch (err: unknown) {
    const isTimeout = err instanceof Error && err.name === "TimeoutError";
    console.error("[/api/drive/sync GET]", err);
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

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const action = searchParams.get("action") ?? "delta";

  if (action !== "bootstrap" && action !== "delta") {
    return NextResponse.json(
      { success: false, error: `Unknown action: ${action}. Use bootstrap or delta.` },
      { status: 400 }
    );
  }

  const path =
    action === "bootstrap"
      ? "/api/v1/drive/sync/bootstrap"
      : "/api/v1/drive/sync/delta";

  try {
    const upstream = await fetch(`${BACKEND}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: AbortSignal.timeout(60_000),
    });
    const data = await upstream.json();
    return NextResponse.json(data, { status: upstream.status });
  } catch (err: unknown) {
    const isTimeout = err instanceof Error && err.name === "TimeoutError";
    console.error(`[/api/drive/sync POST ?action=${action}]`, err);
    return NextResponse.json(
      {
        success: false,
        error: isTimeout
          ? "Sync timed out — Drive may have many files. Try again shortly."
          : "Could not reach the YantraMate backend. Is it running?",
      },
      { status: isTimeout ? 504 : 502 }
    );
  }
}
