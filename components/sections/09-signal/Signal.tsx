"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, Loader2, Radio } from "lucide-react";
import { GlassInput } from "@/components/glass/GlassInput";
import { AnimatedBorder } from "@/components/glass/AnimatedBorder";
import { Container } from "@/components/layout/Container";
import { Eyebrow } from "@/components/typography/Eyebrow";
import { Footer } from "@/components/chrome/Footer";
import { Reveal } from "@/components/motion/Reveal";
import { CountUp } from "@/components/motion/CountUp";
import { submitContact } from "@/lib/api/contact";
import { cn } from "@/lib/utils/cn";

type FormState = "idle" | "loading" | "success" | "error";


function RadarVisual() {
  // Data blips positioned around the radar
  const blips = [
    { x: "62%", y: "28%", accent: "var(--accent-2)", delay: "0s", size: 6 },
    { x: "75%", y: "55%", accent: "var(--accent-1)", delay: "0.8s", size: 5 },
    { x: "38%", y: "70%", accent: "var(--accent-warm)", delay: "1.6s", size: 4 },
    { x: "22%", y: "38%", accent: "var(--accent-3)", delay: "2.4s", size: 5 },
    { x: "55%", y: "78%", accent: "var(--accent-2)", delay: "3.2s", size: 4 },
  ];

  return (
    <div className="relative aspect-square w-full max-w-[380px] mx-auto select-none" aria-hidden>
      {/* Outer glow */}
      <div
        style={{
          position: "absolute", inset: "-20%",
          background: "radial-gradient(circle, rgba(110,86,255,0.18) 0%, rgba(0,224,203,0.08) 40%, transparent 68%)",
          filter: "blur(30px)",
        }}
      />

      {/* Base circle */}
      <div
        style={{
          position: "absolute", inset: 0,
          borderRadius: "50%",
          border: "1px solid rgba(110,86,255,0.25)",
          background: "radial-gradient(circle, rgba(110,86,255,0.06) 0%, rgba(6,7,13,0.4) 70%)",
        }}
      />

      {/* Concentric rings */}
      {[0.25, 0.5, 0.75].map((r, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            borderRadius: "50%",
            border: "1px solid rgba(110,86,255,0.15)",
            width: `${r * 100}%`,
            height: `${r * 100}%`,
            top: `${(1 - r) * 50}%`,
            left: `${(1 - r) * 50}%`,
          }}
        />
      ))}

      {/* Cross hairs */}
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ position: "absolute", width: "100%", height: "1px", background: "rgba(110,86,255,0.12)" }} />
        <div style={{ position: "absolute", width: "1px", height: "100%", background: "rgba(110,86,255,0.12)" }} />
      </div>

      {/* Rotating sweep arm */}
      <div
        style={{
          position: "absolute", inset: 0,
          borderRadius: "50%",
          animation: "ring-spin-cw 4s linear infinite",
        }}
      >
        {/* Sweep gradient — quarter-circle arc */}
        <div
          style={{
            position: "absolute", inset: 0,
            borderRadius: "50%",
            background: "conic-gradient(from 0deg, transparent 0deg, rgba(0,224,203,0.45) 60deg, transparent 90deg)",
          }}
        />
        {/* Leading edge bright line */}
        <div
          style={{
            position: "absolute",
            top: 0, left: "50%",
            width: "1.5px",
            height: "50%",
            transformOrigin: "bottom center",
            background: "linear-gradient(180deg, rgba(0,224,203,0.9) 0%, transparent 100%)",
          }}
        />
      </div>

      {/* Data blips */}
      {blips.map((blip, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: blip.x, top: blip.y,
            width: blip.size, height: blip.size,
            borderRadius: "50%",
            background: blip.accent,
            boxShadow: `0 0 ${blip.size * 3}px ${blip.accent}`,
            animation: `cap-dot-pulse 2s ease-in-out ${blip.delay} infinite`,
          }}
        />
      ))}

      {/* Center node */}
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ position: "absolute", width: 48, height: 48, borderRadius: "50%", border: "1px solid rgba(0,224,203,0.4)", animation: "logo-pulse-ring 2.5s ease-out infinite" }} />
        <div style={{ position: "absolute", width: 28, height: 28, borderRadius: "50%", background: "rgba(0,224,203,0.15)", border: "1px solid rgba(0,224,203,0.6)" }} />
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--accent-2)", boxShadow: "0 0 12px var(--accent-2)", animation: "cap-dot-pulse 1.5s ease-in-out infinite" }} />
      </div>

      {/* Status label */}
      <div
        style={{
          position: "absolute", bottom: "8%", left: 0, right: 0,
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        }}
      >
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent-2)", boxShadow: "0 0 8px var(--accent-2)", animation: "cap-dot-pulse 2s ease-in-out infinite", display: "inline-block" }} />
        <span style={{ fontSize: 10, fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.2em", color: "var(--text-faint)" }}>
          Signal active · scanning
        </span>
      </div>
    </div>
  );
}


