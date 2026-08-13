"use client";

import { cn } from "@workspace/ui/lib/utils";
import { useDecryption } from "@workspace/core/hooks/use-decryption";
import { motion } from "motion/react";
import type { Dev } from "../dev-cards";

interface AgentInfoPanelProps {
  agentId: string;
  dev: Dev;
  index: number;
}

/**
 * Each content row snaps in as the scan-line passes its vertical
 * position. The stagger delay is tuned so the first item lands
 * ~250ms after mount (while the clip-path shutter is still opening),
 * giving the sense that the container and its contents are one
 * coordinated system.
 */
const cascadeItem = {
  hidden: { filter: "blur(5px)", opacity: 0, x: 14 },
  visible: (delay: number) => ({
    filter: "blur(0px)",
    opacity: 1,
    x: 0,
    transition: {
      damping: 30,
      delay,
      stiffness: 320,
      type: "spring" as const,
    },
  }),
};

export function AgentInfoPanel({ dev, agentId, index }: AgentInfoPanelProps) {
  const decryptedName = useDecryption(dev.name, index, 700);

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

        {/* Dev Designation Tag */}
        <motion.div
          className="mb-1 font-mono text-[0.5rem] uppercase tracking-[0.4em] text-[#EEEEED]/60"
          custom={0.18}
          initial="hidden"
          animate="visible"
          variants={cascadeItem}
        >
          DEV /&#47; {agentId}
        </motion.div>

        {/* Name — decryption glyph effect */}
        <motion.h2
          className="font-display text-xl font-bold tracking-tight text-[#EEEEED] sm:text-2xl"
          custom={0.26}
          initial="hidden"
          animate="visible"
          variants={cascadeItem}
        >
          {decryptedName}
        </motion.h2>

        {/* Role */}
        <motion.div
          className="mt-0.5 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-white/40"
          custom={0.34}
          initial="hidden"
          animate="visible"
          variants={cascadeItem}
        >
          {dev.role}
        </motion.div>

        {/* Divider — draws itself left→right */}
        <motion.div
          animate={{ scaleX: 1 }}
          className="my-3.5 h-px w-full origin-left bg-[#3A3A3A]/50"
          initial={{ scaleX: 0 }}
          transition={{ delay: 0.4, duration: 0.35, ease: [0.76, 0, 0.24, 1] }}
        />

        {/* Directive & Contribution Blocks */}
        <div className="mb-4 flex w-full flex-col gap-3.5 text-left">
          {/* Bio */}
          <motion.div
            className="flex flex-col"
            custom={0.44}
            initial="hidden"
            animate="visible"
            variants={cascadeItem}
          >
            <span className="mb-1 font-mono text-[0.48rem] uppercase tracking-[0.3em] text-[#EEEEED]/30">
              DIRECTIVE /&#47; BIO
            </span>
            <p className="text-xs text-white/60 leading-relaxed">{dev.bio}</p>
          </motion.div>

          {/* Contribution */}
          <motion.div
            className="flex flex-col"
            custom={0.52}
            initial="hidden"
            animate="visible"
            variants={cascadeItem}
          >
            <span className="mb-1 font-mono text-[0.48rem] uppercase tracking-[0.3em] text-[#EEEEED]/30">
              CORE CONTRIBUTION
            </span>
            <p className="text-xs text-white/60 leading-relaxed">
              {dev.contribution}
            </p>
          </motion.div>
        </div>

        {/* Skills Badges */}
        <motion.div
          className="mb-4 flex flex-wrap items-center gap-1.5"
          custom={0.6}
          initial="hidden"
          animate="visible"
          variants={cascadeItem}
        >
          {dev.skills.map((skill) => (
            <span
              className="rounded-md border border-[#3A3A3A] bg-white/5 px-2.5 py-0.5 font-mono text-[0.55rem] tracking-wider text-[#EEEEED]/70"
              key={skill}
            >
              {skill}
            </span>
          ))}
        </motion.div>

        {/* Social Links */}
        <motion.div
          className="flex items-center gap-3"
          custom={0.68}
          initial="hidden"
          animate="visible"
          variants={cascadeItem}
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
