"use client";

import { useScrambleText } from "@workspace/core/hooks/use-scramble-text";
import { cn } from "@workspace/ui/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import type { Dev } from "../dev-cards";

interface AgentInfoPanelProps {
  agentId: string;
  dev: Dev;
  index: number;
}

/* ── Motion constants ──────────────────────────────────────────
   All body rows use the same precise ease-out — no springs here,
   springs feel floaty; we want exact, terminal-crisp timing.
─────────────────────────────────────────────────────────────── */
const EASE_OUT = [0.16, 1, 0.3, 1] as const;

/** Simple fade + lift used for every body row */
const bodyRow = (delayS: number) => ({
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.22, ease: EASE_OUT, delay: delayS },
  },
});

/** Eyebrow/metadata lines — even faster, small y offset */
const metaRow = (delayS: number) => ({
  hidden: { opacity: 0, y: 6 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.15, ease: EASE_OUT, delay: delayS },
  },
});

/** Tiny scale pop for individual skill pills */
const pillVariant = (delayS: number) => ({
  hidden: { opacity: 0, y: 8, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.22, ease: EASE_OUT, delay: delayS },
  },
});

export function AgentInfoPanel({ dev, agentId, index }: AgentInfoPanelProps) {
  /**
   * Per-character scramble on the name.
   * `index` is the trigger — changes every time a new card is centered,
   * which re-fires the scramble for the incoming dev's name.
   * stagger=17ms, speed=40ms, cycles=4 ≈ 450-600ms total for most names.
   */
  const scrambledName = useScrambleText(dev.name, index, {
    stagger: 17,
    speed: 40,
    cycles: 4,
  });

  return (
    <div className="w-full max-w-[480px]">
      <div className="group/panel relative flex w-full flex-col items-start overflow-hidden rounded-2xl border border-[#3A3A3A] bg-[#080705]/95 p-5 text-left shadow-[0_0_60px_rgba(0,0,0,0.95)] backdrop-blur-2xl sm:p-6">
        {/* Top Sci-Fi Accent Line */}
        <div className="absolute inset-x-0 top-0 h-0.5 rounded-t-2xl bg-gradient-to-r from-transparent via-[#EEEEED]/30 to-transparent" />

        {/* ── Scan-line ──
            A thin horizontal beam that sweeps top → bottom once,
            giving the illusion of a scanner "activating" each row
            as it passes. Pure CSS animation, no JS overhead. */}
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-x-0 top-0 z-30 h-px",
            "bg-gradient-to-r from-transparent via-[#EEEEED]/50 to-transparent",
            "animate-[scanDown_0.8s_0.15s_ease-out_both]",
            "[box-shadow:0_0_12px_2px_rgba(238,238,237,0.15)]"
          )}
        />

        {/* Dev Designation Tag — metadata, plain fade+slide, no scramble */}
        <motion.div
          animate="visible"
          className="mb-1 font-mono text-[0.5rem] uppercase tracking-[0.4em] text-[#EEEEED]/60"
          initial="hidden"
          variants={metaRow(0.1)}
        >
          DEV /&#47; {agentId}
        </motion.div>

        {/* Name — per-character scramble decode (the signature effect) */}
        <motion.h2
          animate="visible"
          className="font-display text-xl font-bold tracking-tight text-[#EEEEED] sm:text-2xl"
          initial="hidden"
          variants={metaRow(0.1)}
        >
          {scrambledName}
        </motion.h2>

        {/* Role — metadata, same fast fade */}
        <motion.div
          animate="visible"
          className="mt-0.5 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-white/40"
          initial="hidden"
          variants={metaRow(0.18)}
        >
          {dev.role}
        </motion.div>

        {/* Divider — draws itself left→right, origin-left */}
        <motion.div
          animate={{ scaleX: 1 }}
          className="my-3.5 h-px w-full origin-left bg-[#3A3A3A]/50"
          initial={{ scaleX: 0 }}
          transition={{ delay: 0.3, duration: 0.2, ease: [0.76, 0, 0.24, 1] }}
        />

        {/* Body content — staggered 80ms apart, starting at ~100ms */}
        <div className="mb-4 flex w-full flex-col gap-3.5 text-left">
          {/* Bio */}
          <motion.div
            animate="visible"
            className="flex flex-col"
            initial="hidden"
            variants={bodyRow(0.4)}
          >
            <span className="mb-1 font-mono text-[0.48rem] uppercase tracking-[0.3em] text-[#EEEEED]/30">
              DIRECTIVE /&#47; BIO
            </span>
            <p className="text-xs leading-relaxed text-white/60">{dev.bio}</p>
          </motion.div>

          {/* Contribution */}
          <motion.div
            animate="visible"
            className="flex flex-col"
            initial="hidden"
            variants={bodyRow(0.48)}
          >
            <span className="mb-1 font-mono text-[0.48rem] uppercase tracking-[0.3em] text-[#EEEEED]/30">
              CORE CONTRIBUTION
            </span>
            <p className="text-xs leading-relaxed text-white/60">
              {dev.contribution}
            </p>
          </motion.div>
        </div>

        {/* Skills Badges — individual pill stagger */}
        <div className="mb-4 flex flex-wrap items-center gap-1.5">
          <AnimatePresence>
            {dev.skills.map((skill, i) => (
              <motion.span
                animate="visible"
                className="rounded-md border border-[#3A3A3A] bg-white/5 px-2.5 py-0.5 font-mono text-[0.55rem] tracking-wider text-[#EEEEED]/70"
                initial="hidden"
                key={skill}
                variants={pillVariant(0.56 + i * 0.04)}
              >
                {skill}
              </motion.span>
            ))}
          </AnimatePresence>
        </div>

        {/* Social Links */}
        <motion.div
          animate="visible"
          className="flex items-center gap-3"
          initial="hidden"
          variants={bodyRow(0.64 + dev.skills.length * 0.04)}
        >
          {dev.github && (
            <a
              className="rounded-md border border-[#3A3A3A] bg-[#080705]/40 px-3 py-1 font-mono text-[0.55rem] tracking-[0.18em] text-[#EEEEED]/80 transition-all duration-200 hover:border-[#EEEEED]/40 hover:bg-[#EEEEED]/10 hover:text-[#EEEEED]"
              href={dev.github}
              rel="noreferrer"
              target="_blank"
            >
              [ GITHUB ]
            </a>
          )}
          {dev.linkedin && (
            <a
              className="rounded-md border border-[#3A3A3A] bg-[#080705]/40 px-3 py-1 font-mono text-[0.55rem] tracking-[0.18em] text-[#EEEEED]/80 transition-all duration-200 hover:border-[#EEEEED]/40 hover:bg-[#EEEEED]/10 hover:text-[#EEEEED]"
              href={dev.linkedin}
              rel="noreferrer"
              target="_blank"
            >
              [ LINKEDIN ]
            </a>
          )}
        </motion.div>
      </div>
    </div>
  );
}
