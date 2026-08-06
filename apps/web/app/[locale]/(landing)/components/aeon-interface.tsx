"use client";

import { useDecryption } from "@workspace/core/hooks/use-decryption";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { AeonConsole } from "./aeon-console";
import { AeonHologram } from "./aeon-hologram";
import { AeonHUD } from "./aeon-hud";
import type { Dev } from "./dev-cards";

/* ── AeonInterface Orchestrator ────────────────────────────── */

export function AeonInterface({ devs }: { devs: Dev[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isInitializing, setIsInitializing] = useState(true);

  // Initial scroll-in boot sequence
  useEffect(() => {
    const timer = setTimeout(() => setIsInitializing(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((p) => (p > 0 ? p - 1 : devs.length - 1));
      } else if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((p) => (p < devs.length - 1 ? p + 1 : 0));
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [devs.length]);

  const activeDev = devs[activeIndex];

  if (!activeDev) {
    return null;
  }

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-between overflow-hidden bg-black selection:bg-white/20">
      {/* ── Environment Background ── */}
      {/* Dark gradient void */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.02)_0%,black_100%)]" />

      {/* Reflective floor fade */}
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black via-black/80 to-transparent z-20 pointer-events-none" />

      {/* ── Boot Sequence Overlay ── */}
      {isInitializing && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black">
          <BootSequence />
        </div>
      )}

      {/* ── Main Stage ── */}
      <div className="relative z-10 flex w-full flex-1 flex-col items-center justify-center">
        {/* The Hologram Materialization */}
        <div className="w-full max-w-5xl px-4 pt-10 sm:pt-16">
          <AeonHologram dev={activeDev} />
        </div>

        {/* Floating Spatial HUD */}
        <AeonHUD dev={activeDev} isActive={!isInitializing} />
      </div>

      {/* ── Command Console Queue ── */}
      <div className="relative z-30 w-full pb-8 pt-4">
        <AeonConsole
          activeIndex={activeIndex}
          devs={devs}
          onSelect={setActiveIndex}
        />
      </div>
    </section>
  );
}

/* ── BootSequence Component ── */
function BootSequence() {
  const text = useDecryption("SYSTEM ONLINE", "boot", 800);

  return (
    <div className="flex flex-col items-center gap-4">
      <motion.div
        animate={{ scaleX: [0, 1, 1], opacity: [0, 1, 0] }}
        className="h-px w-64 bg-white"
        transition={{ duration: 1, times: [0, 0.5, 1], ease: "easeInOut" }}
      />
      <span className="font-mono text-xs tracking-[0.5em] text-white/50 uppercase">
        [ {text} ]
      </span>
      <motion.div
        animate={{ scaleX: [0, 1, 1], opacity: [0, 1, 0] }}
        className="h-px w-64 bg-white"
        transition={{ duration: 1, times: [0, 0.5, 1], ease: "easeInOut" }}
      />
    </div>
  );
}
