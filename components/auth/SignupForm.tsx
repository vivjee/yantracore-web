"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Eye, EyeOff, ArrowRight, Loader2, Sparkles } from "lucide-react";
import { GlassInput } from "@/components/glass/GlassInput";
import { AnimatedBorder } from "@/components/glass/AnimatedBorder";
import { StaggerContainer, StaggerItem, ScaleFadeItem } from "@/components/motion/AnimationWrappers";
import { cn } from "@/lib/utils/cn";

type FormState = "idle" | "loading" | "error" | "success";

interface FieldErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

function validateEmail(value: string): string | undefined {
  if (!value.trim()) return "Email is required.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
    return "Please enter a valid email address.";
}

function validatePassword(value: string): string | undefined {
  if (!value) return "Password is required.";
  if (value.length < 6) return "Password must be at least 6 characters.";
}

/* ─────────────────────────────────────────────────────────────
   Ambient orbs — ambient light blobs behind the card
   ───────────────────────────────────────────────────────────── */
function AmbientOrbs() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Violet orb — top-left */}
      <div
        className="absolute rounded-full opacity-50"
        style={{
          width: "clamp(300px, 45vw, 640px)",
          height: "clamp(300px, 45vw, 640px)",
          top: "-15%",
          left: "-10%",
          background:
            "radial-gradient(circle, rgba(110, 86, 255, 0.45) 0%, transparent 70%)",
          filter: "blur(60px)",
          animation: "mesh-flow 20s ease-in-out infinite alternate",
        }}
      />
      {/* Teal orb — bottom-right */}
      <div
        className="absolute rounded-full opacity-40"
        style={{
          width: "clamp(250px, 38vw, 560px)",
          height: "clamp(250px, 38vw, 560px)",
          bottom: "-12%",
          right: "-8%",
          background:
            "radial-gradient(circle, rgba(0, 224, 203, 0.35) 0%, transparent 70%)",
          filter: "blur(60px)",
          animation: "mesh-flow 25s ease-in-out infinite alternate-reverse",
        }}
      />
      {/* Pink orb — bottom-left */}
      <div
        className="absolute rounded-full opacity-25"
        style={{
          width: "clamp(180px, 28vw, 400px)",
          height: "clamp(180px, 28vw, 400px)",
          bottom: "5%",
          left: "5%",
          background:
            "radial-gradient(circle, rgba(255, 79, 176, 0.30) 0%, transparent 70%)",
          filter: "blur(50px)",
          animation: "light-drift 18s ease-in-out infinite",
        }}
      />
      {/* Dot field overlay */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: "radial-gradient(circle, var(--text-hi) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          animation: "dot-drift 6s linear infinite",
        }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Social sign-in divider
   ───────────────────────────────────────────────────────────── */
function Divider() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <span className="text-xs text-text-faint tracking-widest uppercase font-mono">
        or sign up with
      </span>
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Social Buttons Grid
   ───────────────────────────────────────────────────────────── */
