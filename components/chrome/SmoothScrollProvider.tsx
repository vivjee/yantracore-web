"use client";

import { type ReactNode } from "react";

/**
 * SmoothScrollProvider — previously wrapped the app in a Lenis smooth-scroll
 * instance. Now it is a transparent passthrough; native browser scrolling is
 * used instead so the browser retains full control over scroll behaviour.
 */
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
