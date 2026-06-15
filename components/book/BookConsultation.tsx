"use client";

import { useMemo, useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Check, Loader2, AlertCircle, CalendarCheck } from "lucide-react";
import { Eyebrow } from "@/components/typography/Eyebrow";
import { GlassInput } from "@/components/glass/GlassInput";
import { AnimatedBorder } from "@/components/glass/AnimatedBorder";
import { BudgetEstimator } from "./BudgetEstimator";
import {
  estimate,
  projectTypes,
  timelines,
  bucketLabels,
  type ProjectTypeId,
  type ScopeId,
  type TimelineId,
} from "@/lib/content/estimator";
import { submitProject } from "@/lib/api/project";
import { audioSynth } from "@/lib/audio";
import { cn } from "@/lib/utils/cn";

type FormState = "idle" | "loading" | "success" | "error";

/**
 * BookConsultation — the /book page body. Two stacked panels under one form:
 *   1. Project details — the estimator (type · scope · add-ons), timeline, and brief.
 *   2. Your details — contact fields + submit.
 * Submit goes through the `submitProject` Zod stub (localStorage in v1; swap to
 * the Node API in v2). Mirrors the contact page's scroll/glass/success patterns.
 *
 * NOTE: panel titles use <div>, not <header> — `body.app-mode-active header`
 * (set by TvFrame) is `display:none` site-wide to hide the floating nav pill.
 */
