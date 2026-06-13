"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import { GlassInput } from "@/components/glass/GlassInput";
import { AnimatedBorder } from "@/components/glass/AnimatedBorder";
import { StaggerContainer, StaggerItem, ScaleFadeItem } from "@/components/motion/AnimationWrappers";
import { cn } from "@/lib/utils/cn";

type FormState = "idle" | "loading" | "error" | "success";

interface FieldErrors {
  email?: string;
  password?: string;
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
   Floating orbs — ambient light blobs behind the card
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
        or
      </span>
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Google Sign-in button
───────────────────────────────────────────────────────────── */
function GoogleButton({ disabled }: { disabled: boolean }) {
  return (
    <button
      type="button"
      disabled={disabled}
      className={cn(
        "glass-light w-full flex items-center justify-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-text-mid",
        "transition-all duration-300 ease-[var(--ease-out-soft)]",
        "hover:text-text-hi hover:border-white/20 hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.5)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-1 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-0",
        "disabled:opacity-40 disabled:cursor-not-allowed",
        "group"
      )}
    >
      {/* Google G logo */}
      <svg
        width="18"
        height="18"
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
      Continue with Google
    </button>
  );
}

/* ─────────────────────────────────────────────────────────────
   Password input with show/hide toggle
───────────────────────────────────────────────────────────── */
function PasswordInput({
  value,
  onChange,
  error,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  error?: string;
  disabled: boolean;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label htmlFor="password" className="text-sm font-medium text-text-mid">
          Password
        </label>
        <Link
          href="/forgot-password"
          className="text-xs text-text-low transition-colors duration-200 hover:text-accent-1"
          tabIndex={0}
        >
          Forgot password?
        </Link>
      </div>
      <div
        className="relative rounded-xl transition-shadow duration-[var(--dur-base)] ease-[var(--ease-out-soft)]"
        style={{
          boxShadow: error
            ? "0 0 0 1px rgba(239, 68, 68, 0.5)"
            : undefined,
        }}
      >
        <GlassInput
          id="password"
          name="password"
          type={visible ? "text" : "password"}
          placeholder="••••••••"
          autoComplete="current-password"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="pr-12"
          aria-describedby={error ? "password-error" : undefined}
          aria-invalid={!!error}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          disabled={disabled}
          aria-label={visible ? "Hide password" : "Show password"}
          className={cn(
            "absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg",
            "text-text-low transition-colors duration-200 hover:text-text-hi",
            "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent-1",
            "disabled:opacity-40 disabled:cursor-not-allowed"
          )}
        >
          {visible ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      </div>
      {error && (
        <p id="password-error" className="text-sm text-red-400/80" role="alert">
          {error}
        </p>
      )}
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
      id="login-submit"
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
          <span>Signing in…</span>
        </>
      ) : (
        <>
          <span>Sign in</span>
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
   Main LoginForm
───────────────────────────────────────────────────────────── */
export function LoginForm({ inTv = false }: { inTv?: boolean }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [activeRole, setActiveRole] = useState<"client" | "staff" | "admin">("client");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formState, setFormState] = useState<FormState>("idle");
  const [serverError, setServerError] = useState<string | null>(null);

  const isLoading = formState === "loading";

  function validate(): boolean {
    const next: FieldErrors = {};
    const emailErr = validateEmail(email);
    const passwordErr = validatePassword(password);
    if (emailErr) next.email = emailErr;
    if (passwordErr) next.password = passwordErr;
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setServerError(null);
    if (!validate()) return;

    setFormState("loading");

    // Simulate network latency
    await new Promise((r) => setTimeout(r, 1200));

    const emailClean = email.trim().toLowerCase();

    // Determine role from input (demo accounts) or active tab selection
    let role = activeRole;
    let isValid = false;

    if (emailClean === "client@yantracore.com" && password === "123456") {
      role = "client";
      isValid = true;
    } else if (emailClean === "staff@yantracore.com" && password === "123456") {
      role = "staff";
      isValid = true;
    } else if (emailClean === "admin@yantracore.com" && password === "123456") {
      role = "admin";
      isValid = true;
    } else if (emailClean === "test@yantracore.com" && password === "123456") {
      role = "admin"; // backwards compatibility
      isValid = true;
    } else {
      // Allow any other login to succeed for demo convenience, defaulting to active tab role
      isValid = true;
    }

    if (isValid) {
      setFormState("success");
      sessionStorage.setItem("ym_authed", "1");
      sessionStorage.setItem("ym_role", role);
      sessionStorage.setItem("ym_user", emailClean);
      window.location.href = "/dashboard";
      return;
    }

    setFormState("error");
    setServerError("Invalid email or password. Please try again.");
  }

  // Helper to pre-fill demo details
  function handleDemoClick(role: "client" | "staff" | "admin") {
    setActiveRole(role);
    setEmail(`${role}@yantracore.com`);
    setPassword("123456");
    setErrors({});
    setServerError(null);
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
            filter:
              "drop-shadow(0 0 6px rgba(110, 86, 255, 0.4))",
          }}
        />
      </Link>}

      {/* Card */}
      <ScaleFadeItem className="relative z-10 w-full max-w-md" initialScale={0.92} targetScale={1}>
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
            <StaggerContainer delay={300} staggerDelay={0.06}>
              {/* Header */}
              <StaggerItem className="mb-6">
                <h1 className="text-2xl font-bold text-text-hi tracking-tight font-display mb-1.5">
                  Welcome back
                </h1>
                <p className="text-sm text-text-low">
                  Sign in to your YantraCore account
                </p>
              </StaggerItem>

              {/* Role Select Tabs */}
              <StaggerItem className="mb-6">
                <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-white/5 border border-white/5">
                  {(["client", "staff", "admin"] as const).map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => {
                        setActiveRole(role);
                        // If they had a demo account prefilled, update the email to match the new role
                        if (email.endsWith("@yantracore.com") && ["client", "staff", "admin"].some(r => email.startsWith(r))) {
                          setEmail(`${role}@yantracore.com`);
                        }
                      }}
                      className={cn(
                        "py-2 text-xs font-semibold rounded-lg capitalize transition-all duration-300 outline-none",
                        activeRole === role
                          ? "glass-primary text-text-hi border-white/5"
                          : "text-text-low hover:text-text-mid"
                      )}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </StaggerItem>

              {/* Google SSO */}
              <StaggerItem className="mb-6">
                <GoogleButton disabled={isLoading} />
              </StaggerItem>

              <StaggerItem>
                <Divider />
              </StaggerItem>

              {/* Form */}
              <form
                onSubmit={handleSubmit}
                noValidate
                aria-label="Sign in form"
                className="mt-6 flex flex-col gap-5"
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

                {/* Email */}
                <StaggerItem>
                  <GlassInput
                    id="email"
                    name="email"
                    type="email"
                    label="Email address"
                    placeholder="you@company.com"
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

                {/* Password */}
                <StaggerItem>
                  <PasswordInput
                    value={password}
                    onChange={(v) => {
                      setPassword(v);
                      if (errors.password)
                        setErrors((p) => ({ ...p, password: undefined }));
                    }}
                    error={errors.password}
                    disabled={isLoading}
                  />
                </StaggerItem>

                {/* Remember me */}
                <StaggerItem>
                  <label
                    htmlFor="remember"
                    className="flex items-center gap-3 cursor-pointer group select-none"
                  >
                    <div className="relative">
                      <input
                        id="remember"
                        name="remember"
                        type="checkbox"
                        className="peer sr-only"
                      />
                      <div
                        className={cn(
                          "w-4.5 h-4.5 rounded-[5px] border border-white/10 bg-white/5",
                          "peer-checked:bg-accent-1/80 peer-checked:border-accent-1",
                          "peer-focus-visible:ring-2 peer-focus-visible:ring-accent-1 peer-focus-visible:ring-offset-1 peer-focus-visible:ring-offset-ink-0",
                          "transition-all duration-200"
                        )}
                        aria-hidden
                      />
                      {/* Checkmark */}
                      <svg
                        className="pointer-events-none absolute inset-0 m-auto text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200"
                        width="10"
                        height="8"
                        viewBox="0 0 10 8"
                        fill="none"
                        aria-hidden
                      >
                        <path
                          d="M1 4L3.5 6.5L9 1"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <span className="text-sm text-text-low transition-colors duration-200 group-hover:text-text-mid">
                      Remember me for 30 days
                    </span>
                  </label>
                </StaggerItem>

                {/* Submit */}
                <StaggerItem className="mt-1">
                  <SubmitButton state={formState} />
                </StaggerItem>
              </form>

              {/* Demo Sign-In Selector */}
              <StaggerItem className="mt-6 pt-5 border-t border-white/5">
                <p className="text-[10px] font-mono tracking-wider uppercase text-text-faint text-center mb-3">
                  Quick Demo Access
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {(["client", "staff", "admin"] as const).map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => handleDemoClick(role)}
                      className={cn(
                        "px-3 py-1.5 text-xs rounded-lg transition-all duration-200 border capitalize",
                        activeRole === role
                          ? "bg-accent-1/10 border-accent-1/30 text-accent-1"
                          : "bg-white/5 border-transparent text-text-low hover:text-text-mid"
                      )}
                    >
                      Demo {role}
                    </button>
                  ))}
                </div>
              </StaggerItem>

              {/* Footer */}
              <StaggerItem className="mt-6 text-center text-sm text-text-low">
                Don&apos;t have an account?{" "}
                <Link
                  href="/signup"
                  className="font-medium text-accent-1 transition-colors duration-200 hover:text-accent-2"
                >
                  Create one
                </Link>
              </StaggerItem>
            </StaggerContainer>
          </div>
        </AnimatedBorder>
      </ScaleFadeItem>
    </div>
  );
}
