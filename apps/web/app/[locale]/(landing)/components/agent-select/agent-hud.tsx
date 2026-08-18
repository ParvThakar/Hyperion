"use client";

import { useScrambleText } from "@workspace/core/hooks/use-scramble-text";
import { cn } from "@workspace/ui/lib/utils";
import { motion, useReducedMotion, type Variants } from "motion/react";
import type { ReactNode } from "react";
import type { Dev } from "../dev-cards";
import { useMagnetic } from "./use-magnetic";

interface AgentHUDProps {
  dev: Dev;
  index: number;
  onClose: () => void;
}

type Corner = "bl" | "br" | "tl" | "tr";

/* ── Motion constants ───────────────────────────────────────────
   One custom cubic-bezier used for every "settle" motion (position,
   opacity, blur, clip-path) so the whole reveal reads as one engineered
   system rather than four differently-tuned animations. `backOut` is
   reserved for scale/rotate only, where a touch of overshoot reads as
   a mechanical "lock" rather than a bounce. */
const SETTLE_EASE = [0.22, 1, 0.36, 1] as const;
const PANEL_DURATION = 0.48;
const CONTAINER_STAGGER = 0.09;
const CHILD_STAGGER = 0.045;
const CHILD_DELAY = 0.16;

/* Each panel starts shifted toward the character and settles outward
   into its resting corner — a targeting HUD deploying readouts around
   its subject rather than four cards fading onto the screen. */
const CORNER_OFFSET: Record<Corner, { x: number; y: number }> = {
  bl: { x: 120, y: -60 },
  br: { x: -120, y: -60 },
  tl: { x: 120, y: 60 },
  tr: { x: -120, y: 60 },
};

/* Reveal direction per corner — left/right pair mirrors so the four
   panels don't all wipe the same way. */
const CLIP_HIDDEN: Record<Corner, string> = {
  bl: "inset(0% 0% 0% 100%)", // right → left
  br: "inset(0% 100% 0% 0%)", // left → right
  tl: "inset(0% 0% 0% 100%)", // right → left
  tr: "inset(0% 100% 0% 0%)", // left → right
};
const CLIP_VISIBLE = "inset(0% 0% 0% 0%)";

const ROTATE_FROM: Record<Corner, number> = {
  bl: -3,
  br: 3,
  tl: -3,
  tr: 3,
};

/* ── Variant builders ──────────────────────────────────────────── */

function buildContainerVariants(reducedMotion: boolean): Variants {
  return {
    exit: {
      transition: {
        staggerChildren: reducedMotion ? 0 : 0.035,
        staggerDirection: -1,
      },
    },
    hidden: {},
    visible: {
      transition: {
        delayChildren: reducedMotion ? 0 : 0.05,
        staggerChildren: reducedMotion ? 0 : CONTAINER_STAGGER,
      },
    },
  };
}

function buildPanelVariants(corner: Corner, reducedMotion: boolean): Variants {
  const offset = CORNER_OFFSET[corner];
  return {
    exit: {
      clipPath: reducedMotion ? CLIP_VISIBLE : CLIP_HIDDEN[corner],
      filter: reducedMotion ? "blur(0px)" : "blur(4px)",
      opacity: 0,
      scale: 0.94,
      transition: { duration: reducedMotion ? 0.01 : 0.22, ease: "easeIn" },
      x: reducedMotion ? 0 : offset.x * 0.5,
      y: reducedMotion ? 0 : offset.y * 0.5,
    },
    hidden: {
      clipPath: reducedMotion ? CLIP_VISIBLE : CLIP_HIDDEN[corner],
      filter: reducedMotion ? "blur(0px)" : "blur(6px)",
      opacity: 0,
      rotate: reducedMotion ? 0 : ROTATE_FROM[corner],
      scale: 0.9,
      x: reducedMotion ? 0 : offset.x,
      y: reducedMotion ? 0 : offset.y,
    },
    visible: {
      clipPath: CLIP_VISIBLE,
      filter: "blur(0px)",
      opacity: 1,
      rotate: 0,
      scale: 1,
      transition: {
        default: {
          duration: reducedMotion ? 0.01 : PANEL_DURATION,
          ease: SETTLE_EASE,
        },
        delayChildren: reducedMotion ? 0 : CHILD_DELAY,
        rotate: {
          duration: reducedMotion ? 0.01 : PANEL_DURATION,
          ease: "backOut",
        },
        scale: {
          duration: reducedMotion ? 0.01 : PANEL_DURATION,
          ease: "backOut",
        },
        staggerChildren: reducedMotion ? 0 : CHILD_STAGGER,
      },
      x: 0,
      y: 0,
    },
  };
}

