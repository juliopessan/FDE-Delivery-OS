import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";

export function SiteHeader({ meta = "Agentic Delivery OS / v1" }: { meta?: string }) {
  return (
    <header className="border-b border-ink/12">
      <div className="max-w-[1180px] mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 min-h-[44px]">
          {/* The chip stays dark in both themes so the lime mark keeps its
              contrast; on the dark ground it lifts to inksoft to stay visible. */}
          <div className="w-7 h-7 bg-ink dark:bg-inksoft dark:ring-1 dark:ring-paper2/15 flex items-center justify-center">
            <span className="mono-face text-lime text-small font-medium">F</span>
          </div>
          <span className="mono-face text-label tracking-[0.24em] font-medium">
            FDE OS
          </span>
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="mono-face text-label tracking-[0.14em] uppercase text-ink/70 hover:text-ink transition-colors inline-flex items-center min-h-[44px]">
            Dashboard
          </Link>
          <span className="mono-face text-label tracking-[0.2em] text-ink/60 uppercase hidden sm:inline">
            {meta}
          </span>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
