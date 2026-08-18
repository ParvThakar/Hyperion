"use client";

import { cn } from "@workspace/ui/lib/utils";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { Dev } from "../dev-cards";

interface CharacterStageProps {
  activeDev: Dev;
  isDetailsOpen?: boolean;
  nextDev: Dev;
  onNext: () => void;
  onOpenDetails: () => void;
  onPrev: () => void;
  prevDev: Dev;
}

export function CharacterStage({
  activeDev,
  prevDev,
  nextDev,
  onPrev,
  onNext,
  onOpenDetails,
  isDetailsOpen,
}: CharacterStageProps) {
  const reducedMotion = useReducedMotion();

  const slots = [
    { dev: prevDev, role: "prev" as const, onClick: onPrev },
    { dev: activeDev, role: "active" as const, onClick: onOpenDetails },
    { dev: nextDev, role: "next" as const, onClick: onNext },
  ];

  return (
    <div className="relative flex h-[50vh] max-h-[500px] w-full max-w-4xl items-center justify-center sm:h-[58vh] sm:max-h-[600px] lg:h-[68vh] lg:max-h-[720px]">
      {slots.map((slot) => {
        const isActive = slot.role === "active";
        const isPrev = slot.role === "prev";

        return (
          <motion.div
            animate={{
              opacity: isActive ? 1.0 : 0.25,
              scale: isActive ? 1.25 : 0.75,
              y: isActive && isDetailsOpen ? -16 : 0,
              x: isPrev ? "-115%" : slot.role === "next" ? "115%" : "0%",
              zIndex: isActive ? 50 : 10,
              /* Side figures gain a subtle blur — matches their reduced
                 opacity so they read as clearly "in the wings" vs centre. */
              filter: isActive
                ? "blur(0px)"
                : reducedMotion
                  ? "blur(0px)"
                  : "blur(4px)",
            }}
            className="absolute left-1/2 h-full w-[240px] -translate-x-1/2 sm:w-[280px]"
            initial={{
              opacity: 0,
              scale: 0.8,
              filter: "blur(0px)",
            }}
            key={slot.dev.name}
            layoutId={`stage-slot-${slot.dev.name}`}
            transition={{
              damping: 26,
              mass: 0.9,
              stiffness: 220,
              type: "spring",
            }}
          >
            <button
              className="group relative flex h-full w-full cursor-pointer flex-col items-center justify-center bg-transparent border-0 p-0 text-inherit focus:outline-none"
              onClick={slot.onClick}
              type="button"
            >
              {/* Interactive Parallax Wrapper for Active Figure */}
              <motion.div
                animate={
                  reducedMotion || !isActive ? undefined : { y: [0, -6, 0] }
                }
                className="h-full w-full"
                transition={
                  reducedMotion || !isActive
                    ? undefined
                    : {
                        duration: 4,
                        ease: "easeInOut",
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "loop",
                      }
                }
              >
                <div className="relative h-full w-full">
                  <div className="h-full w-full transition-transform duration-300 group-hover:scale-[1.03]">
                    {slot.dev.photoUrl ? (
                      <img
                        alt={slot.dev.name}
                        className={cn(
                          "h-full w-full select-none object-contain",
                          slot.dev.name.includes("Meghraj") && "scale-[0.80]"
                        )}
                        draggable={false}
                        src={slot.dev.photoUrl}
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <div className="flex size-32 items-center justify-center rounded-full border border-[#3A3A3A] bg-white/[0.02] font-display text-5xl text-white/30 transition-all duration-300 group-hover:border-white/20 group-hover:bg-white/[0.04] sm:size-40 sm:text-6xl">
                          {slot.dev.initials}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Float Shadow */}
                  <AnimatePresence>
                    {isActive && isDetailsOpen && (
                      <motion.div
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="pointer-events-none absolute -bottom-6 left-1/2 h-8 w-4/5 -translate-x-1/2 rounded-[100%] bg-black/80 blur-xl"
                        exit={{ opacity: 0, scale: 0.5, y: -10 }}
                        initial={{ opacity: 0, scale: 0.5, y: -10 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                      />
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </button>
          </motion.div>
        );
      })}
    </div>
  );
}
