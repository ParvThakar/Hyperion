"use client";

import { cn } from "@workspace/ui/lib/utils";

interface SingleNavButtonProps {
  direction: "next" | "prev";
  label: string;
  onClick: () => void;
}

export function SingleNavButton({
  direction,
  label,
  onClick,
}: SingleNavButtonProps) {
  const isPrev = direction === "prev";

  return (
    <button
      aria-label={isPrev ? `Previous agent: ${label}` : `Next agent: ${label}`}
      className={cn(
        "group relative flex items-center gap-3 rounded-xl border border-white/15 bg-zinc-950/80 px-4 py-2.5 shadow-lg backdrop-blur-xl transition-all duration-200 hover:border-white/40 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50 active:scale-95",
        isPrev ? "text-left" : "text-right"
      )}
      onClick={onClick}
      type="button"
    >
      {isPrev && (
        <span className="font-mono text-lg text-white/50 transition-transform duration-200 group-hover:-translate-x-1 group-hover:text-white">
          ‹
        </span>
      )}

      <div className="flex flex-col">
        <span className="font-mono text-xs font-semibold tracking-wider text-white/90 group-hover:text-white">
          {label}
        </span>
      </div>

      {!isPrev && (
        <span className="font-mono text-lg text-white/50 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-white">
          ›
        </span>
      )}
    </button>
  );
}

interface AgentNavControlsProps {
  nextLabel: string;
  onNext: () => void;
  onPrev: () => void;
  prevLabel: string;
}

/** Mobile / Tablet separate navigation bar */
export function MobileNavControls({
  nextLabel,
  onNext,
  onPrev,
  prevLabel,
}: AgentNavControlsProps) {
  return (
    <div className="flex w-full items-center justify-between gap-4 px-2">
      <SingleNavButton direction="prev" label={prevLabel} onClick={onPrev} />
      <SingleNavButton direction="next" label={nextLabel} onClick={onNext} />
    </div>
  );
}
