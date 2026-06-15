"use client";

/**
 * Global error boundary — catches errors thrown by the ROOT layout itself.
 * It replaces the entire document, so it must render its own <html>/<body> and
 * cannot rely on the ThemeProvider, globals.css tokens, or Tailwind being
 * applied. That's why the brand colors are inlined as literal hex here (the one
 * place the "never hardcode accent hex" rule can't apply) — they mirror the
 * --ink-0 / --text-* / --accent-3 tokens.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#06070D",
          color: "#F4F5FA",
          fontFamily: "ui-sans-serif, system-ui, -apple-system, sans-serif",
          textAlign: "center",
          padding: 24,
        }}
      >
        <div style={{ maxWidth: 460 }}>
          <p
            style={{
              fontFamily: "ui-monospace, monospace",
              fontSize: 11,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "#FF4FB0",
              margin: 0,
            }}
          >
            SYS · Critical fault
          </p>
          <h1 style={{ fontSize: 40, fontWeight: 700, letterSpacing: "-0.02em", margin: "20px 0 0" }}>
            The system went dark
          </h1>
          <p style={{ fontSize: 15, lineHeight: 1.6, color: "#B4B9CC", margin: "16px 0 0" }}>
            A critical error took the whole screen down. Reloading usually brings it
            back.
          </p>
          <button
            type="button"
            onClick={() => reset()}
            style={{
              marginTop: 28,
              padding: "12px 24px",
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.12)",
              background: "#0A0C16",
              color: "#F4F5FA",
              fontFamily: "ui-monospace, monospace",
              fontSize: 12,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            Reload
          </button>
          {error.digest && (
            <p style={{ marginTop: 20, fontFamily: "ui-monospace, monospace", fontSize: 10, color: "#4B5066" }}>
              ref: {error.digest}
            </p>
          )}
        </div>
      </body>
    </html>
  );
}
