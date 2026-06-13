import { z } from "zod";

export const ContactSchema = z.object({
  name: z.string().min(1, "Name is required").max(120),
  email: z.string().email("Invalid email"),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000),
});

export type ContactPayload = z.infer<typeof ContactSchema>;

/**
 * v1: validates locally, logs to console, persists to localStorage.
 * v2: swap implementation to POST to Node API contact endpoint.
 */
export async function submitContact(
  payload: ContactPayload
): Promise<{ ok: true } | { ok: false; error: string }> {
  const parsed = ContactSchema.safeParse(payload);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  // v1 stub
  if (typeof window !== "undefined") {
    console.info("[v1 stub] submitContact", parsed.data);
    const existing = JSON.parse(localStorage.getItem("yc.signals") ?? "[]");
    existing.push({ ts: Date.now(), kind: "contact", payload: parsed.data });
    localStorage.setItem("yc.signals", JSON.stringify(existing));
  }

  return { ok: true };
}
