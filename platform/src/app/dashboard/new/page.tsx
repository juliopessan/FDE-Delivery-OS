"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { Eyebrow } from "@/components/Eyebrow";
import { RotatingPlaceholder } from "@/components/RotatingPlaceholder";

const fields: {
  name: string;
  label: string;
  placeholder: string;
  required?: boolean;
  textarea?: boolean;
  rows?: number;
}[] = [
  { name: "customerName", label: "Customer", placeholder: "Acme Manufacturing Corp", required: true },
  { name: "industry", label: "Industry", placeholder: "Industrial manufacturing" },
  { name: "companySize", label: "Company size", placeholder: "~1,200 employees" },
  {
    name: "objective",
    label: "Stated objective",
    placeholder: "Cut invoice processing time from 14 minutes to under 3 minutes",
    required: true,
    textarea: true,
  },
  {
    name: "currentBaseline",
    label: "Current baseline / pain",
    placeholder: "12,000 invoices/month, manual 3-way match, 6-12% error rate",
    textarea: true,
  },
  {
    name: "constraints",
    label: "Constraints",
    placeholder: "Azure only, data residency in Brazil, PII involved",
    textarea: true,
  },
];

export default function NewEngagementPage() {
  const router = useRouter();
  const [form, setForm] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [extracting, setExtracting] = useState(false);
  const [extractError, setExtractError] = useState<string | null>(null);
  const [justExtracted, setJustExtracted] = useState(false);

  async function extractBrief(rawIntake: string) {
    if (!rawIntake.trim()) return;
    setExtracting(true);
    setExtractError(null);
    setJustExtracted(false);

    try {
      const res = await fetch("/api/extract-brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawIntake }),
      });
      const data = await res.json();

      if (!res.ok) {
        setExtractError(data.error ?? "Could not extract a brief from this document.");
        return;
      }

      setForm((s) => ({ ...s, ...data.brief }));
      setJustExtracted(true);
    } catch {
      setExtractError("Could not reach the extraction service.");
    } finally {
      setExtracting(false);
    }
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";

    const isPlainText = /\.(txt|md)$/i.test(file.name);

    let text: string;
    if (isPlainText) {
      text = await file.text();
    } else {
      setExtracting(true);
      setExtractError(null);
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/parse-document", { method: "POST", body });
      const data = await res.json();
      if (!res.ok) {
        setExtractError(data.error ?? `Could not read ${file.name}.`);
        setExtracting(false);
        return;
      }
      text = data.text;
    }

    setForm((s) => ({ ...s, rawIntake: text }));
    setUploadedFileName(file.name);
    await extractBrief(text);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const res = await fetch("/api/engagements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Failed to create engagement.");
      setSubmitting(false);
      return;
    }

    const { id } = await res.json();
    router.push(`/dashboard/${id}`);
  }

  return (
    <div className="min-h-screen bg-paper text-ink">
      <SiteHeader meta="New engagement" />

      <main className="max-w-[720px] mx-auto px-6 py-14">
        <Eyebrow>Qualification intake</Eyebrow>
        <h1 className="display-face mt-4 text-[clamp(1.8rem,3.4vw,2.4rem)] font-bold tracking-[-0.02em]">
          New engagement brief
        </h1>
        <p className="mt-4 text-ink/65 text-[15px] leading-relaxed max-w-[58ch]">
          Start from the client&apos;s discovery document if you have one — paste or
          upload it below and the fields under it fill themselves in. Otherwise, write
          the brief directly.
        </p>

        <form onSubmit={handleSubmit} className="mt-12 space-y-8">
          <div>
            <div className="flex items-baseline justify-between gap-4 mb-3">
              <label className="mono-face text-[10px] tracking-[0.2em] uppercase text-ink/45">
                Full discovery intake <span className="normal-case tracking-normal">(optional)</span>
              </label>
              <label className="mono-face text-[10px] tracking-[0.14em] uppercase text-rust cursor-pointer hover:opacity-70 transition-opacity shrink-0">
                Upload .txt / .md / .pdf / .docx →
                <input
                  type="file"
                  accept=".txt,.md,.pdf,.docx,text/plain,text/markdown,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
            <p className="text-ink/50 text-[13px] mb-3">
              Paste the client&apos;s problem intake document verbatim, or upload a
              .txt/.md/.pdf/.docx file. The agents treat this as the primary source of
              truth and the fields below as a condensed excerpt of it.
            </p>
            <div className="relative">
              <textarea
                value={form.rawIntake ?? ""}
                rows={14}
                className="w-full bg-transparent border-b border-ink/25 pb-3 text-[15px] leading-relaxed placeholder-ink/28 focus:outline-none focus:border-ink transition-colors resize-y font-mono"
                onChange={(e) => {
                  setUploadedFileName(null);
                  setJustExtracted(false);
                  setForm((s) => ({ ...s, rawIntake: e.target.value }));
                }}
              />
              <RotatingPlaceholder
                visible={!(form.rawIntake ?? "")}
                className="text-[15px] leading-relaxed text-ink/28 font-mono"
                prompts={[
                  "Paste the full client problem intake here…",
                  "Who they are — industry, size, the team that owns the process…",
                  "What it costs today — volumes, handling time, error rate…",
                  "What they want — and whether anyone has validated it…",
                  "Constraints — data residency, ERP, what security will not allow…",
                  "Or upload the discovery document with the link above…",
                ]}
              />
            </div>
            <div className="mt-3 flex items-center gap-4">
              <button
                type="button"
                disabled={extracting || !(form.rawIntake ?? "").trim()}
                onClick={() => extractBrief(form.rawIntake ?? "")}
                className="mono-face text-[11px] tracking-[0.12em] uppercase bg-paper2 text-ink px-4 py-2.5 hover:bg-ink hover:text-paper transition-colors disabled:opacity-40"
              >
                {extracting
                  ? "Extracting brief…"
                  : uploadedFileName
                  ? `Re-extract from ${uploadedFileName} →`
                  : "Extract brief from this text →"}
              </button>
              {justExtracted && (
                <span className="text-lime bg-ink px-2 py-1 mono-face text-[10px] tracking-[0.1em] uppercase">
                  Fields filled below — review before submitting
                </span>
              )}
            </div>
            {extractError && <p className="text-rust text-sm mt-2">{extractError}</p>}
          </div>

          {fields.map((f) => (
            <div key={f.name}>
              <label className="mono-face block text-[10px] tracking-[0.2em] uppercase text-ink/45 mb-3">
                {f.label} {f.required && <span className="text-rust">*</span>}
              </label>
              {f.textarea ? (
                <textarea
                  required={f.required}
                  placeholder={f.placeholder}
                  rows={f.rows ?? 3}
                  value={form[f.name] ?? ""}
                  className="w-full bg-transparent border-b border-ink/25 pb-3 text-[16px] placeholder-ink/28 focus:outline-none focus:border-ink transition-colors resize-none"
                  onChange={(e) => setForm((s) => ({ ...s, [f.name]: e.target.value }))}
                />
              ) : (
                <input
                  type="text"
                  required={f.required}
                  placeholder={f.placeholder}
                  value={form[f.name] ?? ""}
                  className="w-full bg-transparent border-b border-ink/25 pb-3 text-[16px] placeholder-ink/28 focus:outline-none focus:border-ink transition-colors"
                  onChange={(e) => setForm((s) => ({ ...s, [f.name]: e.target.value }))}
                />
              )}
            </div>
          ))}

          {error && <p className="text-rust text-sm">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="mono-face text-[12px] tracking-[0.12em] uppercase bg-ink text-paper px-6 py-4 hover:bg-rust transition-colors disabled:opacity-50"
          >
            {submitting ? "Creating…" : "Create engagement →"}
          </button>
        </form>
      </main>
    </div>
  );
}
