import { cn } from "@workspace/ui/lib/utils";
import { motion, useReducedMotion } from "motion/react";
import { useCallback, useRef } from "react";
import type { Dev } from "../dev-cards";
import { AgentInfoPanel } from "./agent-info-panel";

interface CharacterStageProps {
  activeDev: Dev;
  isDetailsOpen?: boolean;
  nextDev: Dev;
  onNext: () => void;
  onOpenDetails: () => void;
  onPrev: () => void;
  prevDev: Dev;
  index: number;
}

export function CharacterStage({
  activeDev,
  prevDev,
  nextDev,
  onPrev,
  onNext,
  onOpenDetails,
  isDetailsOpen = false,
  index,
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
    <div className="relative flex h-[56vh] max-h-[560px] w-full max-w-5xl items-center justify-center sm:h-[64vh] sm:max-h-[660px] lg:h-[75vh] lg:max-h-[780px]">
      {slots.map((slot) => {
        const isActive = slot.role === "active";
        const isPrev = slot.role === "prev";

        /* Activation state — when the details HUD is open, the active
           figure gets a small extra "locked on" boost (scale, lift,
           sharpness) while the wing figures recede further, reinforcing
           that focus has pulled onto this one developer. */
        const activated = isActive && isDetailsOpen;

        return (
          <motion.div
            animate={{ filter: isActive
              ? activated && !reducedMotion
                ? "brightness(1.06) saturate(1.04) blur(0px)"
                : "blur(0px)"
              : reducedMotion
                ? "blur(0px)"
                : isDetailsOpen
                  ? "blur(5px)"
                  : "blur(3px)",
            opacity: isActive ? 1.0 : isDetailsOpen ? 0.12 : 0.25,
            scale: isActive
              ? activated
                ? 1.34
                : 1.28
              : isDetailsOpen
                ? 0.6
                : 0.72,
            x: isPrev ? "-110%" : slot.role === "next" ? "110%" : "0%",
            y: activated && !reducedMotion ? -6 : 0,
            zIndex: isActive ? 20 : 10,
          }}
          className="absolute left-1/2 h-full w-[240px] -translate-x-1/2 sm:w-[280px]"
          initial={{ opacity: 0, scale: 0.8, filter: "blur(0px)" }}
          key={slot.dev.name}
          layoutId={`stage-slot-${slot.dev.name}`}
          transition={{ damping: 26, mass: 0.9, stiffness: 220, type: "spring" }}
        >
          {/* Ambient lock-on glow — only behind the activated figure */}
          {activated && (
            <motion.div
              animate={{ opacity: 1 }}
              aria-hidden={true}
              className="pointer-events-none absolute inset-0 -z-10"
              initial={{ opacity: 0 }}
              transition={{ delay: 0.1, duration: 0.5, ease: "easeOut" }}
            >
              <div className="absolute left-1/2 top-1/2 h-[140%] w-[140%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white opacity-[0.05] blur-[60px]" />
            </motion.div>
          )}
          <button
            className="group relative flex h-full w-full cursor-pointer flex-col items-center justify-center bg-transparent border-0 p-0 text-inherit focus:outline-none"
            onClick={slot.onClick}
            type="button"
          >
            {/* Interactive Parallax Wrapper for Active Figure */}
            <motion.div
              animate={reducedMotion || !isActive ? undefined : { y: [0, -6, 0] }}
              className="h-full w-full"
              transition={reducedMotion || !isActive ? undefined : {
                duration: 4,
                ease: "easeInOut",
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop",
              }}
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
                      "h-full w-full select-none object-contain transition-transform duration-300",
                      slot.dev.name.includes("Meghraj")
                        ? "scale-[0.70]"
                        : "group-hover:scale-[1.03]"
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
      {/* Info Panel for Active Dev */}
      {isDetailsOpen && (
        <motion.div
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="absolute -bottom-16 left-1/2 -translate-x-1/2 z-30 pointer-events-auto"
          exit={{ opacity: 0, scale: 0.9, y: 12, transition: { duration: 0.2, ease: "easeIn" } }}
          initial={{ opacity: 0, scale: 0.9, y: 12 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
        >
          <AgentInfoPanel
            agentId={`${activeDev.initials}-${String(index + 1).padStart(2, "0")}`}
            dev={activeDev}
            index={index}
          />
        </motion.div>
      )}
    </div>
  );
}
