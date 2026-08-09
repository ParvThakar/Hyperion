"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCallback, useRef } from "react";
import type { Dev } from "../dev-cards";

interface CharacterStageProps {
  dev: Dev;
  direction: number;
}

export function CharacterStage({ dev, direction }: CharacterStageProps) {
  const reducedMotion = useReducedMotion();
  const parallaxRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (reducedMotion || !parallaxRef.current) {
        return;
      }

      const rect = e.currentTarget.getBoundingClientRect();
      const offsetX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const offsetY = ((e.clientY - rect.top) / rect.height) * 2 - 1;

      parallaxRef.current.style.transform = `translate3d(${offsetX * 12}px, ${offsetY * 6}px, 0)`;
    },
    [reducedMotion]
  );

  const handleMouseLeave = useCallback(() => {
    if (!parallaxRef.current) {
      return;
    }
    parallaxRef.current.style.transition = "transform 0.5s ease-out";
    parallaxRef.current.style.transform = "translate3d(0, 0, 0)";
    const ref = parallaxRef.current;
    setTimeout(() => {
      ref.style.transition = "";
    }, 500);
  }, []);

  return (
    <div
      className="relative flex w-full items-center justify-center"
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      <div className="relative z-10 flex h-[50vh] max-h-[500px] w-full items-center justify-center drop-shadow-[0_0_40px_rgba(255,255,255,0.08)] sm:h-[58vh] sm:max-h-[600px] lg:h-[68vh] lg:max-h-[720px]">
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            animate={{
              filter: "blur(0px)",
              opacity: 1,
              scale: 1,
              x: 0,
              y: 0,
              transition: {
                filter: { duration: 0.5 },
                opacity: { duration: 0.4 },
                scale: {
                  damping: 25,
                  mass: 0.8,
                  stiffness: 200,
                  type: "spring",
                },
                x: {
                  damping: 25,
                  mass: 0.8,
                  stiffness: 200,
                  type: "spring",
                },
                y: {
                  damping: 25,
                  mass: 0.8,
                  stiffness: 200,
                  type: "spring",
                },
              },
            }}
            className="absolute inset-0 flex items-center justify-center"
            custom={direction}
            exit={{
              filter: "blur(8px)",
              opacity: 0,
              scale: 0.92,
              x: direction > 0 ? -80 : direction < 0 ? 80 : 0,
              transition: { duration: 0.25, ease: [0.4, 0, 1, 1] },
            }}
            initial={{
              filter: direction === 0 ? "blur(6px)" : "blur(12px)",
              opacity: 0,
              scale: direction === 0 ? 0.95 : 0.88,
              x: direction > 0 ? 100 : direction < 0 ? -100 : 0,
              y: direction === 0 ? 30 : 0,
            }}
            key={dev.name}
          >
            <motion.div
              animate={reducedMotion ? undefined : { y: [0, -6, 0] }}
              className="h-full w-full"
              transition={
                reducedMotion
                  ? undefined
                  : {
                      duration: 4,
                      ease: "easeInOut",
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "loop",
                    }
              }
            >
              <div
                className="h-full w-full"
                ref={parallaxRef}
                style={{ willChange: "transform" }}
              >
                {dev.photoUrl ? (
                  <img
                    alt={dev.name}
                    className="h-full w-full select-none object-contain"
                    draggable={false}
                    src={dev.photoUrl}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <div className="flex size-40 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] font-display text-6xl text-white/30">
                      {dev.initials}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Floor shadow */}
      <div className="absolute -bottom-4 left-1/2 h-8 w-3/5 -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.08)_0%,transparent_70%)] blur-xl" />
    </div>
  );
}
