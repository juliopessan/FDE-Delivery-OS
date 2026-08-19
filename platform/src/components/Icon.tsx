/**
 * The whole icon set, in one file, drawn on one grid.
 *
 * These are meant to sit inside rows of JetBrains Mono at 11px, so they are
 * stroked at 1.25 rather than the usual 1.5 — a heavier line reads as an app
 * icon dropped into a typographic row instead of part of it. Everything is
 * currentColor, so an icon inherits whatever contrast its label already has.
 *
 * Icons are added when they carry meaning the word next to them does not:
 * a file action, a state, a direction. A glyph beside a label that already
 * says the same thing is decoration, and this interface does not need it.
 */
type IconProps = { size?: number; className?: string };

function svgProps({ size = 14 }: IconProps) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.25,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    focusable: false,
  };
}

export function SunIcon(p: IconProps = {}) {
  return (
    <svg {...svgProps({ size: 15, ...p })} className={p.className}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}

export function MoonIcon(p: IconProps = {}) {
  return (
    <svg {...svgProps({ size: 15, ...p })} className={p.className}>
      <path d="M20 14.2A8.2 8.2 0 0 1 9.8 4 8.4 8.4 0 1 0 20 14.2Z" />
    </svg>
  );
}

/** Attach a document — the arrow points into the tray, not out of it. */
export function UploadIcon(p: IconProps = {}) {
  return (
    <svg {...svgProps(p)} className={p.className}>
      <path d="M12 15V3M8 7l4-4 4 4" />
      <path d="M3 15v4a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4" />
    </svg>
  );
}

/** A named file is now attached. */
export function FileIcon(p: IconProps = {}) {
  return (
    <svg {...svgProps(p)} className={p.className}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
    </svg>
  );
}

/** Work completed — used on the confirmation after an extraction. */
export function CheckIcon(p: IconProps = {}) {
  return (
    <svg {...svgProps(p)} className={p.className}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

/** Something needs the reader's attention before they continue. */
export function AlertIcon(p: IconProps = {}) {
  return (
    <svg {...svgProps(p)} className={p.className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v6M12 16.5v.01" />
    </svg>
  );
}

/** The work is running. Rotation is suppressed under reduced motion. */
export function SpinnerIcon(p: IconProps = {}) {
  return (
    <svg {...svgProps(p)} className={`spin ${p.className ?? ""}`.trim()}>
      <path d="M12 3a9 9 0 1 0 9 9" />
    </svg>
  );
}