export function BookConsultation() {
  // Estimator selections
  const [projectType, setProjectType] = useState<ProjectTypeId>("web");
  const [scope, setScope] = useState<ScopeId>("medium");
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);

  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [timeline, setTimeline] = useState<TimelineId | null>(null);
  const [message, setMessage] = useState("");

  const [formState, setFormState] = useState<FormState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const est = useMemo(() => estimate(projectType, scope, selectedAddOns), [projectType, scope, selectedAddOns]);

  const typeLabel = projectTypes.find((t) => t.id === projectType)?.label ?? projectType;

  const toggleAddOn = (id: string) =>
    setSelectedAddOns((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const canSubmit =
    formState !== "loading" && name.trim().length > 0 && /.+@.+\..+/.test(email) && message.trim().length >= 10;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    setFormState("loading");
    audioSynth.playClick();

    await new Promise((r) => setTimeout(r, 900));

    // Accept bare domains (example.com) by assuming https://
    const rawSite = website.trim();
    const normalizedSite = rawSite && !/^https?:\/\//i.test(rawSite) ? `https://${rawSite}` : rawSite;

    const res = await submitProject({
      name: name.trim(),
      email: email.trim(),
      company: company.trim() ? company.trim() : undefined,
      phone: phone.trim() ? phone.trim() : undefined,
      website: normalizedSite ? normalizedSite : undefined,
      projectType,
      budget: est.bucket,
      timeline: timeline ?? undefined,
      message: message.trim(),
    });

    if (res.ok) {
      setFormState("success");
      audioSynth.playCrtOn();
    } else {
      setFormState("error");
      setErrorMessage(res.error);
      audioSynth.playStatic();
    }
  };

  const resetForm = () => {
    audioSynth.playClick();
    setFormState("idle");
    setName("");
    setEmail("");
    setCompany("");
    setPhone("");
    setWebsite("");
    setTimeline(null);
    setMessage("");
  };

  return (
    <main className="no-scrollbar relative z-10 h-full min-h-screen w-full overflow-y-auto px-6 pb-24 pt-12 md:pt-20">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-9 text-center">
          <Eyebrow tone="accent">Start a Project</Eyebrow>
          <h1
            className="mt-3 text-4xl font-bold uppercase tracking-tight text-text-hi md:text-5xl"
            style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.01em" }}
          >
            Book a{" "}
            <span className="bg-gradient-to-r from-accent-1 to-accent-2 bg-clip-text text-transparent">
              Consultation
            </span>
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-text-mid md:text-base">
            Shape your project below and send it over — we’ll reply with a tailored plan and quote.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {formState === "success" ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="relative overflow-hidden rounded-3xl glass-medium border border-emerald-500/20 p-8 text-center md:p-10"
            >
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10">
                <Check className="h-8 w-8 text-emerald-400" />
              </div>
              <h2 className="mb-3 font-mono text-2xl font-bold text-text-hi">REQUEST RECEIVED</h2>
              <p className="mx-auto max-w-md text-sm leading-relaxed text-text-mid">
                Thanks — we’ve got your {typeLabel.toLowerCase()} brief at{" "}
                <span className="text-text-hi">{bucketLabels[est.bucket]}</span>. We’ll review it and
                get back to you with a tailored plan and quote shortly.
              </p>
              <button
                onClick={resetForm}
                className="mt-8 cursor-pointer rounded-xl border border-white/[0.08] bg-white/[0.02] px-5 py-2.5 font-mono text-xs text-text-mid transition-all hover:border-white/[0.18] hover:text-text-hi"
              >
                Start another
              </button>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              noValidate
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="flex flex-col gap-6"
            >
              {/* ── Step 01 · Project details ── */}
              <AnimatedBorder variant="sweep" radius={24} duration={9000}>
                <div className="rounded-3xl glass-heavy p-6 md:p-8">
                  <div className="mb-8 flex flex-col gap-2">
                    <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent-2">
                      Step 01
                    </span>
                    <h2 className="text-xl font-semibold text-text-hi md:text-2xl">
                      Project details
                    </h2>
                    <p className="text-sm leading-relaxed text-text-mid">
                      What you’re building, how big it is, when you need it, and a short brief — this
                      shapes the plan and quote we send back.
                    </p>
                  </div>

                  <div className="flex flex-col gap-10">
                    <BudgetEstimator
                      projectType={projectType}
                      scope={scope}
                      selectedAddOns={selectedAddOns}
                      onTypeChange={setProjectType}
                      onScopeChange={setScope}
                      onToggleAddOn={toggleAddOn}
                    />

                    {/* Timeline */}
                    <fieldset className="flex flex-col gap-4">
                      <legend className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-text-mid">
                        When do you need it?{" "}
                        <span className="text-text-low normal-case tracking-normal">(optional)</span>
                      </legend>
                      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                        {timelines.map((t) => {
                          const active = t.id === timeline;
                          return (
                            <button
                              key={t.id}
                              type="button"
                              aria-pressed={active}
                              onMouseEnter={() => audioSynth.playHover()}
                              onClick={() => {
                                audioSynth.playClick();
                                setTimeline(active ? null : t.id);
                              }}
                              disabled={formState === "loading"}
                              className={cn(
                                "relative flex cursor-pointer flex-col items-center gap-0.5 rounded-xl px-3 py-2.5 text-center transition-all duration-300",
                                "glass-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-2/60",
                                "disabled:cursor-not-allowed disabled:opacity-40",
                                active ? "" : "opacity-70 hover:opacity-100"
                              )}
                            >
                              <span
                                aria-hidden
                                className="pointer-events-none absolute inset-0 rounded-xl transition-opacity duration-300"
                                style={{
                                  opacity: active ? 1 : 0,
                                  boxShadow:
                                    "inset 0 0 0 1px color-mix(in srgb, var(--accent-2) 55%, transparent), 0 0 16px color-mix(in srgb, var(--accent-2) 25%, transparent)",
                                }}
                              />
                              <span
                                className="relative z-10 text-[12px] font-semibold"
                                style={{ color: active ? "var(--accent-2)" : "var(--text-hi)" }}
                              >
                                {t.label}
                              </span>
                              <span className="relative z-10 text-[9px] leading-tight text-text-low">
                                {t.blurb}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </fieldset>

                    {/* Project brief */}
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <label
                          htmlFor="book-message"
                          className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-mid"
                        >
                          About the project
                          <span className="ml-0.5 text-accent-2" aria-hidden>
                            *
                          </span>
                        </label>
                        <span
                          id="book-message-count"
                          className={cn(
                            "font-mono text-[10px]",
                            message.length > 4000 ? "text-red-400" : "text-text-low"
                          )}
                        >
                          {message.length} / 4000
                        </span>
                      </div>
                      <textarea
                        id="book-message"
                        name="message"
                        rows={5}
                        maxLength={4000}
                        placeholder="What are you trying to build, and what does success look like?"
                        required
                        aria-required
                        aria-describedby="book-message-count"
                        aria-invalid={message.length > 0 && message.trim().length < 10 ? true : undefined}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        disabled={formState === "loading"}
                        onFocus={() => audioSynth.playClick()}
                        className="glass-light w-full resize-none rounded-xl border border-white/[0.04] px-4 py-3.5 text-sm text-text-hi transition-all duration-300 placeholder:text-text-low focus:border-accent-1/30 focus:outline-none"
                        style={{ minHeight: "120px" }}
                      />
                    </div>
                  </div>
                </div>
              </AnimatedBorder>

              {/* ── Step 02 · Your details ── */}
              <div className="flex flex-col gap-6 rounded-3xl glass-heavy p-6 md:p-8">
                <div className="mb-2 flex flex-col gap-2">
                  <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent-2">
                    Step 02
                  </span>
                  <h2 className="text-xl font-semibold text-text-hi md:text-2xl">Your details</h2>
                  <p className="text-sm leading-relaxed text-text-mid">
                    Where to reach you — we’ll reply with a tailored plan and quote.
                  </p>
                </div>

                {errorMessage && (
                  <div
                    role="alert"
                    aria-live="assertive"
                    className="flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 font-mono text-sm text-red-400"
                  >
                    <AlertCircle size={18} className="mt-0.5 shrink-0 text-red-500" />
                    <div>
                      <span className="font-bold">ERROR:</span> {errorMessage}
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-5">
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <GlassInput
                      id="book-name"
                      name="name"
                      type="text"
                      label="Your Name"
                      placeholder="Your name"
                      autoComplete="name"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={formState === "loading"}
                      onFocus={() => audioSynth.playClick()}
                    />
                    <GlassInput
                      id="book-email"
                      name="email"
                      type="email"
                      label="Your Email"
                      placeholder="you@company.com"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={formState === "loading"}
                      onFocus={() => audioSynth.playClick()}
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <GlassInput
                      id="book-company"
                      name="company"
                      type="text"
                      label="Company (optional)"
                      placeholder="Company or project name"
                      autoComplete="organization"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      disabled={formState === "loading"}
                      onFocus={() => audioSynth.playClick()}
                    />
                    <GlassInput
                      id="book-phone"
                      name="phone"
                      type="tel"
                      inputMode="tel"
                      label="Phone (optional)"
                      placeholder="+1 555 000 1234"
                      autoComplete="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      disabled={formState === "loading"}
                      onFocus={() => audioSynth.playClick()}
                    />
                  </div>

                  <GlassInput
                    id="book-website"
                    name="website"
                    type="url"
                    inputMode="url"
                    label="Website (optional)"
                    placeholder="yourcompany.com"
                    autoComplete="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    disabled={formState === "loading"}
                    onFocus={() => audioSynth.playClick()}
                  />

                  <button
                    type="submit"
                    onMouseEnter={() => audioSynth.playHover()}
                    disabled={!canSubmit}
                    className={cn(
                      "glass-primary group mt-1 inline-flex w-full items-center justify-center gap-2.5 rounded-xl py-3.5",
                      "font-mono text-[0.95rem] font-semibold uppercase tracking-wider text-text-hi",
                      "cursor-pointer transition-all duration-500 ease-out",
                      "hover:shadow-[0_20px_40px_-10px_rgba(110,86,255,0.45)]",
                      "disabled:cursor-not-allowed disabled:opacity-35 disabled:shadow-none"
                    )}
                  >
                    {formState === "loading" ? (
                      <>
                        <Loader2 size={16} className="animate-spin text-accent-2" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <CalendarCheck size={15} />
                        <span>Request Consultation</span>
                        <Send
                          size={14}
                          className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        />
                      </>
                    )}
                  </button>

                  <p className="text-center text-[11px] leading-relaxed text-text-low">
                    Fields marked <span className="text-accent-2">*</span> are required. We’ll only use
                    your details to reply about your project — no spam, ever.
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-white/[0.04] pt-4 font-mono text-[10px] text-text-low">
                  <span>ESTIMATE: INDICATIVE</span>
                  <span>STORAGE: LOCAL</span>
                </div>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
