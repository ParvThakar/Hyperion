"use client";

import { useDecryption } from "@workspace/core/hooks/use-decryption";
import { AnimatePresence, motion } from "motion/react";
import type { Dev } from "../dev-cards";

interface AgentInfoPanelProps {
  agentId: string;
  dev: Dev;
  index: number;
}

const itemVariants = {
  initial: { filter: "blur(4px)", opacity: 0, x: 15 },
  animate: (delay: number) => ({
    filter: "blur(0px)",
    opacity: 1,
    x: 0,
    transition: {
      damping: 28,
      delay: delay / 1000,
      stiffness: 280,
      type: "spring" as const,
    },
  }),
  exit: {
    filter: "blur(4px)",
    opacity: 0,
    transition: { duration: 0.15 },
    x: -12,
  },
};

export function AgentInfoPanel({ dev, agentId, index }: AgentInfoPanelProps) {
  const decryptedName = useDecryption(dev.name, index, 700);

  return (
    <div className="w-full max-w-[480px]">
      <AnimatePresence mode="wait">
        <motion.div
          className="relative flex w-full flex-col items-start rounded-2xl border border-[#3A3A3A] bg-[#080705]/95 p-5 text-left shadow-[0_0_60px_rgba(0,0,0,0.95)] backdrop-blur-2xl sm:p-6"
          key={dev.name}
        >
          {/* Top Sci-Fi Accent Line (Monochromatic Platinum) */}
          <div className="absolute inset-x-0 top-0 h-0.5 rounded-t-2xl bg-gradient-to-r from-transparent via-[#EEEEED]/30 to-transparent" />

          {/* Dev Designation Tag */}
          <motion.div
            animate="animate"
            className="mb-1 font-mono text-[0.5rem] uppercase tracking-[0.4em] text-[#EEEEED]/60"
            custom={0}
            exit="exit"
            initial="initial"
            variants={itemVariants}
          >
            DEV /&#47; {agentId}
          </motion.div>

          {/* Name */}
          <motion.h2
            animate="animate"
            className="font-display text-xl font-bold tracking-tight text-[#EEEEED] sm:text-2xl"
            custom={60}
            exit="exit"
            initial="initial"
            variants={itemVariants}
          >
            {decryptedName}
          </motion.h2>

          {/* Role */}
          <motion.div
            animate="animate"
            className="mt-0.5 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-white/40"
            custom={120}
            exit="exit"
            initial="initial"
            variants={itemVariants}
          >
            {dev.role}
          </motion.div>

          {/* Divider */}
          <motion.div
            animate="animate"
            className="my-3.5 h-px w-full bg-[#3A3A3A]/50"
            custom={160}
            exit="exit"
            initial="initial"
            variants={itemVariants}
          />

          {/* Directive & Contribution Blocks */}
          <div className="mb-4 flex w-full flex-col gap-3.5 text-left">
            <motion.div
              animate="animate"
              className="flex flex-col"
              custom={200}
              exit="exit"
              initial="initial"
              variants={itemVariants}
            >
              <span className="mb-1 font-mono text-[0.48rem] uppercase tracking-[0.3em] text-[#EEEEED]/30">
                DIRECTIVE /&#47; BIO
              </span>
              <p className="text-xs text-white/60 leading-relaxed">{dev.bio}</p>
            </motion.div>

            <motion.div
              animate="animate"
              className="flex flex-col"
              custom={260}
              exit="exit"
              initial="initial"
              variants={itemVariants}
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
            animate="animate"
            className="mb-4 flex flex-wrap items-center gap-1.5"
            custom={320}
            exit="exit"
            initial="initial"
            variants={itemVariants}
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
            animate="animate"
            className="flex items-center gap-3"
            custom={380}
            exit="exit"
            initial="initial"
            variants={itemVariants}
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
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
