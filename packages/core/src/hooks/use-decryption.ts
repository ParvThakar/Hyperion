"use client";

import { useEffect, useState } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*!";

export function useDecryption(
  targetText: string,
  trigger: unknown,
  duration = 600
): string {
  const [displayText, setDisplayText] = useState(targetText);

  useEffect(() => {
    if (!targetText) {
      setDisplayText("");
      return;
    }

    let animationFrameId: number;
    const startTime = performance.now();

    const update = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const revealedLength = Math.floor(progress * targetText.length);

      const scrambled = targetText
        .split("")
        .map((char, index) => {
          if (char === " ") return " ";
          if (index < revealedLength) return char;
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        })
        .join("");

      setDisplayText(scrambled);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(update);
      } else {
        setDisplayText(targetText);
      }
    };

    animationFrameId = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [targetText, trigger, duration]);

  return displayText;
}
