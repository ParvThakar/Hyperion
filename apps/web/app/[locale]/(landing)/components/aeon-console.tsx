"use client";

import { useDecryption } from "@workspace/core/hooks/use-decryption";
import { cn } from "@workspace/ui/lib/utils";
import { motion } from "motion/react";
import type { Dev } from "./dev-cards";

export function AeonConsole({
  activeIndex,
  devs,
  onSelect,
}: {
  activeIndex: number;
  devs: Dev[];
  onSelect: (index: number) => void;
}) {
  const activeDev = devs[activeIndex];
  if (!activeDev) {
    return null;
  }

  return (
    <div className="relative z-30 flex w-full flex-col items-center gap-6 px-4 pb-12 sm:pb-16">
      {/* ── Active Info Block (Decrypted) ── */}
      <div className="flex flex-col items-center gap-2 text-center">
        <span className="font-mono text-[0.55rem] tracking-[0.4em] text-white/20 uppercase">
          [ AGENT INITIALIZED ]
        </span>
        <h2 className="font-display text-2xl text-white tracking-tight sm:text-3xl">
          <DecryptedText text={activeDev.name} trigger={activeIndex} />
        </h2>
        <span className="font-mono text-[0.6rem] tracking-[0.2em] text-white/40 uppercase">
          <DecryptedText text={activeDev.role} trigger={activeIndex} />
        </span>

        {/* Socials / Actions */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 flex gap-4"
          initial={{ opacity: 0, y: 10 }}
          key={`socials-${activeIndex}`}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          {activeDev.github && (
            <a
              className="font-mono text-[0.55rem] text-white/30 tracking-[0.1em] hover:text-white/70 transition-colors"
              href={activeDev.github}
              rel="noreferrer"
              target="_blank"
            >
              [ GITHUB ]
            </a>
          )}
          {activeDev.linkedin && (
            <a
              className="font-mono text-[0.55rem] text-white/30 tracking-[0.1em] hover:text-white/70 transition-colors"
              href={activeDev.linkedin}
              rel="noreferrer"
              target="_blank"
            >
              [ LINKEDIN ]
            </a>
          )}
        </motion.div>
      </div>

      {/* ── Execution Queue (Selector) ── */}
      <div className="mt-8 flex w-full max-w-3xl flex-wrap justify-center gap-2 sm:gap-4">
        {devs.map((dev, i) => {
          const isSelected = i === activeIndex;
          const isBackRow = i === 0 || i === 2;
          const agentId = `${dev.initials}-${String(i + 1).padStart(2, "0")}`;
          const rowTag = isBackRow ? "ROW 2" : "ROW 1";

          return (
            <button
              className={cn(
                "group relative flex flex-col items-center justify-center gap-1.5 overflow-hidden rounded-md border px-4 py-2.5 transition-all duration-300 sm:px-5 sm:py-3.5",
                isSelected
                  ? "border-white/20 bg-white/[0.03] shadow-[0_0_20px_rgba(255,255,255,0.05)]"
                  : "border-white/[0.05] bg-transparent hover:border-white/15 hover:bg-white/[0.02]"
              )}
              key={dev.name}
              onClick={() => onSelect(i)}
              type="button"
            >
              {/* Animated scanline on hover for unselected */}
              {!isSelected && (
                <div className="absolute inset-x-0 top-0 h-px -translate-y-full bg-white/20 transition-transform duration-700 group-hover:translate-y-[50px]" />
              )}

              <span
                className={cn(
                  "font-mono text-[0.45rem] tracking-[0.25em] transition-colors duration-300 sm:text-[0.5rem] uppercase",
                  isSelected
                    ? "text-emerald-400"
                    : "text-white/20 group-hover:text-white/40"
                )}
              >
                {isSelected ? "ACTIVE" : rowTag}
              </span>

              <span
                className={cn(
                  "font-mono text-[0.65rem] tracking-[0.15em] transition-colors duration-300 sm:text-xs",
                  isSelected
                    ? "text-white"
                    : "text-white/40 group-hover:text-white/70"
                )}
              >
                [ {agentId} ]
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function DecryptedText({ text, trigger }: { text: string; trigger: unknown }) {
  const result = useDecryption(text, trigger, 700);
  return <>{result}</>;
}
