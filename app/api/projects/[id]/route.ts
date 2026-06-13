import { NextRequest, NextResponse } from "next/server";

/**
 * /api/projects/[id]
 *
 * GET → GET /api/v1/projects/{id}/files
 * Returns indexed files for a specific project.
 */

const BACKEND =
  process.env.YANTRAMATE_API_URL?.replace(/\/$/, "") ?? "http://localhost:3011";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      { success: false, error: "Missing project id." },
      { status: 400 }
    );
  }

  try {
    const upstream = await fetch(
      `${BACKEND}/api/v1/projects/${encodeURIComponent(id)}/files`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        signal: AbortSignal.timeout(15_000),
      }
    );
    const data = await upstream.json();
    return NextResponse.json(data, { status: upstream.status });
  } catch (err: unknown) {
    const isTimeout = err instanceof Error && err.name === "TimeoutError";
    console.error(`[/api/projects/${id}/files GET]`, err);
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
