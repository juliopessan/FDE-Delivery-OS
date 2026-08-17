import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP }} />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
