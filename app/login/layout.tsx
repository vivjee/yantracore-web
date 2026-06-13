import type { ReactNode } from "react";

/**
 * Login layout — stripped back shell.
 *
 * The global root layout injects <Cursor />, <Header />, and
 * <SmoothScrollProvider>. We still want the cursor but we drop
 * the nav header so the login page feels like a standalone gate.
 * We achieve this by wrapping the route in its own layout that
 * simply renders children directly — Next.js nests this *inside*
 * the root layout, so the root-level body/html/cursor still fire,
 * but `children` here replaces the slot that would normally show
 * the Header too.
 *
 * Caveat: the root layout always renders <Header />. To hide it
 * we use a CSS approach: `[data-layout="auth"]` hides the header.
 * We inject `data-layout` on the wrapping div here and handle it
 * in globals.css.
 */
export default function AuthLayout({ children }: { children: ReactNode }) {
  return <div data-layout="auth">{children}</div>;
}
