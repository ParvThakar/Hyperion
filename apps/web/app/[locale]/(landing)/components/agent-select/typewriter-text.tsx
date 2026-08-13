"use client";

import { useEffect, useRef, useState } from "react";

interface TypewriterTextProps {
  /** Whether the typewriter animation should start */
  active: boolean;
  /** Called when the full text has been revealed */
  onComplete?: () => void;
  /** Milliseconds per character */
  speed?: number;
  /** The target text to type out */
  text: string;
}

/**
 * TypewriterText — reveals text character-by-character at a steady
 * cadence. Starts only when `active` becomes true, fires `onComplete`
 * after the last character lands. Resets cleanly when `text` changes.
 */
export function useTypewriter({
  active,
  onComplete,
  speed = 22,
  text,
}: TypewriterTextProps): string {
  const [revealedCount, setRevealedCount] = useState(0);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  // Reset when text changes
  useEffect(() => {
    setRevealedCount(0);
  }, [text]);

  useEffect(() => {
    if (!active || revealedCount >= text.length) {
      return;
    }

    const timer = setTimeout(() => {
      const next = revealedCount + 1;
      setRevealedCount(next);
      if (next >= text.length) {
        onCompleteRef.current?.();
      }
    }, speed);

    return () => clearTimeout(timer);
  }, [active, revealedCount, text, speed]);

  if (!active) {
    return "";
  }

  return text.slice(0, revealedCount);
}

/**
 * Inline component variant — renders a `<span>` with the typed text
 * and an optional blinking cursor.
 */
export function TypewriterText({
  active,
  className,
  cursor = true,
  onComplete,
  speed,
  text,
}: TypewriterTextProps & { className?: string; cursor?: boolean }) {
  const displayed = useTypewriter({ active, onComplete, speed, text });
  const isDone = displayed.length >= text.length;

  return (
    <span className={className}>
      {displayed}
      {cursor && !isDone && active && (
        <span className="animate-pulse text-[#EEEEED]/60">▌</span>
      )}
    </span>
  );
}
