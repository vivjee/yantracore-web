"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import { useTheme } from "@/lib/theme/ThemeProvider";
import { ColorfulLogo } from "@/components/brand/ColorfulLogo";
import { SunCoreIcon, MoonCrescentIcon } from "@/components/chrome/NavIcons";

export interface NavItem {
  id: string;
  label: string;
}
export interface NavCategory {
  id: string;
  label: string;
  items: NavItem[];
}

/* ── Scroll-spy: which [data-spy] anchor is in the reading band ──────── */
function useScrollSpy(ids: string[]) {
  const [active, setActive] = useState<string>(ids[0] ?? "");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const visible = new Map<string, boolean>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => visible.set(e.target.id, e.isIntersecting));
        // First id (in document order) currently crossing the band wins.
        const next = ids.find((id) => visible.get(id));
        if (next) setActive(next);
      },
      { rootMargin: "-18% 0px -72% 0px", threshold: 0 }
    );

    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ids]);

  return active;
}

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
  if (typeof history !== "undefined") history.replaceState(null, "", `#${id}`);
}

/* ── Theme controls (dark/light + palette) ──────────────────────────── */
function ThemeControls() {
  const { themeMode, setThemeMode, palettes, palette, setPaletteId } = useTheme();

  return (
    <div className="space-y-3">
      <div className="inline-flex rounded-full border border-white/10 bg-white/[0.03] p-0.5">
        <button
          type="button"
          onClick={() => setThemeMode("dark")}
          aria-pressed={themeMode === "dark"}
          className={cn(
            "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-medium transition-colors duration-200",
            themeMode === "dark" ? "bg-white/10 text-text-hi" : "text-text-low hover:text-text-mid"
          )}
        >
          <MoonCrescentIcon className="h-3.5 w-3.5" /> Dark
        </button>
        <button
          type="button"
          onClick={() => setThemeMode("light")}
          aria-pressed={themeMode === "light"}
          className={cn(
            "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-medium transition-colors duration-200",
            themeMode === "light" ? "bg-white/10 text-text-hi" : "text-text-low hover:text-text-mid"
          )}
        >
          <SunCoreIcon className="h-3.5 w-3.5" /> Light
        </button>
      </div>
      <div className="flex items-center gap-2">
        {palettes.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setPaletteId(p.id)}
            aria-label={`Palette: ${p.name}`}
            title={p.name}
            className={cn(
              "h-5 w-5 rounded-full border transition-transform duration-200 hover:scale-110",
              palette.id === p.id ? "border-white/70 ring-2 ring-white/20" : "border-white/15"
            )}
            style={{ background: p.previewGradient }}
          />
        ))}
      </div>
    </div>
  );
}

/* ── The link list (shared by desktop rail + mobile drawer) ─────────── */
function NavList({
  categories,
  active,
  onNavigate,
}: {
  categories: NavCategory[];
  active: string;
  onNavigate: (id: string) => void;
}) {
  return (
    <nav className="space-y-5">
      {categories.map((cat) => {
        const catActive = cat.items.some((i) => i.id === active);
        return (
          <div key={cat.id}>
            <button
              type="button"
              onClick={() => onNavigate(cat.id)}
              className={cn(
                "mb-1.5 block w-full text-left font-mono text-[11px] uppercase tracking-[0.18em] transition-colors duration-200",
                catActive ? "text-text-hi" : "text-text-faint hover:text-text-low"
              )}
            >
              {cat.label}
            </button>
            <ul className="space-y-0.5 border-l border-ink-edge pl-3">
              {cat.items.map((item) => {
                const isActive = item.id === active;
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => onNavigate(item.id)}
                      className={cn(
                        "relative block w-full py-1 text-left text-[13px] transition-colors duration-200",
                        isActive ? "text-accent-1" : "text-text-low hover:text-text-mid"
                      )}
                    >
                      {isActive && (
                        <span
                          aria-hidden
                          className="absolute -left-[13px] top-1/2 h-3.5 w-[2px] -translate-y-1/2 rounded bg-accent-1"
                        />
                      )}
                      {item.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </nav>
  );
}

/* ── Public component ───────────────────────────────────────────────── */
export function CategoryNav({ categories }: { categories: NavCategory[] }) {
  const allIds = categories.flatMap((c) => c.items.map((i) => i.id));
  const active = useScrollSpy(allIds);
  const [open, setOpen] = useState(false);

  function go(id: string) {
    scrollToId(id);
    setOpen(false);
  }

  return (
    <>
      {/* Desktop rail */}
      <aside className="fixed left-0 top-0 z-30 hidden h-screen w-72 flex-col border-r border-ink-edge bg-ink-0/80 backdrop-blur-xl lg:flex">
        <div className="flex items-center gap-2.5 border-b border-ink-edge px-6 py-5">
          <Link href="/" className="flex items-center gap-2.5" aria-label="Back to home">
            <ColorfulLogo size={26} />
            <span
              className="text-sm font-semibold tracking-tight text-text-hi"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Components
            </span>
          </Link>
        </div>
        <div className="border-b border-ink-edge px-6 py-4">
          <ThemeControls />
        </div>
        <div className="no-scrollbar flex-1 overflow-y-auto px-6 py-5">
          <NavList categories={categories} active={active} onNavigate={go} />
        </div>
        <div className="border-t border-ink-edge px-6 py-3">
          <Link
            href="/lab/playground"
            className="font-mono text-[10px] uppercase tracking-[0.15em] text-text-faint transition-colors hover:text-text-low"
          >
            → Lab / Playground
          </Link>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="fixed inset-x-0 top-0 z-40 flex items-center justify-between border-b border-ink-edge bg-ink-0/90 px-4 py-3 backdrop-blur-xl lg:hidden">
        <Link href="/" className="flex items-center gap-2" aria-label="Back to home">
          <ColorfulLogo size={22} />
          <span
            className="text-sm font-semibold text-text-hi"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Components
          </span>
        </Link>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label="Toggle component menu"
          className="rounded-md border border-white/10 px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-text-mid"
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-30 lg:hidden">
          <div
            className="absolute inset-0 bg-ink-0/70 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div className="no-scrollbar absolute right-0 top-0 h-full w-80 max-w-[85vw] overflow-y-auto border-l border-ink-edge bg-ink-1 px-6 pb-10 pt-20">
            <div className="mb-5">
              <ThemeControls />
            </div>
            <NavList categories={categories} active={active} onNavigate={go} />
          </div>
        </div>
      )}
    </>
  );
}
