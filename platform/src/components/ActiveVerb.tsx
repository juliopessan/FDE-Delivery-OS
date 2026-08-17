"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * The status label for a phase that is currently running. A single fixed word
 * held for four minutes reads as a stuck process, so the agent's own
 * vocabulary cycles through — "Architecting", "Choosing the pattern",
 * "Rejecting swarms" — which also tells the reader what that phase is doing,
 * not merely that it is busy.
 *
 * Each agent starts on a different verb rather than all of them on the first,
 * so two phases running in sequence do not echo each other.
 */
export function ActiveVerb({
  verbs,
  seed = 0,
  intervalMs = 5000,
  className,
}: {
  verbs: string[];
  /** Offsets the starting verb, so different agents do not begin in unison. */
  seed?: number;
  intervalMs?: number;
  className?: string;
}) {
  const [step, setStep] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (verbs.length < 2) return;
    const timer = setInterval(() => setStep((s) => s + 1), intervalMs);
    return () => clearInterval(timer);
  }, [verbs.length, intervalMs]);

  const verb = verbs[(seed + step) % verbs.length];

  if (reduceMotion) {
    return <span className={className}>{verb}…</span>;
  }

  return (
    <span className={[className, "inline-block overflow-hidden align-bottom"].filter(Boolean).join(" ")}>
      <motion.span
        // Keying on the verb makes React swap the node, which is what gives
        // each new word its own entrance.
        key={verb}
        className="inline-block"
        initial={{ y: "0.9em", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.32, ease: [0.2, 0.7, 0.3, 1] }}
      >
        {verb}…
      </motion.span>
    </span>
  );
}
