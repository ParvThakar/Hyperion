"use client";

import gsap from "gsap";
import { useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

interface UseMagneticOptions {
  /** Maximum pixel offset the element is allowed to travel. */
  strength?: number;
}

/**
 * Subtle magnetic hover — the element eases a few pixels toward the
 * cursor while it's nearby, then springs back on leave. Built on GSAP's
 * `quickTo` so repeated pointer moves never touch React state (no
 * re-renders) and only ever animate `transform` (GPU-friendly).
 *
 * Reusable across any interactive element — attach the returned ref.
 */
export function useMagnetic<T extends HTMLElement>({
  strength = 8,
}: UseMagneticOptions = {}) {
  const ref = useRef<T>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!(el && !reducedMotion)) {
      return;
    }

    const xTo = gsap.quickTo(el, "x", { duration: 0.35, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.35, ease: "power3.out" });

    const handleMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const offsetX = e.clientX - (rect.left + rect.width / 2);
      const offsetY = e.clientY - (rect.top + rect.height / 2);
      xTo(gsap.utils.clamp(-strength, strength, offsetX * 0.35));
      yTo(gsap.utils.clamp(-strength, strength, offsetY * 0.35));
    };

    const handleLeave = () => {
      xTo(0);
      yTo(0);
    };

    el.addEventListener("pointermove", handleMove);
    el.addEventListener("pointerleave", handleLeave);

    return () => {
      el.removeEventListener("pointermove", handleMove);
      el.removeEventListener("pointerleave", handleLeave);
      gsap.set(el, { x: 0, y: 0 });
    };
  }, [reducedMotion, strength]);

  return ref;
}