function SocialButtons({ disabled }: { disabled: boolean }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {/* Google */}
      <button
        type="button"
        disabled={disabled}
        className={cn(
          "glass-light flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-medium text-text-mid",
          "transition-all duration-300 ease-[var(--ease-out-soft)]",
          "hover:text-text-hi hover:border-white/20 hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.5)]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-1",
          "disabled:opacity-40 disabled:cursor-not-allowed",
          "group"
        )}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          aria-hidden
          className="shrink-0 transition-transform duration-300 group-hover:scale-110"
        >
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
        Google
      </button>

      {/* GitHub */}
      <button
        type="button"
        disabled={disabled}
        className={cn(
          "glass-light flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-medium text-text-mid",
          "transition-all duration-300 ease-[var(--ease-out-soft)]",
          "hover:text-text-hi hover:border-white/20 hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.5)]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-1",
          "disabled:opacity-40 disabled:cursor-not-allowed",
          "group"
        )}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="shrink-0 transition-transform duration-300 group-hover:scale-110 text-text-mid group-hover:text-text-hi"
        >
          <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
          <path d="M9 18c-4.51 2-5-2-7-2" />
        </svg>
        GitHub
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Primary submit button
   ───────────────────────────────────────────────────────────── */
function SubmitButton({ state }: { state: FormState }) {
  const isLoading = state === "loading";

  const inner = (
    <button
      type="submit"
      disabled={isLoading}
      className={cn(
        "glass-primary relative w-full inline-flex items-center justify-center gap-2.5 rounded-xl px-6 py-3.5",
        "font-semibold text-text-hi text-[0.95rem]",
        "btn-shine-target",
        "transition-all duration-500 ease-[var(--ease-out-soft)]",
        "hover:shadow-[0_24px_48px_-12px_rgba(110,86,255,0.55)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-1 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-0",
        "disabled:opacity-60 disabled:cursor-not-allowed",
        "group"
      )}
    >
      {isLoading ? (
        <>
          <Loader2 size={16} className="animate-spin" aria-hidden />
          <span>Creating client account…</span>
        </>
      ) : (
        <>
          <span>Register Account</span>
          <ArrowRight
            size={16}
            aria-hidden
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </>
      )}
    </button>
  );

  if (isLoading) {
    return (
      <div className="relative rounded-xl">
        {inner}
      </div>
    );
  }

  return (
    <AnimatedBorder variant="sweep" radius={12} duration={5000}>
      {inner}
    </AnimatedBorder>
  );
}

/* ─────────────────────────────────────────────────────────────
   Main SignupForm
   ───────────────────────────────────────────────────────────── */
export function SignupForm({ inTv = false }: { inTv?: boolean }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formState, setFormState] = useState<FormState>("idle");
  const [serverError, setServerError] = useState<string | null>(null);

  const isLoading = formState === "loading";

  function validate(): boolean {
    const next: FieldErrors = {};
    
    if (!name.trim()) {
      next.name = "Full name is required.";
    }
    
    const emailErr = validateEmail(email);
    if (emailErr) next.email = emailErr;
    
    const passwordErr = validatePassword(password);
    if (passwordErr) next.password = passwordErr;
    
    if (password !== confirmPassword) {
      next.confirmPassword = "Passwords do not match.";
    }
    
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setServerError(null);
    if (!validate()) return;

    setFormState("loading");

    // Simulate network latency
    await new Promise((r) => setTimeout(r, 1500));

    // Simulated registration
    setFormState("success");
    sessionStorage.setItem("ym_authed", "1");
    sessionStorage.setItem("ym_role", "client");
    sessionStorage.setItem("ym_user", email.trim().toLowerCase());
    
    // Redirect to dashboard
    window.location.href = "/dashboard";
  }

  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden",
        inTv
          ? "h-full w-full overflow-y-auto px-3 py-6 sm:px-4 sm:py-8 no-scrollbar"
          : "min-h-screen bg-ink-0 px-4 py-20"
      )}
    >
      {!inTv && <AmbientOrbs />}

      {/* Back to home */}
      {!inTv && <Link
        href="/"
        className="absolute top-6 left-6 inline-flex items-center gap-2 text-sm text-text-low transition-colors duration-200 hover:text-text-hi group"
        aria-label="Back to YantraCore home"
      >
        <span
          aria-hidden
          className="inline-block transition-transform duration-300 ease-[var(--ease-out-soft)] group-hover:-translate-x-1"
        >
          ←
        </span>
        <img
          src="/images/logo/logo-white.svg"
          alt="YantraCore"
          className="h-6 w-auto opacity-70 transition-opacity duration-200 group-hover:opacity-100"
          style={{
            filter: "drop-shadow(0 0 6px rgba(110, 86, 255, 0.4))",
          }}
        />
      </Link>}

      {/* Card */}
      <ScaleFadeItem className="relative z-10 w-full max-w-lg" initialScale={0.92} targetScale={1}>
        {/* Glow ring behind card */}
        <div
          aria-hidden
          className="absolute -inset-px rounded-3xl opacity-60 blur-xl"
          style={{
            background:
              "conic-gradient(from 180deg at 50% 50%, rgba(110,86,255,0.4) 0%, rgba(0,224,203,0.2) 40%, rgba(255,79,176,0.2) 70%, rgba(110,86,255,0.4) 100%)",
          }}
        />

        <AnimatedBorder variant="sweep" radius={24} duration={8000}>
          <div className="glass-heavy relative rounded-3xl p-5 sm:p-8 lg:p-10">
            <StaggerContainer delay={200} staggerDelay={0.06}>
              {/* Header */}
              <StaggerItem className="mb-6">
                <h1 className="text-2xl font-bold text-text-hi tracking-tight font-display mb-1.5 flex items-center gap-2">
                  Get Started <Sparkles size={20} className="text-accent-2" />
                </h1>
                <p className="text-sm text-text-low">
                  Create a new client account to manage your projects and request support.
                </p>
              </StaggerItem>

              {/* Informative info bubble about Client registrations */}
              <StaggerItem className="mb-6">
                <div className="flex items-start gap-3 rounded-xl border border-accent-1/20 bg-accent-1/5 px-4 py-3 text-xs text-text-mid">
                  <span className="shrink-0 text-accent-1">ℹ</span>
                  <div>
                    <span className="font-semibold text-text-hi">Client Role Access:</span> You will be registered as a **Client**. You can create, track, and interact with support and implementation requests.
                  </div>
                </div>
              </StaggerItem>

              {/* Social Signup */}
              <StaggerItem className="mb-5">
                <SocialButtons disabled={isLoading} />
              </StaggerItem>

              <StaggerItem>
                <Divider />
              </StaggerItem>

              {/* Form */}
              <form
                onSubmit={handleSubmit}
                noValidate
                aria-label="Create account form"
                className="mt-5 flex flex-col gap-4"
              >
                {/* Server error */}
                {serverError && (
                  <div
                    role="alert"
                    className="flex items-start gap-3 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-400"
                  >
                    <span aria-hidden className="mt-0.5 shrink-0 text-red-400">⚠</span>
                    <span>{serverError}</span>
                  </div>
                )}

                {/* Name */}
                <StaggerItem>
                  <GlassInput
                    id="name"
                    name="name"
                    type="text"
                    label="Full name"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (errors.name) setErrors((p) => ({ ...p, name: undefined }));
                    }}
                    error={errors.name}
                    disabled={isLoading}
                    aria-describedby={errors.name ? "name-error" : undefined}
                    aria-invalid={!!errors.name}
                  />
                </StaggerItem>

                {/* Email */}
                <StaggerItem>
                  <GlassInput
                    id="email"
                    name="email"
                    type="email"
                    label="Email address"
                    placeholder="you@example.com"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors((p) => ({ ...p, email: undefined }));
                    }}
                    error={errors.email}
                    disabled={isLoading}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    aria-invalid={!!errors.email}
                  />
                </StaggerItem>

                {/* Password fields grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Password */}
                  <StaggerItem>
                    <div className="flex flex-col gap-2">
                      <label htmlFor="password" className="text-sm font-medium text-text-mid">
                        Password
                      </label>
                      <div className="relative rounded-xl">
                        <GlassInput
                          id="password"
                          name="password"
                          type={showPw ? "text" : "password"}
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                            if (errors.password) setErrors((p) => ({ ...p, password: undefined }));
                          }}
                          disabled={isLoading}
                          className="pr-10"
                          aria-describedby={errors.password ? "password-error" : undefined}
                          aria-invalid={!!errors.password}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPw((v) => !v)}
                          disabled={isLoading}
                          aria-label={showPw ? "Hide password" : "Show password"}
                          className={cn(
                            "absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg",
                            "text-text-low transition-colors duration-200 hover:text-text-hi",
                            "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent-1"
                          )}
                        >
                          {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      </div>
                      {errors.password && (
                        <p id="password-error" className="text-xs text-red-400/80" role="alert">
                          {errors.password}
                        </p>
                      )}
                    </div>
                  </StaggerItem>

                  {/* Confirm Password */}
                  <StaggerItem>
                    <div className="flex flex-col gap-2">
                      <label htmlFor="confirmPassword" className="text-sm font-medium text-text-mid">
                        Confirm Password
                      </label>
                      <div className="relative rounded-xl">
                        <GlassInput
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showConfirmPw ? "text" : "password"}
                          placeholder="••••••••"
                          value={confirmPassword}
                          onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            if (errors.confirmPassword) setErrors((p) => ({ ...p, confirmPassword: undefined }));
                          }}
                          disabled={isLoading}
                          className="pr-10"
                          aria-describedby={errors.confirmPassword ? "confirmPassword-error" : undefined}
                          aria-invalid={!!errors.confirmPassword}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPw((v) => !v)}
                          disabled={isLoading}
                          aria-label={showConfirmPw ? "Hide password" : "Show password"}
                          className={cn(
                            "absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg",
                            "text-text-low transition-colors duration-200 hover:text-text-hi",
                            "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent-1"
                          )}
                        >
                          {showConfirmPw ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      </div>
                      {errors.confirmPassword && (
                        <p id="confirmPassword-error" className="text-xs text-red-400/80" role="alert">
                          {errors.confirmPassword}
                        </p>
                      )}
                    </div>
                  </StaggerItem>
                </div>

                {/* Submit */}
                <StaggerItem className="mt-2">
                  <SubmitButton state={formState} />
                </StaggerItem>
              </form>

              {/* Footer */}
              <StaggerItem className="mt-6 text-center text-sm text-text-low">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-medium text-accent-1 transition-colors duration-200 hover:text-accent-2"
                >
                  Sign in
                </Link>
              </StaggerItem>
            </StaggerContainer>
          </div>
        </AnimatedBorder>
      </ScaleFadeItem>
    </div>
  );
}