export function Signal() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [formState, setFormState] = useState<FormState>("idle");
  const [serverError, setServerError] = useState<string | null>(null);

  const isLoading = formState === "loading";

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setServerError(null);
    setFormState("loading");

    const result = await submitContact({ name, email, message });

    if (result.ok) {
      setFormState("success");
      setName("");
      setEmail("");
      setMessage("");
    } else {
      setFormState("error");
      setServerError(result.error);
    }
  }

  return (
    <section id="signal" className="relative overflow-hidden">
      {/* Section uses the global SiteBackground; just a dark-ish overlay for readability */}
      <div
        aria-hidden
        className="absolute inset-0 z-[1]"
        style={{
          background:
            "linear-gradient(180deg, rgba(6,7,13,0.55) 0%, rgba(6,7,13,0.75) 60%, var(--ink-0) 100%)",
        }}
      />

      <div className="relative z-10 py-32 md:py-48">
        <Container width="default">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
            {/* Left: header + form */}
            <div>

          {/* Header */}
          <Reveal>
            <Eyebrow>09 — Signal</Eyebrow>
          </Reveal>
          <Reveal delay={100}>
            <h2
              className="mt-6 font-semibold text-text-hi tracking-tight leading-[1.1] max-w-3xl"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2rem, 5.5vw, 4.5rem)",
              }}
            >
              Start a project.
              <br />
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, var(--accent-1), var(--accent-2))",
                }}
              >
                Or send a signal.
              </span>
            </h2>
          </Reveal>
          <Reveal delay={180}>
            <p className="mt-6 text-lg text-text-mid max-w-xl leading-relaxed">
              Whether you have a fully-formed brief or just the beginning of an
              idea — we want to hear it. We respond to every message personally.
            </p>
          </Reveal>

          {/* Contact form */}
          <Reveal delay={260} className="mt-16 max-w-xl">
            {formState === "success" ? (
              <div className="glass-medium rounded-3xl p-10 text-center">
                <div className="w-14 h-14 rounded-full bg-accent-1/20 border border-accent-1/40 flex items-center justify-center mx-auto mb-5">
                  <span className="text-2xl" aria-hidden>✓</span>
                </div>
                <h3 className="text-xl font-semibold text-text-hi mb-2">
                  Signal received.
                </h3>
                <p className="text-text-mid">
                  We&apos;ll be in touch shortly. Keep an eye on your inbox.
                </p>
              </div>
            ) : (
              <AnimatedBorder variant="sweep" radius={24} duration={8000}>
                <div className="glass-heavy rounded-3xl p-8 md:p-10">
                  {serverError && (
                    <div
                      role="alert"
                      className="mb-6 flex items-start gap-3 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-400"
                    >
                      <span aria-hidden className="mt-0.5 shrink-0">⚠</span>
                      <span>{serverError}</span>
                    </div>
                  )}

                  <form
                    onSubmit={handleSubmit}
                    noValidate
                    aria-label="Contact form"
                    className="flex flex-col gap-5"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <GlassInput
                        id="signal-name"
                        name="name"
                        type="text"
                        label="Name"
                        placeholder="Your name"
                        autoComplete="name"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={isLoading}
                      />
                      <GlassInput
                        id="signal-email"
                        name="email"
                        type="email"
                        label="Email"
                        placeholder="you@company.com"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor="signal-message"
                        className="text-sm font-medium text-text-mid"
                      >
                        Message
                      </label>
                      <textarea
                        id="signal-message"
                        name="message"
                        rows={4}
                        placeholder="Tell us about your project, or just say hello."
                        required
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        disabled={isLoading}
                        className="glass-light w-full rounded-xl px-4 py-3 text-text-hi placeholder:text-text-low focus:outline-none resize-none text-sm"
                        style={{ minHeight: "120px" }}
                      />
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={isLoading || !name || !email || !message}
                      id="signal-submit"
                      className={cn(
                        "glass-primary inline-flex items-center justify-center gap-2.5 rounded-xl px-6 py-3.5",
                        "font-semibold text-text-hi text-[0.95rem]",
                        "transition-all duration-500 ease-[var(--ease-out-soft)]",
                        "hover:shadow-[0_24px_48px_-12px_rgba(110,86,255,0.55)]",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-1 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-0",
                        "disabled:opacity-40 disabled:cursor-not-allowed",
                        "group"
                      )}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 size={16} className="animate-spin" aria-hidden />
                          <span>Sending…</span>
                        </>
                      ) : (
                        <>
                          <span>Send signal</span>
                          <ArrowRight
                            size={16}
                            aria-hidden
                            className="transition-transform duration-300 group-hover:translate-x-1"
                          />
                        </>
                      )}
                    </button>
                  </form>

                  <p className="mt-5 text-xs text-text-faint text-center">
                    In v1, submissions are stored locally. Real delivery coming in v2.
                  </p>
                </div>
              </AnimatedBorder>
            )}
          </Reveal>
            </div>

            {/* Right: animated radar visual */}
            <Reveal delay={300} className="hidden lg:block">
              <div className="relative sticky top-24">
                <RadarVisual />
                {/* Stats floating below */}
                <div className="mt-8 grid grid-cols-3 gap-4">
                  {[
                    { label: "Response time", to: 24, prefix: "<", suffix: "h", accent: "var(--accent-2)" },
                    { label: "Active clients", to: 25, suffix: "+",             accent: "var(--accent-1)" },
                    { label: "Uptime SLA",     to: 99.9, suffix: "%", decimals: 1, accent: "var(--accent-warm)" },
                  ].map((stat) => (
                    <div key={stat.label} className="glass-light rounded-2xl p-4 text-center relative overflow-hidden">
                      <div
                        aria-hidden
                        className="absolute inset-x-0 top-0 h-px"
                        style={{ background: `linear-gradient(90deg, transparent, ${stat.accent}, transparent)`, opacity: 0.7 }}
                      />
                      <p className="text-xl font-semibold font-mono" style={{ color: stat.accent }}>
                        <CountUp
                          to={stat.to}
                          prefix={(stat as { prefix?: string }).prefix ?? ""}
                          suffix={stat.suffix}
                          decimals={(stat as { decimals?: number }).decimals ?? 0}
                          duration={2000}
                        />
                      </p>
                      <p className="text-[10px] font-mono uppercase tracking-widest text-text-faint mt-1">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </div>

      {/* Footer integrated into this section */}
      <Footer />
    </section>
  );
}
