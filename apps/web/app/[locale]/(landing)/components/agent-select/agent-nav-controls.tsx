"use client";

import { useScrambleText } from "@workspace/core/hooks/use-scramble-text";
import { cn } from "@workspace/ui/lib/utils";

interface SingleNavButtonProps {
  direction: "next" | "prev";
  label: string;
  onClick: () => void;
}

/**
 * The label text scrambles briefly whenever `label` changes (i.e. whenever
 * the active carousel slot changes and a new name appears in the wing slot).
 * Reduced intensity vs the modal: shorter duration (~300ms) via fewer cycles.
 */
function ScrambledLabel({ label }: { label: string }) {
  const scrambled = useScrambleText(label, label, {
    stagger: 20,
    speed: 45,
    cycles: 3,
  });
  return <>{scrambled}</>;
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
        "group relative flex items-center gap-3 rounded-xl border border-[#3A3A3A] bg-zinc-950/80 px-4 py-2.5 shadow-lg backdrop-blur-xl transition-all duration-200 hover:border-[#EEEEED]/40 hover:bg-[#EEEEED]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EEEEED]/50 active:scale-95",
        isPrev ? "text-left" : "text-right"
      )}
      onClick={onClick}
      type="button"
    >
      {isPrev && (
        <span className="font-mono text-lg text-[#EEEEED]/50 transition-transform duration-200 group-hover:-translate-x-1 group-hover:text-[#EEEEED]">
          ‹
        </span>
      )}

      <div className="flex flex-col">
        <span className="font-mono text-xs font-semibold tracking-wider text-white/90 group-hover:text-white">
          <ScrambledLabel label={label} />
        </span>
      </div>

      {!isPrev && (
        <span className="font-mono text-lg text-[#EEEEED]/50 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-[#EEEEED]">
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
