import type { Metadata } from "next";
import { Instrument_Serif, JetBrains_Mono, Inter } from "next/font/google";
import "./globals.css";

/**
 * Loaded here rather than through an @import in globals.css. The stylesheet
 * carried `@import url(fonts.googleapis.com/...)` after the @tailwind
 * directives, and CSS requires @import to precede every other rule — so the
 * browser discarded it and the whole product rendered in Georgia and Courier
 * New. next/font also self-hosts the files, which removes a render-blocking
 * request to a third party.
 */
const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

/**
 * Helvetica Neue stays first: it is the face the product was designed in, and
 * every Apple machine has it. It is also absent from Windows and most Linux,
 * where the stack used to fall to Arial — so Inter sits behind it as a
 * self-hosted neo-grotesque with a comparable x-height, rather than leaving
 * the largest share of an enterprise audience on a system default.
 */
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans-fallback",
  display: "swap",
});

export const metadata: Metadata = {
  title: "FDE OS",
  description:
    "Agentic delivery operating system for Forward Deployed Engineers — qualification, assessment, architecture, guardrails and value realisation, executed by a governed agent pipeline.",
};

/**
 * Resolves the theme before the browser paints. Without this the page renders
 * light and then flips on hydration — worst for the dark-mode visitor, who
 * gets a full-screen white frame first.
 *
 * Deliberately not a React effect: effects run after paint, which is exactly
 * the moment being avoided.
 */
const THEME_BOOTSTRAP = `
(function () {
  try {
    var stored = localStorage.getItem('fde-os-theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (stored === 'dark' || (!stored && prefersDark)) {
      document.documentElement.classList.add('dark');
    }
  } catch (e) {
    // Storage unavailable — fall through to the light default.
  }
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // The bootstrap script adds a class the server did not render, which React
    // would otherwise report as a hydration mismatch on <html>.
    <html
      lang="en"
      suppressHydrationWarning
      className={`${instrumentSerif.variable} ${jetbrainsMono.variable} ${inter.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP }} />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
