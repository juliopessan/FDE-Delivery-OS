"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * The hero's second line, cycling through what the pipeline actually hands
 * back. Whole phrases rotate rather than a single word: each one is a
 * different length, and swapping mid-sentence would shove the rest of the
 * line sideways on every tick.
 *
 * Styling stays with the caller — this owns the motion, not the look.
 */
export function RotatingOutcome({
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

  // Reduced motion gets the first phrase, statically — no cycling at all.
  if (reduceMotion) {
    return <span className={className}>{phrases[0]}</span>;
  }

  return (
    <span className="relative block overflow-hidden">
      {/*
        The longest phrase, laid out invisibly, sets the height. Every phrase
        wraps at the same width, so the block never resizes as they cycle and
        the paragraph below it stays put.
      */}
      <span className={`${className} invisible block`} aria-hidden="true">
        {phrases.reduce((a, b) => (b.length > a.length ? b : a))}
      </span>
      {phrases.map((phrase, i) => (
        <motion.span
          key={phrase}
          className={`${className} absolute inset-x-0 top-0 block`}
          aria-hidden={index === i ? undefined : true}
          initial={false}
          animate={
            index === i
              ? { y: "0%", opacity: 1 }
              : { y: index > i ? "-110%" : "110%", opacity: 0 }
          }
          transition={{ type: "spring", stiffness: 60, damping: 14 }}
        >
          {phrase}
        </motion.span>
      ))}
    </span>
  );
}