function buildItemVariants(reducedMotion: boolean): Variants {
  return {
    hidden: { opacity: 0, y: reducedMotion ? 0 : 8 },
    visible: {
      opacity: 1,
      transition: { duration: reducedMotion ? 0.01 : 0.3, ease: SETTLE_EASE },
      y: 0,
    },
  };
}

function buildTagGroupVariants(reducedMotion: boolean): Variants {
  return {
    hidden: {},
    visible: {
      transition: { staggerChildren: reducedMotion ? 0 : 0.035 },
    },
  };
}

/* ── Panel shell ──────────────────────────────────────────────── */

interface PanelShellProps {
  children: ReactNode;
  className: string;
  corner: Corner;
  reducedMotion: boolean;
}

function PanelShell({
  children,
  className,
  corner,
  reducedMotion,
}: PanelShellProps) {
  return (
    <div className={cn("absolute", className)}>
      <motion.div
        className="group pointer-events-auto relative rounded-xl border border-[#3A3A3A] bg-[#080705]/95 p-5 shadow-[0_0_40px_rgba(0,0,0,0.85)] backdrop-blur-2xl"
        style={{ transformOrigin: corner.includes("t") ? "bottom" : "top" }}
        variants={buildPanelVariants(corner, reducedMotion)}
        whileHover={
          reducedMotion
            ? undefined
            : {
                borderColor: "rgba(238,238,237,0.35)",
                boxShadow: "0 0 48px rgba(0,0,0,0.9)",
                y: -4,
              }
        }
      >
        {/* Top accent line — matches the dossier card language */}
        <div className="absolute inset-x-0 top-0 h-0.5 rounded-t-xl bg-gradient-to-r from-transparent via-[#EEEEED]/25 to-transparent" />
        {children}
      </motion.div>
    </div>
  );
}

function PanelLabel({ children }: { children: ReactNode }) {
  return (
    <span className="mb-2 block font-mono text-[0.55rem] uppercase tracking-[0.3em] text-[#EEEEED]/35">
      {children}
    </span>
  );
}

/* ── Root component ───────────────────────────────────────────── */

