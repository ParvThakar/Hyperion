"use client";

import { usePathname } from "@workspace/i18n/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useRef } from "react";

// Ordered navbar sequence for determining directional transition
const NAV_ORDER = ["/", "/features", "/docs", "/about", "/news", "/download"];

function getNavIndex(pathname: string): number {
  // Strip trailing slashes and query strings for index matching
  const cleanPath = pathname.split("?")[0]?.replace(/\/$/, "") || "/";

  const index = NAV_ORDER.findIndex((item) => {
    if (item === "/") {
      return cleanPath === "" || cleanPath === "/";
    }
    return cleanPath === item || cleanPath.startsWith(`${item}/`);
  });

  return index === -1 ? NAV_ORDER.length : index;
}

const variants = {
  initial: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? "20%" : "-20%",
  }),
  animate: {
    opacity: 1,
    x: 0,
  },
  exit: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? "-20%" : "20%",
  }),
};

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();

  const prevIndexRef = useRef<number>(getNavIndex(pathname));
  const currentIndex = getNavIndex(pathname);

  // Compute direction: > 0 means moving rightwards in nav, < 0 means moving leftwards
  let direction = currentIndex - prevIndexRef.current;
  if (direction === 0) {
    direction = 1; // Default fallback direction if same index
  }

  // Update ref for next render cycle
  prevIndexRef.current = currentIndex;

  if (reduceMotion) {
    return <>{children}</>;
  }

  return (
    <AnimatePresence custom={direction} initial={false} mode="wait">
      <motion.div
        animate="animate"
        custom={direction}
        exit="exit"
        initial="initial"
        key={pathname}
        transition={{
          duration: 0.4,
          ease: [0.25, 1, 0.5, 1],
        }}
        variants={variants}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
