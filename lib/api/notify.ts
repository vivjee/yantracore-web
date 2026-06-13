import { z } from "zod";

export const NotifySchema = z.object({
  email: z.string().email("Invalid email"),
  product: z.enum(["restroverse", "jimbo"]),
});

export type NotifyPayload = z.infer<typeof NotifySchema>;

/**
 * v1: validates locally, persists to localStorage.
 * v2: swap implementation to POST to Node API notify-on-launch endpoint.
 */
export async function notifyOnLaunch(
  payload: NotifyPayload
): Promise<{ ok: true } | { ok: false; error: string }> {
  const parsed = NotifySchema.safeParse(payload);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  if (typeof window !== "undefined") {
    console.info("[v1 stub] notifyOnLaunch", parsed.data);
    const existing = JSON.parse(localStorage.getItem("yc.signals") ?? "[]");
    existing.push({ ts: Date.now(), kind: "notify", payload: parsed.data });
    localStorage.setItem("yc.signals", JSON.stringify(existing));
  }

  return { ok: true };
}
