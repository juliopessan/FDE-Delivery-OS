"use client";

import { Fragment } from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * Reveals a line one word at a time, each rising into place. Used on the
 * hero's claim, where a single sentence has to carry the positioning: the
 * words arrive in reading order, so the eye is led through the claim rather
 * than handed all of it at once.
 *
 * Runs once on load — a claim that keeps re-animating reads as decoration.
 * Styling stays with the caller; this owns the motion, not the look.
 *
 * The words are the real text, not a decorative copy of it: splitting a
 * sentence across spans still reads correctly to assistive technology and to
 * copy/paste, whereas mirroring it into a visually-hidden sibling would put
 * the sentence in the document twice.
 */
export function WordReveal({
  text,
  className,
  delay = 0,
  stagger = 0.075,
}: {
  text: string;
  className?: string;
  /** Seconds before the first word appears. */
  delay?: number;
  /** Seconds between consecutive words. */
  stagger?: number;
}) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <span className={className}>{text}</span>;
  }

  const words = text.split(" ");

  return (
    <span className={className}>
      {words.map((word, i) => (
        // The space sits between the clipping wrappers, never inside one.
        // Kept inside, it joins an indivisible inline-block and both the word
        // spacing and the line breaking go wrong.
        <Fragment key={`${word}-${i}`}>
          <span className="inline-block overflow-hidden align-bottom">
            <motion.span
              className="inline-block"
              initial={{ y: "0.9em", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                delay: delay + i * stagger,
                duration: 0.55,
                ease: [0.2, 0.7, 0.3, 1],
              }}
            >
              {word}
            </motion.span>
          </span>
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </span>
  );
}
