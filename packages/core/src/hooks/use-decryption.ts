"use client";

import { useEffect, useState } from "react";

const GLYPHS = "ABCDEF0123456789!@#$%^&*()_+-=[]{}|;:,.<>?/~";

/**
 * Sci-fi text decryption effect hook that progressively reveals target text.
 *
 * @param text The target text to decrypt/reveal.
 * @param trigger State/value change that re-triggers the animation.
 * @param duration Total duration of the animation in milliseconds.
 */
export function useDecryption(
  text: string,
  trigger: unknown,
  duration = 600
): string {
  const [displayText, setDisplayText] = useState(text);

  useEffect(() => {
    if (!text) {
      setDisplayText("");
      return;
    }

    let animationFrameId: number;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const revealedCount = Math.floor(progress * text.length);

      const nextText = text
        .split("")
        .map((char, index) => {
          if (char === " ") {
            return " ";
          }
          if (index < revealedCount) {
            return char;
          }
          const randomGlyph = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          return randomGlyph ?? char;
        })
        .join("");

      setDisplayText(nextText);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setDisplayText(text);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [text, trigger, duration]);

  return displayText;
}
