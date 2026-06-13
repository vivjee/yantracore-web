import type { ReactNode } from "react";

/**
 * Signup layout wraps pages under /signup and applies data-layout="auth"
 * to suppress the header in globals.css.
 */
export default function SignupLayout({ children }: { children: ReactNode }) {
  return <div data-layout="auth">{children}</div>;
}
