import { z } from "zod";

export const ProjectSchema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email(),
  company: z.string().max(120).optional(),
  projectType: z.enum(["web", "app", "api", "cloud", "ai", "design", "other"]),
  budget: z.enum(["under-10k", "10k-25k", "25k-50k", "50k-plus", "discuss"]).optional(),
  message: z.string().min(10).max(4000),
});

export type ProjectPayload = z.infer<typeof ProjectSchema>;

/**
 * v1: validates locally, logs to console, persists to localStorage.
 * v2: swap implementation to POST to Node API submit-project endpoint.
 */
export async function submitProject(
  payload: ProjectPayload
): Promise<{ ok: true } | { ok: false; error: string }> {
  const parsed = ProjectSchema.safeParse(payload);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  if (typeof window !== "undefined") {
    console.info("[v1 stub] submitProject", parsed.data);
    const existing = JSON.parse(localStorage.getItem("yc.signals") ?? "[]");
    existing.push({ ts: Date.now(), kind: "project", payload: parsed.data });
    localStorage.setItem("yc.signals", JSON.stringify(existing));
  }

  return { ok: true };
}
