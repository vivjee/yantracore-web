"use client";

import { useState, useEffect, type FormEvent } from "react";
import Link from "next/link";
import { SiteBackground } from "@/components/backgrounds/SiteBackground";
import { TvFrame } from "@/components/layout/TvFrame";
import { Eyebrow } from "@/components/typography/Eyebrow";
import { GlassInput } from "@/components/glass/GlassInput";
import { AnimatedBorder } from "@/components/glass/AnimatedBorder";
import { Rise } from "@/components/motion/Rise";
import { submitContact, INQUIRY_TYPES, type InquiryType } from "@/lib/api/contact";
import { audioSynth } from "@/lib/audio";
import { useTheme } from "@/lib/theme/ThemeProvider";
import { cn } from "@/lib/utils/cn";
import {
  Send,
  Check,
  Loader2,
  AlertCircle,
  ChevronDown,
  Paperclip,
  FileText,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type FormState = "idle" | "loading" | "success" | "error";

const MAX_FILES = 5;
const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10 MB per file
const ACCEPTED_FILES =
  ".pdf,.doc,.docx,.txt,.md,.rtf,.ppt,.pptx,.xls,.xlsx,.csv,.png,.jpg,.jpeg,.webp,.gif,.svg,.zip,.fig";

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [website, setWebsite] = useState("");
  const [inquiryType, setInquiryType] = useState<InquiryType>("general");
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [formState, setFormState] = useState<FormState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { themeMode } = useTheme();

  const handleInputFocus = () => {
    audioSynth.playClick();
  };

  const handleButtonHover = () => {
    audioSynth.playHover();
  };

  const addFiles = (incoming: FileList | null) => {
    if (!incoming || incoming.length === 0) return;
    setErrorMessage(null);
    audioSynth.playClick();

    setFiles((prev) => {
      const next = [...prev];
      for (const file of Array.from(incoming)) {
        if (next.length >= MAX_FILES) {
          setErrorMessage(`You can attach up to ${MAX_FILES} files.`);
          break;
        }
        if (file.size > MAX_FILE_BYTES) {
          setErrorMessage(`"${file.name}" is larger than 10 MB.`);
          continue;
        }
        const isDuplicate = next.some(
          (f) => f.name === file.name && f.size === file.size
        );
        if (!isDuplicate) next.push(file);
      }
      return next.slice(0, MAX_FILES);
    });
  };

  const removeFile = (index: number) => {
    audioSynth.playClick();
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setName("");
    setEmail("");
    setPhone("");
    setCompany("");
    setWebsite("");
    setInquiryType("general");
    setMessage("");
    setFiles([]);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    setFormState("loading");
    audioSynth.playClick();

    // Small delay for natural transition feel
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const res = await submitContact({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim() || undefined,
      company: company.trim() || undefined,
      website: website.trim() || undefined,
      inquiryType,
      message: message.trim(),
      attachments: files.map((f) => ({
        name: f.name,
        size: f.size,
        type: f.type,
      })),
    });

    if (res.ok) {
      setFormState("success");
      resetForm();
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

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <GlassInput
                              id="contact-phone"
                              name="phone"
                              type="tel"
                              label="Phone (optional)"
                              placeholder="+1 (555) 000-0000"
                              autoComplete="tel"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              disabled={formState === "loading"}
                              onFocus={handleInputFocus}
                            />
                            <GlassInput
                              id="contact-company"
                              name="company"
                              type="text"
                              label="Company (optional)"
                              placeholder="Your organization"
                              autoComplete="organization"
                              value={company}
                              onChange={(e) => setCompany(e.target.value)}
                              disabled={formState === "loading"}
                              onFocus={handleInputFocus}
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <GlassInput
                              id="contact-website"
                              name="website"
                              type="url"
                              label="Website (optional)"
                              placeholder="yourcompany.com"
                              autoComplete="url"
                              inputMode="url"
                              value={website}
                              onChange={(e) => setWebsite(e.target.value)}
                              disabled={formState === "loading"}
                              onFocus={handleInputFocus}
                            />
                            <div className="flex flex-col gap-2">
                              <label
                                htmlFor="contact-inquiry"
                                className="text-sm font-medium text-text-mid"
                              >
                                Inquiry Type
                              </label>
                              <div className="relative">
                                <select
                                  id="contact-inquiry"
                                  name="inquiryType"
                                  value={inquiryType}
                                  onChange={(e) => setInquiryType(e.target.value as InquiryType)}
                                  onFocus={handleInputFocus}
                                  disabled={formState === "loading"}
                                  className="glass-light w-full appearance-none rounded-xl border border-white/[0.04] px-4 py-3 pr-10 text-sm text-text-hi transition-all duration-300 focus:border-accent-1/30 focus:outline-none cursor-pointer"
                                >
                                  {INQUIRY_TYPES.map((t) => (
                                    <option
                                      key={t.value}
                                      value={t.value}
                                      className="bg-[#0A0C16] text-text-hi"
                                    >
                                      {t.label}
                                    </option>
                                  ))}
                                </select>
                                <ChevronDown
                                  size={16}
                                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-low"
                                />
                              </div>
                            </div>
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

                          <div className="flex flex-col gap-2">
                            <label
                              htmlFor="contact-files"
                              className="flex items-center gap-1.5 text-sm font-medium text-text-mid"
                            >
                              Attachments
                              <span className="font-mono text-[10px] uppercase tracking-wider text-text-faint">
                                optional · max {MAX_FILES} · 10 MB each
                              </span>
                            </label>
                            <label
                              htmlFor="contact-files"
                              onDragOver={(e) => {
                                e.preventDefault();
                                if (formState !== "loading") setDragActive(true);
                              }}
                              onDragLeave={() => setDragActive(false)}
                              onDrop={(e) => {
                                e.preventDefault();
                                setDragActive(false);
                                if (formState !== "loading") addFiles(e.dataTransfer.files);
                              }}
                              className={cn(
                                "glass-light flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed px-4 py-6 text-center transition-all duration-300",
                                dragActive
                                  ? "border-accent-1/50 bg-accent-1/[0.04]"
                                  : "border-white/[0.1] hover:border-white/[0.2]",
                                (formState === "loading" || files.length >= MAX_FILES) &&
                                  "pointer-events-none opacity-50"
                              )}
                            >
                              <Paperclip size={18} className="text-text-low" />
                              <span className="text-xs text-text-mid">
                                <span className="text-accent-2">Click to upload</span> or drag & drop
                              </span>
                              <span className="font-mono text-[10px] text-text-faint">
                                PDF · docs · images · {files.length}/{MAX_FILES} files
                              </span>
                              <input
                                id="contact-files"
                                name="attachments"
                                type="file"
                                multiple
                                accept={ACCEPTED_FILES}
                                disabled={formState === "loading" || files.length >= MAX_FILES}
                                onChange={(e) => {
                                  addFiles(e.target.files);
                                  e.target.value = "";
                                }}
                                className="sr-only"
                              />
                            </label>

                            {files.length > 0 && (
                              <ul className="flex flex-col gap-1.5">
                                {files.map((file, i) => (
                                  <li
                                    key={`${file.name}-${file.size}-${i}`}
                                    className="flex items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-xs"
                                  >
                                    <FileText size={14} className="shrink-0 text-text-low" />
                                    <span className="truncate text-text-mid">{file.name}</span>
                                    <span className="ml-auto shrink-0 font-mono text-[10px] text-text-faint">
                                      {formatBytes(file.size)}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => removeFile(i)}
                                      disabled={formState === "loading"}
                                      aria-label={`Remove ${file.name}`}
                                      className="shrink-0 text-text-faint transition-colors hover:text-red-400 disabled:opacity-40"
                                    >
                                      <X size={14} />
                                    </button>
                                  </li>
                                ))}
                              </ul>
                            )}
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
