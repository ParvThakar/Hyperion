"use client";

import { useDecryption } from "@workspace/core/hooks/use-decryption";
import { cn } from "@workspace/ui/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import type { Dev } from "./dev-cards";

/* ── HUD Data Definitions ──────────────────────────────────── */

interface HudEntry {
  label: string;
  value: string;
}

const AEON_DATA: Record<string, { left: HudEntry[]; right: HudEntry[] }> = {
  Bhagirathsinh: {
    left: [
      { label: "SYNC", value: "99.8%" },
      { label: "LATENCY", value: "2ms" },
      { label: "CORE", value: "CONTAINER" },
    ],
    right: [
      { label: "MEMORY", value: "14.2 GB" },
      { label: "UPTIME", value: "481h" },
      { label: "STATUS", value: "ONLINE" },
    ],
  },
  Malay: {
    left: [
      { label: "SYNC", value: "99.9%" },
      { label: "LATENCY", value: "1ms" },
      { label: "CORE", value: "SOCKETS" },
    ],
    right: [
      { label: "MEMORY", value: "12.8 GB" },
      { label: "UPTIME", value: "432h" },
      { label: "STATUS", value: "ONLINE" },
    ],
  },
  Parv: {
    left: [
      { label: "SYNC", value: "99.4%" },
      { label: "LATENCY", value: "5ms" },
      { label: "CORE", value: "DESIGN" },
    ],
    right: [
      { label: "MEMORY", value: "18.4 GB" },
      { label: "UPTIME", value: "512h" },
      { label: "STATUS", value: "ONLINE" },
    ],
  },
  Karm: {
    left: [
      { label: "SYNC", value: "99.7%" },
      { label: "LATENCY", value: "3ms" },
      { label: "CORE", value: "ARCHITECT" },
    ],
    right: [
      { label: "MEMORY", value: "16.1 GB" },
      { label: "UPTIME", value: "490h" },
      { label: "STATUS", value: "ONLINE" },
    ],
  },
  Meghraj: {
    left: [
      { label: "SYNC", value: "99.9%" },
      { label: "LATENCY", value: "4ms" },
      { label: "CORE", value: "RENDER" },
    ],
    right: [
      { label: "MEMORY", value: "24.6 GB" },
      { label: "UPTIME", value: "504h" },
      { label: "STATUS", value: "ONLINE" },
    ],
  },
};

/* ── DecryptingText Component ──────────────────────────────── */

function DecryptingText({
  className,
  text,
  trigger,
}: {
  className?: string;
  text: string;
  trigger: unknown;
}) {
  const decrypted = useDecryption(text, trigger, 600);
  return <span className={className}>{decrypted}</span>;
}

/* ── AeonHUD ───────────────────────────────────────────────── */

export function AeonHUD({ dev, isActive }: { dev: Dev; isActive: boolean }) {
  const firstName = dev.name.split(" ")[0] ?? "";
  const data = AEON_DATA[firstName] ?? AEON_DATA.Bhagirathsinh;

  // Guard for safety
  if (!data) {
    return null;
  }

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          animate={{ opacity: 1, filter: "blur(0px)" }}
          className="pointer-events-none absolute inset-x-[5%] top-1/2 flex -translate-y-1/2 items-center justify-between xl:inset-x-[15%]"
          exit={{
            opacity: 0,
            filter: "blur(10px)",
            transition: { duration: 0.2 },
          }}
          initial={{ opacity: 0, filter: "blur(10px)" }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {/* Left Column */}
          <div className="hidden flex-col gap-12 lg:flex">
            {data.left.map((item) => (
              <div className="flex flex-col gap-1" key={item.label}>
                <span className="font-mono text-[0.55rem] tracking-[0.4em] text-white/20 uppercase">
                  {item.label}
                </span>
                <DecryptingText
                  className="font-mono text-sm tracking-[0.2em] text-white/50"
                  text={item.value}
                  trigger={dev.name}
                />
              </div>
            ))}
          </div>

          {/* Right Column */}
          <div className="hidden flex-col items-end gap-12 lg:flex">
            {data.right.map((item) => (
              <div className="flex flex-col items-end gap-1" key={item.label}>
                <span className="font-mono text-[0.55rem] tracking-[0.4em] text-white/20 uppercase">
                  {item.label}
                </span>
                <DecryptingText
                  className={cn(
                    "font-mono text-sm tracking-[0.2em]",
                    item.value === "ONLINE"
                      ? "text-emerald-400/70"
                      : "text-white/50"
                  )}
                  text={item.value}
                  trigger={dev.name}
                />
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
