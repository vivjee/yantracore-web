import { z } from "zod";

/** Inquiry categories offered in the contact form's subject dropdown. */
export const INQUIRY_TYPES = [
  { value: "general", label: "General Inquiry" },
  { value: "project", label: "New Project / Quote" },
  { value: "support", label: "Support" },
  { value: "partnership", label: "Partnership" },
  { value: "press", label: "Press / Media" },
  { value: "careers", label: "Careers" },
  { value: "other", label: "Other" },
] as const;

export type InquiryType = (typeof INQUIRY_TYPES)[number]["value"];

const INQUIRY_VALUES = INQUIRY_TYPES.map((t) => t.value) as [InquiryType, ...InquiryType[]];

/** Attachment metadata — the binary stays client-side in v1; v2 uploads it. */
const AttachmentSchema = z.object({
  name: z.string().max(260),
  size: z.number().nonnegative(),
  type: z.string().max(160),
});

export type ContactAttachment = z.infer<typeof AttachmentSchema>;

export const ContactSchema = z.object({
  name: z.string().min(1, "Name is required").max(120),
  email: z.string().email("Invalid email"),
  phone: z.string().max(40).optional(),
  company: z.string().max(160).optional(),
  website: z.string().max(200).optional(),
  inquiryType: z.enum(INQUIRY_VALUES).default("general"),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000),
  attachments: z.array(AttachmentSchema).max(5).optional(),
});

// Input type: `inquiryType` carries a default and `attachments` is optional, so
// callers may omit them (e.g. the lightweight Signal form sends just name/email/message).
export type ContactPayload = z.input<typeof ContactSchema>;

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
