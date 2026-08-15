"use client";

import { useEffect, useState } from "react";

const DEFAULT_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$%&@()-_#!?";

interface ScrambleOptions {
  /** custom glyph pool */
  chars?: string;
  /** number of random glyph swaps per character before locking */
  cycles?: number;
  /** ms between each glyph swap within a single character's cycling phase */
  speed?: number;
  /** ms between each character starting its scramble (left-to-right sweep) */
  stagger?: number;
}

/**
 * Per-character scramble/decrypt effect.
 *
 * Each character cycles through `cycles` random glyphs at `speed` ms per
 * swap, staggered `stagger` ms after the previous character, then locks to
 * the correct final character. Spaces are skipped instantly.
 *
 * The effect re-runs whenever `trigger` changes (same pattern as
 * useDecryption). All intervals are cleared on unmount — interruption-safe.
 *
 * @param finalText  The text to ultimately display.
 * @param trigger    State value whose change re-triggers the animation.
 * @param options    Timing and glyph-pool options.
 */
export function useScrambleText(
  finalText: string,
  trigger: unknown,
  options: ScrambleOptions = {}
): string {
  const {
    speed = 40,
    stagger = 17,
    cycles = 4,
    chars = DEFAULT_CHARS,
  } = options;

  const [display, setDisplay] = useState(finalText);

  useEffect(() => {
    if (!finalText) {
      setDisplay("");
      return;
    }

    // Check reduced motion preference — skip to final text immediately
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      setDisplay(finalText);
      return;
    }

    // Shared mutable array — each character slot independently updates it.
    // Explicitly typed to prevent TS narrowing the map result to (" " | null)[].
    const chars_arr: (string | null)[] = finalText
      .split("")
      .map((c) => (c === " " ? " " : null));
    const intervalIds: ReturnType<typeof setInterval>[] = [];
    const timeoutIds: ReturnType<typeof setTimeout>[] = [];

    const randomGlyph = () =>
      chars[Math.floor(Math.random() * chars.length)] ?? "X";

    const pushDisplay = (locked: (string | null)[]) => {
      setDisplay(
        locked
          .map((c, i) =>
            c === null ? (finalText[i] === " " ? " " : randomGlyph()) : c
          )
          .join("")
      );
    };

    finalText.split("").forEach((char, charIdx) => {
      // Spaces don't scramble — mark them locked immediately
      if (char === " ") {
        chars_arr[charIdx] = " ";
        return;
      }

      let cycleCount = 0;

      const tid = setTimeout(() => {
        // Emit a random glyph immediately when this char starts
        pushDisplay(chars_arr);

        const iid = setInterval(() => {
          cycleCount++;
          if (cycleCount >= cycles) {
            // Lock to final character
            chars_arr[charIdx] = char;
            clearInterval(iid);
          }
          pushDisplay(chars_arr);
        }, speed);

        intervalIds.push(iid);
      }, charIdx * stagger);

      timeoutIds.push(tid);
    });

    return () => {
      for (const id of intervalIds) {
        clearInterval(id);
      }
      for (const id of timeoutIds) {
        clearTimeout(id);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finalText, trigger]);

  return display;
}