export function AgentHUD({ dev, index, onClose }: AgentHUDProps) {
  const reducedMotion = useReducedMotion() ?? false;
  const scrambledName = useScrambleText(dev.name, index, {
    cycles: 3,
    speed: 30,
    stagger: 12,
  });
  const titleId = "agent-hud-name";

  const githubRef = useMagnetic<HTMLAnchorElement>({ strength: 6 });
  const linkedinRef = useMagnetic<HTMLAnchorElement>({ strength: 6 });

  const itemVariants = buildItemVariants(reducedMotion);
  const tagGroupVariants = buildTagGroupVariants(reducedMotion);

  return (
    <motion.div
      animate="visible"
      aria-labelledby={titleId}
      aria-modal="true"
      className="fixed inset-0 z-40"
      exit="exit"
      initial="hidden"
      role="dialog"
      variants={buildContainerVariants(reducedMotion)}
    >
      <div className="relative mx-auto h-full w-full max-w-[1400px] px-4 sm:px-8">
        {/* ── Identity — top-left ── */}
        <PanelShell
          className="left-[5%] top-[16%] w-[320px] xl:left-[12%] xl:top-[22%]"
          corner="tl"
          reducedMotion={reducedMotion}
        >
          <motion.div
            className="flex items-center gap-1.5"
            variants={itemVariants}
          >
            <motion.span
              animate={{ scale: reducedMotion ? 1 : [0, 1.4, 1] }}
              className="block size-1.5 rounded-full bg-[#EEEEED]"
              transition={{ delay: reducedMotion ? 0 : 0.1, duration: 0.5 }}
            />
            <span className="font-mono text-[0.48rem] uppercase tracking-[0.35em] text-[#EEEEED]/40">
              Active
            </span>
          </motion.div>
          <motion.h2
            className="mt-1.5 font-display text-xl font-bold tracking-tight text-[#EEEEED]"
            id={titleId}
            variants={itemVariants}
          >
            {scrambledName}
          </motion.h2>
          <motion.div
            className="mt-1 font-mono text-[0.65rem] uppercase leading-relaxed tracking-[0.16em] text-white/45"
            variants={itemVariants}
          >
            {dev.role}
          </motion.div>
        </PanelShell>

        {/* ── Loadout — top-right ── */}
        <PanelShell
          className="right-[5%] top-[16%] w-[300px] xl:right-[12%] xl:top-[22%]"
          corner="tr"
          reducedMotion={reducedMotion}
        >
          <motion.div variants={itemVariants}>
            <PanelLabel>Stack</PanelLabel>
          </motion.div>
          <motion.div
            className="flex flex-wrap items-center gap-1.5"
            variants={tagGroupVariants}
          >
            {dev.skills.map((skill) => (
              <motion.span
                className="rounded-md border border-[#3A3A3A] bg-white/5 px-2.5 py-1 font-mono text-[0.58rem] tracking-wider text-[#EEEEED]/75 transition-colors duration-150 hover:border-[#EEEEED]/40 hover:text-[#EEEEED]"
                key={skill}
                variants={itemVariants}
              >
                {skill}
              </motion.span>
            ))}
          </motion.div>
        </PanelShell>

        {/* ── Directive / Bio — bottom-left (largest) ── */}
        <PanelShell
          className="bottom-[12%] left-[5%] w-[380px] xl:bottom-[18%] xl:left-[12%]"
          corner="bl"
          reducedMotion={reducedMotion}
        >
          <motion.div variants={itemVariants}>
            <PanelLabel>Directive /&#47; Bio</PanelLabel>
          </motion.div>
          <motion.p
            className="text-sm leading-6 text-white/65"
            variants={itemVariants}
          >
            {dev.bio}
          </motion.p>
        </PanelShell>

        {/* ── Core Contribution + socials — bottom-right ── */}
        <PanelShell
          className="right-[5%] bottom-[12%] w-[380px] xl:right-[12%] xl:bottom-[18%]"
          corner="br"
          reducedMotion={reducedMotion}
        >
          <motion.div variants={itemVariants}>
            <PanelLabel>Core Contribution</PanelLabel>
          </motion.div>
          <motion.p
            className="text-sm leading-6 text-white/65"
            variants={itemVariants}
          >
            {dev.contribution}
          </motion.p>
          {(dev.github || dev.linkedin) && (
            <motion.div
              className="mt-3 flex items-center gap-2 border-t border-[#3A3A3A]/50 pt-3"
              variants={itemVariants}
            >
              {dev.github && (
                <a
                  className="inline-flex rounded-md border border-[#3A3A3A] bg-[#080705]/40 px-2.5 py-1 font-mono text-[0.5rem] tracking-[0.18em] text-[#EEEEED]/80 transition-colors duration-200 hover:border-[#EEEEED]/40 hover:bg-[#EEEEED]/10 hover:text-[#EEEEED]"
                  href={dev.github}
                  ref={githubRef}
                  rel="noreferrer"
                  target="_blank"
                >
                  [ GITHUB ]
                </a>
              )}
              {dev.linkedin && (
                <a
                  className="inline-flex rounded-md border border-[#3A3A3A] bg-[#080705]/40 px-2.5 py-1 font-mono text-[0.5rem] tracking-[0.18em] text-[#EEEEED]/80 transition-colors duration-200 hover:border-[#EEEEED]/40 hover:bg-[#EEEEED]/10 hover:text-[#EEEEED]"
                  href={dev.linkedin}
                  ref={linkedinRef}
                  rel="noreferrer"
                  target="_blank"
                >
                  [ LINKEDIN ]
                </a>
              )}
            </motion.div>
          )}
        </PanelShell>
      </div>

      {/* Close control — always reachable regardless of panel layout */}
      <button
        aria-label="Close details"
        className="pointer-events-auto fixed top-4 right-4 z-50 flex size-9 items-center justify-center rounded-md text-[#EEEEED]/50 transition-colors duration-200 hover:text-[#EEEEED] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#EEEEED]/60 sm:top-6 sm:right-6"
        onClick={onClose}
        type="button"
      >
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            d="M6 18L18 6M6 6l12 12"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
          />
        </svg>
      </button>
    </motion.div>
  );
}
