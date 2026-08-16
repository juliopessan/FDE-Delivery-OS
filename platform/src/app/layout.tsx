import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FDE OS",
  description:
    "Agentic delivery operating system for Forward Deployed Engineers — qualification, assessment, architecture, guardrails and value realisation, executed by a governed agent pipeline.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
