import { NextRequest, NextResponse } from "next/server";

/**
 * /api/drive
 *
 * GET ?action=health   → GET  /api/v1/drive/health
 * GET ?action=projects → GET  /api/v1/drive/projects
 * GET ?action=tree     → GET  /api/v1/drive/tree
 */

const BACKEND =
  process.env.YANTRAMATE_API_URL?.replace(/\/$/, "") ?? "http://localhost:3011";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const action = searchParams.get("action") ?? "projects";

  const pathMap: Record<string, string> = {
    health:   "/api/v1/drive/health",
    projects: "/api/v1/drive/projects",
    tree:     "/api/v1/drive/tree",
  };

  const path = pathMap[action];
  if (!path) {
    return NextResponse.json(
      { success: false, error: `Unknown action: ${action}` },
      { status: 400 }
    );
  }

  try {
    const upstream = await fetch(`${BACKEND}${path}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      signal: AbortSignal.timeout(20_000),
    });
    const data = await upstream.json();
    return NextResponse.json(data, { status: upstream.status });
  } catch (err: unknown) {
    const isTimeout = err instanceof Error && err.name === "TimeoutError";
    console.error(`[/api/drive GET ?action=${action}]`, err);
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
