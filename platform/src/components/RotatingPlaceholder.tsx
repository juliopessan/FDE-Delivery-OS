"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * A placeholder that cycles through prompts, so an empty intake box teaches
 * what belongs in it rather than repeating one line. Rendered as an overlay
 * because a native `placeholder` attribute cannot animate.
 *
 * All prompts stay mounted and are moved in and out of the single visible
 * slot. The caller passes the same type classes the field uses, so the hint
 * sits exactly where the caret will.
 */
export function RotatingPlaceholder({
  prompts,
  visible,
  className,
  intervalMs = 3600,
}: {
  prompts: string[];
  visible: boolean;
  className?: string;
  intervalMs?: number;
}) {
  const [index, setIndex] = useState(0);
  const reduceMotion = useReducedMotion();
  const cycle = !reduceMotion && visible;

  useEffect(() => {
    if (!cycle) return;
    const timer = setInterval(
      () => setIndex((current) => (current + 1) % prompts.length),
      intervalMs
    );
    return () => clearInterval(timer);
  }, [cycle, prompts.length, intervalMs]);

  if (!visible) return null;

  if (reduceMotion) {
    return (
      <span className={`${className} pointer-events-none absolute left-0 top-0`}>
        {prompts[0]}
      </span>
    );
  }

  return (
    <span className="pointer-events-none absolute inset-x-0 top-0 block h-[1.7em] overflow-hidden">
      {prompts.map((prompt, i) => (
        <motion.span
          key={prompt}
          className={`${className} absolute inset-x-0 top-0 block`}
          initial={false}
          animate={
            index === i
              ? { y: "0%", opacity: 1 }
              : { y: index > i ? "-100%" : "100%", opacity: 0 }
          }
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {prompt}
        </motion.span>
      ))}
    </span>
  );
}
