"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "fde-os-theme";

/**
 * Applied by an inline script before first paint as well — see layout.tsx.
 * Kept here so both places agree on the rule.
 */
function apply(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
}

export function ThemeToggle() {
  // Undefined until mounted: the server has no way to know the visitor's
  // preference, so rendering either label during SSR guarantees a mismatch.
  const [theme, setTheme] = useState<Theme | undefined>(undefined);

  useEffect(() => {
    // Resolve and re-apply rather than just reading the class. The inline
    // bootstrap in layout.tsx sets it before paint, but React owns <html>
    // during hydration and drops a class the server never rendered — so the
    // pre-paint choice has to be asserted again once we are on the client.
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(THEME_STORAGE_KEY);
    } catch {
      // Storage unavailable; fall back to the OS preference.
    }
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const resolved: Theme = stored === "dark" || (stored !== "light" && prefersDark) ? "dark" : "light";

    setTheme(resolved);
    apply(resolved);
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    apply(next);
    // An explicit choice outranks the OS setting from here on.
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Private browsing can refuse storage; the theme still applies for
      // this page view, it simply will not be remembered.
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      // The glyph is drawn at the weight of the mono labels beside it, so it
      // reads as part of that row rather than as an app icon. The button is
      // 44px for the touch target minimum while the negative margin keeps the
      // header row the height it was, and reserves its own square so nothing
      // shifts on mount or on toggle.
      className="text-ink/60 hover:text-ink transition-colors w-11 h-11 -my-3 -mr-3 flex items-center justify-center shrink-0"
      aria-label={theme ? `Switch to ${theme === "dark" ? "light" : "dark"} theme` : "Switch theme"}
      title={theme === "dark" ? "Light theme" : "Dark theme"}
      suppressHydrationWarning
    >
      {theme === undefined ? null : theme === "dark" ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}

/* Stroked at 1.25 to sit at the same optical weight as JetBrains Mono at 10px. */
const iconProps = {
  width: 15,
  height: 15,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.25,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

function SunIcon() {
  return (
    <svg {...iconProps}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg {...iconProps}>
      <path d="M20 14.2A8.2 8.2 0 0 1 9.8 4 8.4 8.4 0 1 0 20 14.2Z" />
    </svg>
  );
}
