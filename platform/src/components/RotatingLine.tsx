"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * The hero's second line, cycling through phrasings on a spring — the
 * animated-hero pattern: every phrase is stacked in one slot, the active one
 * rests at y:0 and the rest sit above or below depending on whether they have
 * already been shown.
 *
 * Whole phrases rotate rather than a single word, because each is a different
 * length and swapping mid-sentence would shove the rest of the line sideways
 * on every tick. The tallest phrase reserves the height so nothing below moves.
 *
 * Styling stays with the caller; this owns the motion, not the look.
 */
export function RotatingLine({
  phrases,
  className,
  intervalMs = 2600,
}: {
  phrases: string[];
  className?: string;
  intervalMs?: number;
}) {
  const [index, setIndex] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;
    const timer = setInterval(
      () => setIndex((current) => (current + 1) % phrases.length),
      intervalMs
    );
    return () => clearInterval(timer);
  }, [phrases.length, intervalMs, reduceMotion]);

  if (reduceMotion) {
    return <span className={className}>{phrases[0]}</span>;
  }

  const longest = phrases.reduce((a, b) => (b.length > a.length ? b : a));

  return (
    <span className="relative block overflow-hidden">
      {/* Reserves the height of the longest phrase, so the paragraph below
          never shifts as the phrases cycle. */}
      <span className={`${className} invisible block`} aria-hidden="true">
        {longest}
      </span>
      {phrases.map((phrase, i) => (
        <motion.span
          key={phrase}
          className={`${className} absolute inset-x-0 top-0 block`}
          aria-hidden={index === i ? undefined : true}
          initial={false}
          animate={
            index === i
              ? { y: 0, opacity: 1 }
              : { y: index > i ? "-110%" : "110%", opacity: 0 }
          }
          transition={{ type: "spring", stiffness: 50 }}
        >
          {phrase}
        </motion.span>
      ))}
    </span>
  );
}
