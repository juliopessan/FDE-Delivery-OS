"use client";

import { useEffect, useState } from "react";
import { MoonIcon, SunIcon } from "@/components/Icon";

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
