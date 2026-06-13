import { NextResponse } from "next/server";

/**
 * /api/projects
 *
 * GET → GET /api/v1/projects
 * Returns all projects mirrored from Google Drive into the vector DB.
 */

const BACKEND =
  process.env.YANTRAMATE_API_URL?.replace(/\/$/, "") ?? "http://localhost:3011";

export async function GET() {
  try {
    const upstream = await fetch(`${BACKEND}/api/v1/projects`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      signal: AbortSignal.timeout(15_000),
    });
    const data = await upstream.json();
    return NextResponse.json(data, { status: upstream.status });
  } catch (err: unknown) {
    const isTimeout = err instanceof Error && err.name === "TimeoutError";
    console.error("[/api/projects GET]", err);
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
