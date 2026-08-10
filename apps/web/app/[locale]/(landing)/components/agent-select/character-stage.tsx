"use client";

import { cn } from "@workspace/ui/lib/utils";
import { motion, useReducedMotion } from "motion/react";
import { useCallback, useRef } from "react";
import type { Dev } from "../dev-cards";

interface CharacterStageProps {
  activeDev: Dev;
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
}: CharacterStageProps) {
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
              scale: isActive ? 1.15 : 0.65,
              x: isPrev ? "-115%" : slot.role === "next" ? "115%" : "0%",
              zIndex: isActive ? 20 : 10,
            }}
            className="absolute left-1/2 h-full w-[200px] -translate-x-1/2 sm:w-[240px]"
            initial={{
              opacity: 0,
              scale: 0.8,
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
                <div
                  className="h-full w-full"
                  onMouseLeave={isActive ? handleMouseLeave : undefined}
                  onMouseMove={isActive ? handleMouseMove : undefined}
                  ref={isActive ? parallaxRef : undefined}
                  style={{ willChange: "transform" }}
                >
                  {slot.dev.photoUrl ? (
                    <img
                      alt={slot.dev.name}
                      className={cn(
                        "h-full w-full select-none object-contain transition-transform duration-300 group-hover:scale-[1.03]",
                        slot.dev.name.includes("Meghraj") && "scale-[0.82]"
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
              </motion.div>
            </button>
          </motion.div>
        );
      })}

      {/* Modern Flat Black Stage Base */}
      <div
        className="pointer-events-none absolute -bottom-16 left-1/2 w-full max-w-[300px] -translate-x-1/2"
        style={{ perspective: "800px" }}
      >
        <div
          className="relative mx-auto flex h-[280px] w-[280px] items-center justify-center"
          style={{ transform: "rotateX(75deg)" }}
        >
          {/* Flat Solid Black Circle Stage */}
          <div className="absolute inset-0 rounded-full border border-[#3A3A3A]/20 bg-black/90 shadow-[0_15px_35px_rgba(0,0,0,0.9),inset_0_0_20px_rgba(255,255,255,0.02)]" />

          {/* Concentric Black/Dark Ring detailing */}
          <svg
            className="absolute inset-0 h-full w-full overflow-visible text-[#3A3A3A]"
            viewBox="0 0 200 200"
          >
            {/* Solid Ring */}
            <circle
              className="opacity-40"
              cx="100"
              cy="100"
              fill="none"
              r="75"
              stroke="currentColor"
              strokeWidth="2"
            />
            {/* Dashed Ring */}
            <circle
              className="opacity-30"
              cx="100"
              cy="100"
              fill="none"
              r="62"
              stroke="currentColor"
              strokeDasharray="6 4"
              strokeWidth="1"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
