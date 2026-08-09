"use client";

import { useDecryption } from "@workspace/core/hooks/use-decryption";
import { motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Dev } from "../dev-cards";
import { AgentEnvironment } from "./agent-environment";
import { AgentInfoPanel } from "./agent-info-panel";
import { MobileNavControls, SingleNavButton } from "./agent-nav-controls";
import { AgentSelectorRail } from "./agent-selector-rail";
import { CharacterStage } from "./character-stage";

/* ── Boot Sequence ─────────────────────────────────────────── */

function BootSequence() {
  const text = useDecryption("DEVS ONLINE", "boot", 800);

  return (
    <div className="flex flex-col items-center gap-4">
      <motion.div
        animate={{ opacity: [0, 1, 0], scaleX: [0, 1, 1] }}
        className="h-px w-48 bg-white/60"
        transition={{ duration: 1, ease: "easeInOut", times: [0, 0.5, 1] }}
      />
      <span className="font-mono text-[0.6rem] uppercase tracking-[0.5em] text-white/40">
        [ {text} ]
      </span>
      <motion.div
        animate={{ opacity: [0, 1, 0], scaleX: [0, 1, 1] }}
        className="h-px w-48 bg-white/60"
        transition={{ duration: 1, ease: "easeInOut", times: [0, 0.5, 1] }}
      />
    </div>
  );
}

/* ── AgentSelect Orchestrator ──────────────────────────────── */

export function AgentSelect({ devs }: { devs: Dev[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isBooting, setIsBooting] = useState(true);

  /* Touch/swipe tracking */
  const pointerStartX = useRef(0);
  const sectionRef = useRef<HTMLElement>(null);

  /* Boot sequence */
  useEffect(() => {
    const timer = setTimeout(() => setIsBooting(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  /* Navigation helpers */
  const goTo = useCallback(
    (index: number) => {
      if (index === activeIndex) {
        return;
      }
      setDirection(index > activeIndex ? 1 : -1);
      setActiveIndex(index);
    },
    [activeIndex]
  );

  const goPrev = useCallback(() => {
    setDirection(-1);
    setActiveIndex((p) => (p > 0 ? p - 1 : devs.length - 1));
  }, [devs.length]);

  const goNext = useCallback(() => {
    setDirection(1);
    setActiveIndex((p) => (p < devs.length - 1 ? p + 1 : 0));
  }, [devs.length]);

  /* Keyboard navigation */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        goPrev();
      } else if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        goNext();
      } else if (e.key >= "1" && e.key <= "5") {
        const idx = Number.parseInt(e.key, 10) - 1;
        if (idx < devs.length) {
          e.preventDefault();
          goTo(idx);
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [devs.length, goNext, goPrev, goTo]);

  /* Touch swipe */
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    pointerStartX.current = e.clientX;
  }, []);

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      const delta = e.clientX - pointerStartX.current;
      if (Math.abs(delta) > 50) {
        if (delta < 0) {
          goNext();
        } else {
          goPrev();
        }
      }
    },
    [goNext, goPrev]
  );

  const activeDev = devs[activeIndex];
  if (!activeDev) {
    return null;
  }

  const prevIndex = activeIndex > 0 ? activeIndex - 1 : devs.length - 1;
  const nextIndex = activeIndex < devs.length - 1 ? activeIndex + 1 : 0;
  const prevDev = devs[prevIndex];
  const nextDev = devs[nextIndex];
  const agentId = `${activeDev.initials}-${String(activeIndex + 1).padStart(2, "0")}`;

  return (
    <section
      className="relative flex min-h-screen flex-col items-center justify-between overflow-hidden bg-black selection:bg-white/20 pt-20 pb-4 sm:pt-24 sm:pb-6"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      ref={sectionRef}
    >
      {/* ── Environment ── */}
      <AgentEnvironment activeIndex={activeIndex} />

      {/* ── Boot overlay ── */}
      {isBooting && (
        <motion.div
          animate={{ opacity: 1 }}
          className="absolute inset-0 z-50 flex items-center justify-center bg-black"
          exit={{ opacity: 0 }}
          initial={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <BootSequence />
        </motion.div>
      )}

      {/* ── Section Header ── */}
      <motion.div
        animate={isBooting ? { opacity: 0 } : { opacity: 1 }}
        className="relative z-10 shrink-0 text-center pt-2 sm:pt-4 mb-2"
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <span className="font-mono text-[0.55rem] uppercase tracking-[0.5em] text-white/20">
          HYPERION DEVS
        </span>
      </motion.div>

      {/* ── Main Stage Split Grid Area ── */}
      <div className="relative z-10 flex w-full max-w-[1400px] flex-1 flex-col items-center justify-center px-4 sm:px-8">
        {/* Desktop Floating PREV Button */}
        <div className="absolute left-2 xl:left-6 top-1/2 z-30 hidden -translate-y-1/2 lg:block">
          <SingleNavButton
            direction="prev"
            label={prevDev?.name.split(" ")[0] ?? ""}
            onClick={goPrev}
          />
        </div>

        {/* Split Grid: Left = Max Size Figure, Right = Trimmed Dev Details Box */}
        <div className="grid w-full grid-cols-1 items-center gap-6 px-2 sm:px-12 lg:grid-cols-12 lg:gap-8 lg:px-20 xl:px-24">
          {/* Left Column: Founder PNG (Max Size + shifted slightly right) */}
          <div className="flex w-full items-center justify-center lg:col-span-5 lg:justify-end lg:translate-x-6">
            <CharacterStage dev={activeDev} direction={direction} />
          </div>

          {/* Right Column: Trimmed Developer Details Box (max-w-[480px]) */}
          <div className="flex w-full items-center justify-center lg:col-span-7 lg:justify-start lg:pl-2">
            <AgentInfoPanel
              agentId={agentId}
              dev={activeDev}
              index={activeIndex}
            />
          </div>
        </div>

        {/* Desktop Floating NEXT Button */}
        <div className="absolute right-2 xl:right-6 top-1/2 z-30 hidden -translate-y-1/2 lg:block">
          <SingleNavButton
            direction="next"
            label={nextDev?.name.split(" ")[0] ?? ""}
            onClick={goNext}
          />
        </div>

        {/* Mobile Nav Controls */}
        <div className="mt-4 flex justify-center lg:hidden">
          <MobileNavControls
            nextLabel={nextDev?.name.split(" ")[0] ?? ""}
            onNext={goNext}
            onPrev={goPrev}
            prevLabel={prevDev?.name.split(" ")[0] ?? ""}
          />
        </div>
      </div>

      {/* ── Selector Rail ── */}
      <div className="relative z-10 mt-6 w-full shrink-0 px-4 pb-2 sm:pb-4">
        <AgentSelectorRail
          activeIndex={activeIndex}
          devs={devs}
          onSelect={goTo}
        />
      </div>

      {/* ── Bottom gradient fade ── */}
      <div
        aria-hidden={true}
        className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-16 bg-gradient-to-t from-black to-transparent"
      />
    </section>
  );
}
