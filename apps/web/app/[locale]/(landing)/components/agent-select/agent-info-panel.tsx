"use client";

import { useScrambleText } from "@workspace/core/hooks/use-scramble-text";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { useRef } from "react";
import type { Dev } from "../dev-cards";

gsap.registerPlugin(SplitText);

interface AgentInfoPanelProps {
  agentId: string;
  dev: Dev;
  index: number;
}

export function AgentInfoPanel({ dev, agentId, index }: AgentInfoPanelProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  /**
   * Per-character scramble on the name.
   * `index` is the trigger — changes every time a new card is centered,
   * which re-fires the scramble for the incoming dev's name.
   * stagger=17ms, speed=40ms, cycles=4 ≈ 450-600ms total for most names.
   */
  const scrambledName = useScrambleText(dev.name, index, {
    stagger: 12,
    speed: 30,
    cycles: 3,
  });

  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container) {
        return;
      }

      /* ── Gather elements ────────────────────────────────────── */
      const nameEl = container.querySelector<HTMLElement>(".gsap-name");
      const roleEl = container.querySelector<HTMLElement>(".gsap-role");
      const dotContainers = gsap.utils.toArray<HTMLElement>(
        ".gsap-dot-container",
        container
      );
      const dividerEl = container.querySelector<HTMLElement>(".gsap-divider");
      const bioEl = container.querySelector<HTMLElement>(".gsap-bio-text");
      const contribEl = container.querySelector<HTMLElement>(
        ".gsap-contrib-text"
      );
      const bioLabel = container.querySelector<HTMLElement>(".gsap-bio-label");
      const contribLabel = container.querySelector<HTMLElement>(
        ".gsap-contrib-label"
      );
      const pills = gsap.utils.toArray<HTMLElement>(".gsap-pill", container);
      const socials = container.querySelector<HTMLElement>(".gsap-socials");

      /* ── Master timeline ────────────────────────────────────── */
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      /* Set everything invisible before animating */
      gsap.set(container, { autoAlpha: 1 });

      /* 1. Name — SplitText word reveal */
      if (nameEl) {
        const nameSplit = SplitText.create(nameEl, {
          type: "words",
          autoSplit: true,
        });
        tl.from(nameSplit.words, {
          y: -50,
          autoAlpha: 0,
          duration: 0.35,
          stagger: { amount: 0.15, from: "random" },
        });
      }

      /* 2. Role — SplitText word reveal */
      if (roleEl) {
        const roleSplit = SplitText.create(roleEl, {
          type: "words",
          autoSplit: true,
        });
        tl.from(
          roleSplit.words,
          {
            y: -40,
            autoAlpha: 0,
            duration: 0.28,
            stagger: { amount: 0.12, from: "random" },
          },
          "-=0.18"
        );
      }

      /* 3. Dot row — dots slide in from the right */
      for (const dotContainer of dotContainers) {
        const dots = gsap.utils.toArray<HTMLElement>(".gsap-dot", dotContainer);
        tl.from(
          dots,
          {
            x: 30,
            autoAlpha: 0,
            duration: 0.18,
            stagger: 0.03,
          },
          "-=0.12"
        );
      }

      /* 4. Divider — scaleX draw */
      if (dividerEl) {
        tl.fromTo(
          dividerEl,
          { scaleX: 0 },
          { scaleX: 1, duration: 0.18, ease: "expo.inOut" },
          "-=0.08"
        );
      }

      /* 5. Bio label + text — SplitText word reveal */
      if (bioLabel) {
        tl.from(
          bioLabel,
          { y: 12, autoAlpha: 0, duration: 0.18 },
          "-=0.06"
        );
      }
      if (bioEl) {
        const bioSplit = SplitText.create(bioEl, {
          type: "lines, words",
          autoSplit: true,
        });
        tl.from(
          bioSplit.words,
          {
            y: -50,
            autoAlpha: 0,
            duration: 0.3,
            stagger: { amount: 0.25, from: "random" },
          },
          "-=0.08"
        );
      }

      /* 6. Contribution label + text — SplitText word reveal */
      if (contribLabel) {
        tl.from(
          contribLabel,
          { y: 12, autoAlpha: 0, duration: 0.18 },
          "-=0.08"
        );
      }
      if (contribEl) {
        const contribSplit = SplitText.create(contribEl, {
          type: "lines, words",
          autoSplit: true,
        });
        tl.from(
          contribSplit.words,
          {
            y: -50,
            autoAlpha: 0,
            duration: 0.3,
            stagger: { amount: 0.25, from: "random" },
          },
          "-=0.1"
        );
      }

      /* 7. Skill pills — pop in */
      if (pills.length > 0) {
        tl.from(
          pills,
          {
            y: 8,
            scale: 0.9,
            autoAlpha: 0,
            duration: 0.18,
            stagger: 0.025,
          },
          "-=0.1"
        );
      }

      /* 8. Social links — fade up */
      if (socials) {
        tl.from(
          socials,
          { y: 8, autoAlpha: 0, duration: 0.18 },
          "-=0.08"
        );
      }
    },
    { scope: containerRef, dependencies: [dev.name] }
  );

  return (
    <div className="w-full max-w-[480px]" ref={containerRef}>
      <div className="group/panel relative flex w-full flex-col items-start overflow-hidden rounded-2xl border border-[#3A3A3A] bg-[#080705]/95 p-5 text-left shadow-[0_0_60px_rgba(0,0,0,0.95)] backdrop-blur-2xl sm:p-6">
        {/* Top Sci-Fi Accent Line */}
        <div className="absolute inset-x-0 top-0 h-0.5 rounded-t-2xl bg-gradient-to-r from-transparent via-[#EEEEED]/30 to-transparent" />

        {/* Dev Designation Tag */}
        <div className="mb-1 font-mono text-[0.5rem] uppercase tracking-[0.4em] text-[#EEEEED]/60">
          DEV /&#47; {agentId}
        </div>

        {/* Name — GSAP SplitText target */}
        <h2 className="gsap-name font-display text-xl font-bold tracking-tight text-[#EEEEED] sm:text-2xl">
          {scrambledName}
        </h2>

        {/* Role — GSAP SplitText target */}
        <div className="gsap-role mt-0.5 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-white/40">
          {dev.role}
        </div>

        {/* ── Decorative dot row ── */}
        <div className="gsap-dot-container my-3 flex w-full items-center justify-center gap-2.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <span
              className="gsap-dot size-[7px] rounded-full bg-gradient-to-br from-[#EEEEED]/30 to-[#EEEEED]/10"
              key={`dot-${i.toString()}`}
            />
          ))}
        </div>

        {/* Divider — GSAP scaleX draw */}
        <div className="gsap-divider h-px w-full origin-left bg-[#3A3A3A]/50" />

        {/* Body content */}
        <div className="mb-4 mt-3.5 flex w-full flex-col gap-3.5 text-left">
          {/* Bio */}
          <div className="flex flex-col">
            <span className="gsap-bio-label mb-1 font-mono text-[0.48rem] uppercase tracking-[0.3em] text-[#EEEEED]/30">
              DIRECTIVE /&#47; BIO
            </span>
            <p className="gsap-bio-text text-xs leading-relaxed text-white/60">
              {dev.bio}
            </p>
          </div>

          {/* Contribution */}
          <div className="flex flex-col">
            <span className="gsap-contrib-label mb-1 font-mono text-[0.48rem] uppercase tracking-[0.3em] text-[#EEEEED]/30">
              CORE CONTRIBUTION
            </span>
            <p className="gsap-contrib-text text-xs leading-relaxed text-white/60">
              {dev.contribution}
            </p>
          </div>
        </div>

        {/* Skills Badges */}
        <div className="mb-4 flex flex-wrap items-center gap-1.5">
          {dev.skills.map((skill) => (
            <span
              className="gsap-pill rounded-md border border-[#3A3A3A] bg-white/5 px-2.5 py-0.5 font-mono text-[0.55rem] tracking-wider text-[#EEEEED]/70"
              key={skill}
            >
              {skill}
            </span>
          ))}
        </div>

        {/* Social Links */}
        <div className="gsap-socials flex items-center gap-3">
          {dev.github && (
            <a
              className="rounded-md border border-[#3A3A3A] bg-[#080705]/40 px-3 py-1 font-mono text-[0.55rem] tracking-[0.18em] text-[#EEEEED]/80 transition-all duration-200 hover:border-[#EEEEED]/40 hover:bg-[#EEEEED]/10 hover:text-[#EEEEED]"
              href={dev.github}
              rel="noreferrer"
              target="_blank"
            >
              [ GITHUB ]
            </a>
          )}
          {dev.linkedin && (
            <a
              className="rounded-md border border-[#3A3A3A] bg-[#080705]/40 px-3 py-1 font-mono text-[0.55rem] tracking-[0.18em] text-[#EEEEED]/80 transition-all duration-200 hover:border-[#EEEEED]/40 hover:bg-[#EEEEED]/10 hover:text-[#EEEEED]"
              href={dev.linkedin}
              rel="noreferrer"
              target="_blank"
            >
              [ LINKEDIN ]
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
