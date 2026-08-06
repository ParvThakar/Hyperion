"use client";

import { AnimatePresence, motion } from "motion/react";
import type { Dev } from "./dev-cards";

export function AeonHologram({ dev }: { dev: Dev }) {
  return (
    <div className="relative flex h-[450px] w-full flex-col items-center justify-end sm:h-[550px] md:h-[650px] lg:h-[750px]">
      {/* ── Volumetric Light Cylinder ── */}
      <AnimatePresence mode="wait">
        <motion.div
          animate={{
            opacity: [0, 1, 0.7, 0.9, 0.8],
            scaleY: [0, 1, 1, 1, 1],
          }}
          className="pointer-events-none absolute inset-x-0 bottom-0 h-full origin-top"
          exit={{ opacity: 0, scaleY: 0, transition: { duration: 0.3 } }}
          initial={{ opacity: 0, scaleY: 0 }}
          key={`light-${dev.name}`}
          style={{
            background:
              "radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.02) 40%, transparent 70%)",
            filter: "blur(20px)",
          }}
          transition={{
            duration: 1.5,
            ease: "easeOut",
            times: [0, 0.4, 0.6, 0.8, 1],
          }}
        />
      </AnimatePresence>

      {/* ── Downward Scanline Effect ── */}
      <AnimatePresence mode="wait">
        <motion.div
          animate={{ y: ["0%", "100%"], opacity: [0, 1, 1, 0] }}
          className="pointer-events-none absolute inset-x-0 top-0 z-20 h-1 w-full bg-white/40 blur-[2px]"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0, y: "0%" }}
          key={`scan-${dev.name}`}
          transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
        />
      </AnimatePresence>

      {/* ── Founder Materialization ── */}
      <AnimatePresence mode="wait">
        <motion.div
          animate={{
            filter: ["blur(20px) brightness(4)", "blur(0px) brightness(1)"],
            opacity: [0, 1],
            y: [0, -10, 0], // subtle floating
          }}
          className="relative z-10 h-[90%] w-full"
          exit={{
            filter: "blur(15px) brightness(0.2)",
            opacity: 0,
            scale: 0.9,
            transition: { duration: 0.4 },
          }}
          initial={{ filter: "blur(20px) brightness(4)", opacity: 0 }}
          key={`founder-${dev.name}`}
          transition={{
            filter: { duration: 1.2, ease: "easeOut" },
            opacity: { duration: 0.8, ease: "easeOut" },
            y: {
              duration: 4,
              ease: "easeInOut",
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "mirror",
            },
          }}
        >
          {dev.photoUrl ? (
            <img
              alt={dev.name}
              className="h-full w-full object-contain drop-shadow-[0_0_30px_rgba(255,255,255,0.15)]"
              draggable={false}
              src={dev.photoUrl}
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <div className="flex size-32 items-center justify-center rounded-full border border-white/20 bg-white/10 font-display text-5xl text-white/50">
                {dev.initials}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* ── Floor Light Pool ── */}
      <AnimatePresence mode="wait">
        <motion.div
          animate={{ opacity: 1, scale: 1 }}
          className="pointer-events-none absolute inset-x-0 -bottom-10 h-20 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.1)_0%,transparent_70%)]"
          exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.3 } }}
          initial={{ opacity: 0, scale: 0.8 }}
          key={`pool-${dev.name}`}
          transition={{ duration: 1 }}
        />
      </AnimatePresence>
    </div>
  );
}
