import { siteConfig } from "@workspace/core/config/site";
import { Button } from "@workspace/ui/components/button";
import { Reveal } from "@workspace/ui/components/marketing/reveal";
import Link from "next/link";
import type { ReactNode } from "react";
import type { Platform } from "@/lib/detect-platform";
import {
  type PlatformCardData,
  platformCards,
} from "../download/platform-mappings";
import { Eyebrow, GlowCard } from "./marketing-kit";

interface PlatformCardsProps {
  assets: Record<string, string>;
  detectedPlatform?: Platform;
}

function DownloadButton({
  href,
  label,
  ext,
}: {
  href: string | undefined;
  label: string;
  ext: string;
}) {
  if (!href) {
    return null;
  }
  const isExternal = href.startsWith("http");
  return (
    <Button
      asChild={true}
      className="w-full cursor-pointer justify-between bg-secondary text-secondary-foreground hover:bg-secondary/70 hover:text-primary"
      variant="secondary"
    >
      <Link
        href={href}
        rel={isExternal ? "noopener noreferrer" : undefined}
        target={isExternal ? "_blank" : undefined}
      >
        <span className="text-sm">{label}</span>
        <span className="font-mono text-muted-foreground text-xs">{ext}</span>
      </Link>
    </Button>
  );
}

function resolveHref(assetKey: string, assets: Record<string, string>) {
  return assetKey.startsWith("http") ? assetKey : assets[assetKey];
}

function ActivePlatformCard({
  platform,
  assets,
}: {
  platform: PlatformCardData;
  assets: Record<string, string>;
}) {
  const resolvedDownloads = platform.downloads.filter((dl) =>
    resolveHref(dl.assetKey, assets)
  );

  return (
    <div className="relative pt-4 w-full sm:w-[320px]">
      {/* Floating animated "Your Platform" badge */}
      <div className="absolute top-0 left-1/2 z-20 -translate-x-1/2">
        {/* Soft pulsing glow behind the badge */}
        <div className="absolute inset-0 rounded-full bg-white/20 blur-md motion-safe:animate-pulse" />
        <span className="relative inline-flex items-center overflow-hidden rounded-full border border-white/25 bg-gradient-to-b from-white to-[#E8E8E8] px-4 py-1.5 font-semibold text-[#111] text-xs shadow-[0_2px_16px_-2px_rgba(255,255,255,0.25)] whitespace-nowrap">
          {/* Shimmer sweep */}
          <span className="pointer-events-none absolute inset-0 -translate-x-full animate-[shimmer_3s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
          Your Platform
        </span>
      </div>

      <GlowCard
        beam={true}
        className="relative flex h-full w-full flex-col items-center justify-between border-primary/30 p-8 pt-10 text-center shadow-[0_0_48px_-12px] shadow-primary/20 transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-primary/30 hover:shadow-xl"
        tilt={false}
      >
        <div className="flex w-full flex-col items-center">
          <CardDecorator>{platform.icon}</CardDecorator>
          <h3 className="mt-5 font-semibold text-foreground text-xl tracking-tight">
            {platform.name}
          </h3>
        </div>

        {resolvedDownloads.length > 0 && (
          <div className="mt-6 w-full space-y-2.5">
            {resolvedDownloads.map((dl) => (
              <DownloadButton
                ext={dl.ext}
                href={resolveHref(dl.assetKey, assets)}
                key={dl.assetKey + dl.label}
                label={dl.label}
              />
            ))}
          </div>
        )}
      </GlowCard>
    </div>
  );
}

function PlatformPill({ platform }: { platform: PlatformCardData }) {
  return (
    <div className="inline-flex min-w-[140px] items-center justify-center gap-2.5 rounded-full border border-white/[0.1] bg-white/[0.04] px-5 py-2.5 text-white/60 text-sm backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:bg-white/[0.07] hover:text-white/85">
      <span className="flex shrink-0 items-center justify-center opacity-60 [&_svg]:size-4">
        {platform.icon}
      </span>
      <span className="font-medium tracking-tight">{platform.name}</span>
    </div>
  );
}

export default function PlatformCards({
  assets,
  detectedPlatform,
}: PlatformCardsProps) {
  const recIndex = platformCards.findIndex(
    (p) =>
      !!detectedPlatform &&
      detectedPlatform !== "unknown" &&
      p.matchKey === detectedPlatform
  );
  const activeIdx = recIndex === -1 ? 0 : recIndex;
  const activePlatform = platformCards[activeIdx]!;
  const otherPlatforms = platformCards.filter((_, idx) => idx !== activeIdx);

  return (
    <section className="py-16 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal direction="up" duration={300}>
          <div className="flex flex-col items-center text-center">
            <Eyebrow>Platforms</Eyebrow>
            <h2 className="mt-3 text-balance font-display font-semibold text-4xl tracking-tighter lg:text-5xl">
              Available Platforms
            </h2>
            <p className="mt-4 text-muted-foreground">
              Download {siteConfig.name} for your platform.
            </p>
          </div>
        </Reveal>

        {/* Main active platform card */}
        <div className="mx-auto mt-8 flex justify-center md:mt-16">
          <Reveal direction="up" duration={350} offset={32}>
            <ActivePlatformCard assets={assets} platform={activePlatform} />
          </Reveal>
        </div>

        {/* Other platforms as equal-width pills below */}
        <Reveal direction="up" duration={350} offset={24}>
          <div className="mt-6 flex items-center justify-center gap-3">
            {otherPlatforms.map((p) => (
              <PlatformPill key={p.name} platform={p} />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

const CardDecorator = ({ children }: { children: ReactNode }) => (
  <div className="relative mx-auto size-36 duration-200 [--color-border:color-mix(in_oklab,var(--color-foreground)15%,transparent)] [-webkit-mask-image:radial-gradient(circle,black_40%,transparent_60%)] [mask-image:radial-gradient(circle,black_40%,transparent_60%)] group-hover/card:[--color-border:color-mix(in_oklab,var(--color-foreground)25%,transparent)]">
    <div
      aria-hidden={true}
      className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-size-[24px_24px] opacity-50"
    />

    <div className="absolute inset-0 m-auto flex size-12 items-center justify-center rounded-lg border border-border bg-secondary transition-transform duration-300 group-hover/card:-rotate-3 group-hover/card:scale-110">
      {children}
    </div>
  </div>
);
