export function Eyebrow({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <div
      className={`mono-face inline-flex items-center gap-2.5 text-label tracking-[0.2em] uppercase ${
        dark ? "text-paper2/70" : "text-ink/60"
      }`}
    >
      <span className={`inline-block h-px w-5 ${dark ? "bg-paper2/30" : "bg-ink/30"}`} />
      {children}
    </div>
  );
}
