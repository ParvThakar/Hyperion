"use client";

import { cn } from "@workspace/ui/lib/utils";
import { motion, useReducedMotion } from "motion/react";
import { useId } from "react";

interface AgentEnvironmentProps {
  activeIndex: number;
  /** True while the details HUD is open — brightens and enlarges the
   *  spotlight slightly so the atmosphere itself reads as "focused" on
   *  the activated developer, without introducing any new color. */
  boosted?: boolean;
}

export function AgentEnvironment({
  activeIndex,
  boosted = false,
}: AgentEnvironmentProps) {
  const prefersReducedMotion = useReducedMotion();
  const baseId = useId();

  const spotlightOffset = (activeIndex - 2) * 40;

  // 16 deterministic particles
  const particles = Array.from({ length: 16 }).map((_, i) => {
    // Deterministic pseudo-random values based on index
    const seed1 = (i * 17) % 100;
    const seed2 = (i * 23) % 100;
    const seed3 = (i * 31) % 100;

    const left = `${seed1}%`;
    const top = `${seed2}%`;
    const size = i % 3 === 0 ? "size-1" : "size-0.5";
    const driftX = (seed3 - 50) * 1.5; // -75 to 75
    const driftDur = 10 + (seed1 % 10); // 10s to 19s
    const driftDelay = (seed2 % 20) * -1; // -19s to 0s

    return {
      id: `particle-${baseId}-${i}`,
      left,
      top,
      size,
      driftX,
      driftDur,
      driftDelay,
    };
  });

  return (
    <div
      aria-hidden={true}
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden bg-black"
    >
      {/* Dot Grid */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Spotlight */}
      <motion.div
        animate={{ x: prefersReducedMotion ? 0 : spotlightOffset }}
        className="absolute inset-0 flex items-center justify-center"
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.div
          animate={{
            opacity: boosted ? 0.065 : 0.04,
            scale: boosted ? 1.12 : 1,
          }}
          className="h-[600px] w-[600px] rounded-full bg-white blur-[100px]"
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </motion.div>

      {/* Atmospheric Fog Layers */}
      <motion.div
        animate={
          prefersReducedMotion
            ? undefined
            : {
                x: ["-5%", "5%", "-5%"],
                y: ["-5%", "5%", "-5%"],
              }
        }
        className="absolute -left-1/4 -top-1/4 h-[150%] w-[150%] rounded-full bg-white opacity-[0.02] blur-[120px]"
        transition={
          prefersReducedMotion
            ? undefined
            : {
                duration: 20,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "mirror",
                ease: "linear",
              }
        }
      />
      <motion.div
        animate={
          prefersReducedMotion
            ? undefined
            : {
                x: ["5%", "-5%", "5%"],
                y: ["5%", "-5%", "5%"],
              }
        }
        className="absolute -bottom-1/4 -right-1/4 h-[150%] w-[150%] rounded-full bg-white opacity-[0.03] blur-[120px]"
        transition={
          prefersReducedMotion
            ? undefined
            : {
                duration: 25,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "mirror",
                ease: "linear",
              }
        }
      />

      {/* Particles */}
      <div className="absolute inset-0">
        {particles.map((p) => (
          <motion.span
            animate={
              prefersReducedMotion
                ? undefined
                : {
                    x: [0, p.driftX, 0],
                    opacity: [0.2, 0.5, 0.2],
                  }
            }
            className={cn("absolute rounded-full bg-white/20", p.size)}
            initial={{ opacity: 0.2, x: 0 }}
            key={p.id}
            style={{ left: p.left, top: p.top }}
            transition={
              prefersReducedMotion
                ? undefined
                : {
                    duration: p.driftDur,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "mirror",
                    ease: "easeInOut",
                    delay: p.driftDelay,
                  }
            }
          />
        ))}
      </div>

      {/* Floor reflection gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t from-black to-transparent" />
    </div>
  );
}
