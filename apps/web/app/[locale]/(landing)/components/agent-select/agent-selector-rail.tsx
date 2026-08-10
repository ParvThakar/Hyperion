"use client";

import { cn } from "@workspace/ui/lib/utils";
import { motion } from "motion/react";
import type { Dev } from "../dev-cards";

interface AgentSelectorRailProps {
  activeIndex: number;
  devs: Dev[];
  onSelect: (index: number) => void;
}

export function AgentSelectorRail({
  activeIndex,
  devs,
  onSelect,
}: AgentSelectorRailProps) {
  return (
    <div
      aria-label="Agent selector"
      className="mx-auto flex max-w-md items-center justify-between px-4"
      role="tablist"
    >
      {devs.map((dev, index) => {
        const isActive = activeIndex === index;
        const numberStr = (index + 1).toString().padStart(2, "0");
        const isNotLast = index < devs.length - 1;

        return (
          <div className="flex flex-1 items-center" key={dev.name}>
            <button
              aria-label={dev.name}
              aria-selected={isActive}
              className={cn(
                "relative flex flex-col items-center justify-center transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:ring-offset-black",
                isActive
                  ? "text-[#EEEEED]"
                  : "text-[#EEEEED]/25 hover:text-[#EEEEED]/50"
              )}
              onClick={() => onSelect(index)}
              role="tab"
              type="button"
            >
              {isActive && (
                <motion.div
                  className="absolute -top-3 h-1 w-1 rounded-full bg-[#EEEEED] shadow-[0_0_12px_rgba(238,238,237,0.6)]"
                  layoutId="active-agent-dot"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <span className="font-mono text-base">{numberStr}</span>
            </button>

            {isNotLast && (
              <span className="mx-2 h-px flex-1 bg-[#3A3A3A] lg:mx-4" />
            )}
          </div>
        );
      })}
    </div>
  );
}
