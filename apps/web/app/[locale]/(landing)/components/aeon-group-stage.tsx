"use client";

import { cn } from "@workspace/ui/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import type { Dev } from "./dev-cards";

interface AeonGroupStageProps {
  activeIndex: number;
  devs: Dev[];
  onSelect: (index: number) => void;
}

/**
 * Premium AEON Studio Group Stage:
 * Renders unified studio group portrait photo (/team/group.jpg) with an interactive
 * ultra-readable telemetry HUD panel and team quick-switcher dock.
 */
export function AeonGroupStage({
  activeIndex,
  devs,
  onSelect,
}: AeonGroupStageProps) {
  // Verified developer face & position mappings on group.jpg
  const hotspots = [
    // ── BACK ROW (z-10) ──
    {
      devIndex: 0, // Bhagirathsinh Rana (Sunglasses, Back Left)
      label: "Bhagirathsinh Rana",
      style: { left: "6%", top: "12%", width: "26%", height: "55%" },
      zIndex: "z-10",
    },
    {
      devIndex: 2, // Parv Thakar (Navy suit, smiling, Back Center)
      label: "Parv Thakar",
      style: { left: "40%", top: "8%", width: "20%", height: "52%" },
      zIndex: "z-10",
    },
    {
      devIndex: 4, // Meghraj Ravani (Black shiny jacket, Back Right)
      label: "Meghraj Ravani",
      style: { left: "68%", top: "12%", width: "26%", height: "55%" },
      zIndex: "z-10",
    },

    // ── FRONT ROW (z-20 - higher priority) ──
    {
      devIndex: 3, // Karm Sorathiya (Black suit, pocket square, Front Left)
      label: "Karm Sorathiya",
      style: { left: "24%", top: "42%", width: "26%", height: "58%" },
      zIndex: "z-20",
    },
    {
      devIndex: 1, // Malay Raval (Black suit, round glasses, Front Right)
      label: "Malay Raval",
      style: { left: "50%", top: "42%", width: "26%", height: "58%" },
      zIndex: "z-20",
    },
  ];

  const activeDev = devs[activeIndex];

  return (
    <div className="relative flex w-full flex-col items-center justify-center">
      {/* ── Group Photo Card Container ── */}
      <div className="relative z-10 w-full overflow-hidden rounded-2xl sm:rounded-3xl border border-white/15 bg-zinc-950/80 shadow-[0_0_60px_rgba(0,0,0,0.9),0_0_30px_rgba(255,255,255,0.03)] backdrop-blur-2xl">
        {/* Top Sci-Fi Laser Scan Beam */}
        <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-400/80 to-transparent z-20" />

        <div className="relative w-full overflow-hidden rounded-xl sm:rounded-2xl">
          {/* Unified Studio Group Portrait Photo */}
          <img
            alt="Hyperion Founding Engineering Team"
            className="w-full h-auto object-cover object-center drop-shadow-2xl select-none"
            draggable={false}
            src="/team/group.jpg"
          />

          {/* Clean Vignette Edge Fade */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_50%,rgba(0,0,0,0.5)_100%)]" />

          {/* ── Interactive Developer Hitbox Regions ── */}
          {hotspots.map((spot) => (
            <div
              className={cn(
                "absolute cursor-pointer transition-all duration-300",
                spot.zIndex
              )}
              key={spot.label}
              onClick={() => onSelect(spot.devIndex)}
              onMouseEnter={() => onSelect(spot.devIndex)}
              style={spot.style}
            />
          ))}
        </div>
      </div>

      {/* ── Interactive Team Switcher Dock ── */}
      <div className="relative z-30 mt-6 flex flex-wrap justify-center gap-2 sm:gap-3 rounded-full border border-white/15 bg-zinc-950/90 p-1.5 shadow-2xl backdrop-blur-xl">
        {devs.map((dev, i) => {
          const isSelected = i === activeIndex;

          return (
            <button
              className={cn(
                "group relative flex items-center gap-2 rounded-full px-3.5 py-1.5 font-mono text-xs tracking-wider transition-all duration-300",
                isSelected
                  ? "border border-emerald-400/60 bg-emerald-500/15 text-white shadow-[0_0_15px_rgba(52,211,153,0.3)]"
                  : "border border-transparent text-white/50 hover:border-white/20 hover:text-white/90"
              )}
              key={dev.name}
              onClick={() => onSelect(i)}
              type="button"
            >
              <span
                className={cn(
                  "size-2 rounded-full transition-all duration-300",
                  isSelected
                    ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]"
                    : "bg-white/20 group-hover:bg-white/50"
                )}
              />
              <span className="font-semibold">{dev.initials}</span>
              <span className="hidden sm:inline text-[0.65rem] text-white/40 group-hover:text-white/70">
                {dev.name.split(" ")[0]}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Active Developer Telemetry HUD Panel (High Contrast & Readable) ── */}
      {activeDev && (
        <AnimatePresence mode="wait">
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="relative z-20 mt-4 flex w-full max-w-3xl flex-col items-center gap-3 rounded-2xl border border-white/20 bg-zinc-950/95 p-6 text-center shadow-[0_10px_40px_rgba(0,0,0,0.8),0_0_20px_rgba(52,211,153,0.1)] backdrop-blur-2xl"
            exit={{ opacity: 0, y: 10 }}
            initial={{ opacity: 0, y: 10 }}
            key={activeDev.name}
            transition={{ duration: 0.25 }}
          >
            {/* Top Role Badge */}
            <div className="rounded-full border border-emerald-400/50 bg-emerald-500/10 px-3.5 py-1 font-mono text-[0.65rem] tracking-[0.25em] text-emerald-300 uppercase shadow-[0_0_10px_rgba(52,211,153,0.2)]">
              [ {activeDev.role} ]
            </div>

            {/* High-Contrast Bold Name */}
            <h3 className="font-display text-2xl font-bold text-white tracking-tight sm:text-3xl md:text-4xl drop-shadow-[0_2px_10px_rgba(255,255,255,0.2)]">
              {activeDev.name}
            </h3>

            {/* Bio & Contribution */}
            <p className="font-sans text-xs text-zinc-300 sm:text-sm max-w-xl leading-relaxed">
              {activeDev.bio}
            </p>

            {/* Skills Pills */}
            {activeDev.skills && activeDev.skills.length > 0 && (
              <div className="mt-1 flex flex-wrap justify-center gap-1.5">
                {activeDev.skills.map((skill) => (
                  <span
                    className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 font-mono text-[0.6rem] text-zinc-300"
                    key={skill}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}

            {/* High Visibility Social Action Buttons */}
            <div className="mt-2 flex gap-4">
              {activeDev.github && (
                <a
                  className="rounded-lg border border-white/15 bg-white/5 px-3.5 py-1.5 font-mono text-[0.65rem] text-white tracking-[0.15em] hover:border-emerald-400/60 hover:bg-emerald-500/10 hover:text-emerald-300 transition-all duration-300"
                  href={activeDev.github}
                  rel="noreferrer"
                  target="_blank"
                >
                  [ GITHUB ]
                </a>
              )}
              {activeDev.linkedin && (
                <a
                  className="rounded-lg border border-white/15 bg-white/5 px-3.5 py-1.5 font-mono text-[0.65rem] text-white tracking-[0.15em] hover:border-emerald-400/60 hover:bg-emerald-500/10 hover:text-emerald-300 transition-all duration-300"
                  href={activeDev.linkedin}
                  rel="noreferrer"
                  target="_blank"
                >
                  [ LINKEDIN ]
                </a>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
