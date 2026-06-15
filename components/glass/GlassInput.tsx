"use client";

import { useState, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

interface GlassInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function GlassInput({
  label,
  error,
  className,
  id,
  name,
  required,
  onFocus,
  onBlur,
  ...props
}: GlassInputProps) {
  const inputId = id || name;
  const errorId = error ? `${inputId}-error` : undefined;
  const [focused, setFocused] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-text-mid"
        >
          {label}
          {required && (
            <span className="ml-0.5 text-accent-2" aria-hidden>
              *
            </span>
          )}
        </label>
      )}
      <div
        className={cn(
          "relative rounded-xl transition-shadow duration-[var(--dur-base)] ease-[var(--ease-out-soft)]"
        )}
        style={{
          boxShadow: focused
            ? "0 0 0 1px var(--accent-1), 0 0 24px -4px rgba(110, 86, 255, 0.35)"
            : error
              ? "0 0 0 1px rgba(248, 113, 113, 0.4)"
              : "none",
        }}
      >
        <input
          id={inputId}
          name={name}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={errorId}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          className={cn(
            "glass-light w-full rounded-xl px-4 py-3 text-text-hi placeholder:text-text-low",
            "focus:outline-none",
            error && "border-red-400/40",
            className
          )}
          {...props}
        />
      </div>
      {error && (
        <p id={errorId} className="text-sm text-red-400/80" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
