import Link from "next/link";
import { desc } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { engagements } from "@/lib/db/schema";
import { SiteHeader } from "@/components/SiteHeader";
import { Eyebrow } from "@/components/Eyebrow";
import { ApiKeyDialog } from "@/components/ApiKeyDialog";

export const dynamic = "force-dynamic";

const statusStyle: Record<string, string> = {
  active: "bg-amber text-ink",
  completed: "bg-lime text-ink dark:text-paper",
  failed: "bg-rust text-paper2",
};

export default async function DashboardPage() {
  const rows = await db.select().from(engagements).orderBy(desc(engagements.createdAt));

  return (
    <div className="min-h-screen bg-paper text-ink">
      <SiteHeader meta="Dashboard" />
      <ApiKeyDialog />

      <main className="max-w-[1180px] mx-auto px-6 py-14">
        <div className="flex items-end justify-between flex-wrap gap-6">
          <div>
            <Eyebrow>Engagements</Eyebrow>
            <h1 className="display-face mt-4 text-[clamp(1.8rem,3.4vw,2.5rem)] font-bold tracking-[-0.02em]">
              Engagement dashboard
            </h1>
          </div>
          <Link
            href="/dashboard/new"
            className="mono-face text-label tracking-[0.12em] uppercase bg-ink text-paper px-6 py-4 hover:bg-rust transition-colors"
          >
            New engagement →
          </Link>
        </div>

        {rows.length === 0 ? (
          <div className="mt-16 border border-dashed border-ink/25 p-14 text-center">
            <p className="text-ink/60">No engagements yet.</p>
            <Link href="/dashboard/new" className="mono-face text-label uppercase tracking-[0.12em] text-rustink mt-3 inline-block">
              Start the first one →
            </Link>
          </div>
        ) : (
          <div className="mt-10 divide-y divide-ink/12 border-t border-ink/12">
            {rows.map((e) => (
              <Link
                key={e.id}
                href={`/dashboard/${e.id}`}
                className="flex items-center justify-between gap-6 py-6 hover:bg-paper2 dark:bg-inksoft transition-colors px-2 -mx-2"
              >
                <div className="min-w-0">
                  <div className="font-medium text-body truncate">{e.customerName}</div>
                  <div className="mono-face text-label tracking-[0.08em] uppercase text-ink/60 mt-1 truncate">
                    {e.objective}
                  </div>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <span className="mono-face text-label tracking-[0.1em] uppercase text-ink/60">
                    {e.phase}
                  </span>
                  <span
                    className={`mono-face text-label tracking-[0.1em] uppercase px-2.5 py-1 ${
                      statusStyle[e.status] ?? "bg-paper2 dark:bg-inksoft text-ink/60"
                    }`}
                  >
                    {e.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
