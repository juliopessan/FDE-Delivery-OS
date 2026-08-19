import type { Config } from "tailwindcss";

/**
 * Colours resolve through CSS variables so a theme swap is a change of values,
 * not a change of markup: `bg-paper` stays `bg-paper` in both themes and simply
 * paints a different colour. The alternative — a `dark:` variant beside every
 * one of the ~110 colour classes in this app — is far more to write and far
 * easier to leave half-done.
 *
 * Channels are stored space-separated ("20 21 15") rather than as hex, because
 * that is what lets Tailwind's slash-opacity syntax (`text-ink/70`) keep
 * working through a variable.
 *
 * The palette itself is unchanged; globals.css holds which colour each token
 * points at per theme.
 */
const withOpacity = (variable: string) => `rgb(var(${variable}) / <alpha-value>)`;

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        ink: withOpacity("--c-ink"),
        inksoft: withOpacity("--c-inksoft"),
        paper: withOpacity("--c-paper"),
        paper2: withOpacity("--c-paper2"),
        lime: withOpacity("--c-lime"),
        amber: withOpacity("--c-amber"),
        rust: withOpacity("--c-rust"),
        peach: withOpacity("--c-peach"),
        rustink: withOpacity("--c-rustink"),
      },
      /*
       * `sans` is overridden, not extended: Tailwind's preflight sets it on
       * <html>, so leaving the default meant every element without an explicit
       * face class rendered in the system UI font — 193 of them on the landing
       * page alone. Body copy now inherits the product's own stack.
       */
      fontFamily: {
        sans: ["'Helvetica Neue'", "var(--font-sans-fallback)", "Helvetica", "Arial", "sans-serif"],
        display: ["'Helvetica Neue'", "var(--font-sans-fallback)", "Helvetica", "Arial", "sans-serif"],
        serif: ["var(--font-serif)", "'Instrument Serif'", "Georgia", "serif"],
        mono: ["var(--font-mono)", "'JetBrains Mono'", "ui-monospace", "monospace"],
      },
      /*
       * Five steps replace sixteen accumulated sizes. Anything smaller than
       * `label` fell below AA at every opacity the design uses, so 11px is the
       * floor rather than a choice.
       */
      fontSize: {
        label: ["11px", { lineHeight: "1.45" }],
        small: ["13px", { lineHeight: "1.55" }],
        body: ["15px", { lineHeight: "1.65" }],
        lead: ["17px", { lineHeight: "1.6" }],
      },
    },
  },
  plugins: [],
};

export default config;
