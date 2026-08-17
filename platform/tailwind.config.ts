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
      },
      fontFamily: {
        display: ["'Helvetica Neue'", "Helvetica", "Arial", "sans-serif"],
        serif: ["'Instrument Serif'", "Georgia", "serif"],
        mono: ["'JetBrains Mono'", "ui-monospace", "'Courier New'", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
