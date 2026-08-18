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
        "group relative flex size-11 items-center justify-center rounded-xl border border-[#3A3A3A] bg-zinc-950/80 shadow-lg backdrop-blur-xl transition-all duration-200 hover:border-[#EEEEED]/40 hover:bg-[#EEEEED]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EEEEED]/50 active:scale-95"
      )}
      onClick={onClick}
      type="button"
    >
      <span
        aria-hidden={true}
        className={cn(
          "font-mono text-lg text-[#EEEEED]/50 transition-[color,transform] duration-200 group-hover:text-[#EEEEED]",
          isPrev
            ? "group-hover:-translate-x-0.5"
            : "group-hover:translate-x-0.5"
        )}
      >
        {isPrev ? "‹" : "›"}
      </span>
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
