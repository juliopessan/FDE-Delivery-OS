export function StatusStrip() {
  return (
    <div className="bg-ink dark:bg-inksoft text-paper2">
      {/* min-h rather than a fixed height: the line wraps on narrow viewports,
          and a pinned 36px bar pushed the second line out of its own ground. */}
      <div className="max-w-[1180px] mx-auto px-6 min-h-9 py-2 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-lime shrink-0" />
        <span className="mono-face text-label tracking-[0.2em] uppercase text-paper2/70">
          Model-agnostic pipeline · governed delivery · traceable engagement state
        </span>
      </div>
    </div>
  );
}
