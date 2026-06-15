"use client";

import { useState, useEffect, type FormEvent } from "react";
import Link from "next/link";
import { SiteBackground } from "@/components/backgrounds/SiteBackground";
import { TvFrame } from "@/components/layout/TvFrame";
import { Eyebrow } from "@/components/typography/Eyebrow";
import { GlassInput } from "@/components/glass/GlassInput";
import { AnimatedBorder } from "@/components/glass/AnimatedBorder";
import { Rise } from "@/components/motion/Rise";
import { submitContact } from "@/lib/api/contact";
import { audioSynth } from "@/lib/audio";
import { useTheme } from "@/lib/theme/ThemeProvider";
import { cn } from "@/lib/utils/cn";
import { Send, Check, Loader2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type FormState = "idle" | "loading" | "success" | "error";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [formState, setFormState] = useState<FormState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { themeMode } = useTheme();

  const handleInputFocus = () => {
    audioSynth.playClick();
  };

  const handleButtonHover = () => {
    audioSynth.playHover();
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    setFormState("loading");
    audioSynth.playClick();

    // Small delay for natural transition feel
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const res = await submitContact({ name, email, message });

    if (res.ok) {
      setFormState("success");
      setName("");
      setEmail("");
      setMessage("");
      audioSynth.playCrtOn(); // Success sound chime
    } else {
      setFormState("error");
      setErrorMessage(res.error);
      audioSynth.playStatic(); // Error sound cue
    }
  };

  return (
    <>
      <SiteBackground />
      <TvFrame>
        <div className="w-full h-full min-h-screen overflow-y-auto no-scrollbar pb-24 relative z-10 px-6 pt-12 md:pt-20">
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="mb-10 text-center">
              <Rise delay={0.08}>
                <Eyebrow>Get In Touch</Eyebrow>
              </Rise>
              <Rise delay={0.16}>
                <h1
                  className="text-4xl md:text-5xl font-bold tracking-tight text-text-hi mt-3 font-display uppercase"
                  style={{
                    fontFamily: "var(--font-display)",
                    letterSpacing: "-0.01em",
                  }}
                >
                  Contact{" "}
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent-1 to-accent-2">
                    Us
                  </span>
                </h1>
              </Rise>
              <Rise delay={0.24}>
                <p className="text-text-mid text-sm md:text-base mt-3 max-w-lg mx-auto font-sans leading-relaxed">
                  Have a question, feedback, or want to collaborate? Drop us a message below and we’ll get back to you shortly.
                </p>
              </Rise>
              <Rise delay={0.32}>
                <p className="mt-4 font-mono text-[11px] uppercase tracking-wider text-text-low">
                  Have a specific project in mind?{" "}
                  <Link
                    href="/book"
                    className="text-accent-2 underline-offset-4 transition-colors hover:underline"
                  >
                    Book a consultation →
                  </Link>
                </p>
              </Rise>
            </div>

            {/* Form Panel */}
            <Rise delay={0.42} className="w-full">
              <AnimatePresence mode="wait">
                {formState === "success" ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="glass-medium rounded-3xl p-8 md:p-10 border border-emerald-500/20 text-center relative overflow-hidden"
                  >
                    <div 
                      className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                      style={{
                        backgroundImage: "radial-gradient(circle, var(--accent-2) 0%, transparent 80%)"
                      }}
                    />
                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6">
                      <Check className="text-emerald-400 w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-bold text-text-hi mb-3 font-mono">
                      MESSAGE SENT
                    </h3>
                    <p className="text-text-mid text-sm max-w-md mx-auto leading-relaxed">
                      Thank you for reaching out! We have received your message and our team will get back to you as soon as possible.
                    </p>
                    
                    <button
                      onClick={() => {
                        audioSynth.playClick();
                        setFormState("idle");
                      }}
                      className="mt-8 px-5 py-2.5 rounded-xl border border-white/[0.08] hover:border-white/[0.18] text-xs font-mono text-text-mid hover:text-text-hi transition-all cursor-pointer bg-white/[0.02]"
                    >
                      Send another message
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  >
                    <AnimatedBorder variant="sweep" radius={24} duration={9000}>
                      <div className="glass-heavy rounded-3xl p-6 md:p-8 flex flex-col gap-6">
                        {errorMessage && (
                          <div className="flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400 font-mono">
                            <AlertCircle size={18} className="shrink-0 mt-0.5 text-red-500" />
                            <div>
                              <span className="font-bold">ERROR:</span> {errorMessage}
                            </div>
                          </div>
                        )}

                        <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <GlassInput
                              id="contact-name"
                              name="name"
                              type="text"
                              label="Your Name"
                              placeholder="Your name"
                              autoComplete="name"
                              required
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              disabled={formState === "loading"}
                              onFocus={handleInputFocus}
                            />
                            <GlassInput
                              id="contact-email"
                              name="email"
                              type="email"
                              label="Your Email"
                              placeholder="you@company.com"
                              autoComplete="email"
                              required
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              disabled={formState === "loading"}
                              onFocus={handleInputFocus}
                            />
                          </div>

                          <div className="flex flex-col gap-2">
                            <div className="flex justify-between items-center text-sm font-medium">
                              <label htmlFor="contact-message" className="text-text-mid font-mono text-xs uppercase tracking-wider">
                                Your Message
                              </label>
                              <span className={cn(
                                "text-[10px] font-mono",
                                message.length > 2000 ? "text-red-400" : "text-text-faint"
                              )}>
                                {message.length} / 2000
                              </span>
                            </div>
                            <textarea
                              id="contact-message"
                              name="message"
                              rows={6}
                              placeholder="Write your message here..."
                              required
                              value={message}
                              onChange={(e) => setMessage(e.target.value)}
                              disabled={formState === "loading"}
                              onFocus={handleInputFocus}
                              className="glass-light w-full rounded-xl px-4 py-3.5 text-text-hi placeholder:text-text-low focus:outline-none resize-none text-sm transition-all duration-300 border border-white/[0.04] focus:border-accent-1/30"
                              style={{ minHeight: "140px" }}
                            />
                          </div>

                          <button
                            type="submit"
                            onMouseEnter={handleButtonHover}
                            disabled={formState === "loading" || !name || !email || message.length < 10 || message.length > 2000}
                            className={cn(
                              "glass-primary w-full inline-flex items-center justify-center gap-2.5 rounded-xl py-3.5",
                              "font-semibold text-text-hi text-[0.95rem] font-mono uppercase tracking-wider",
                              "transition-all duration-500 ease-out cursor-pointer",
                              "hover:shadow-[0_20px_40px_-10px_rgba(110,86,255,0.45)]",
                              "disabled:opacity-35 disabled:cursor-not-allowed disabled:shadow-none",
                              "group"
                            )}
                          >
                            {formState === "loading" ? (
                              <>
                                <Loader2 size={16} className="animate-spin text-accent-2" />
                                <span>Sending...</span>
                              </>
                            ) : (
                              <>
                                <span>Send Message</span>
                                <Send size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                              </>
                            )}
                          </button>
                        </form>

                        <div className="border-t border-white/[0.04] pt-4 flex items-center justify-between text-[10px] text-text-faint font-mono">
                          <span>PROTOCOL: SECURE</span>
                          <span>STORAGE: LOCAL</span>
                        </div>
                      </div>
                    </AnimatedBorder>
                  </motion.div>
                )}
              </AnimatePresence>
            </Rise>
          </div>
        </div>
      </TvFrame>
    </>
  );
}
