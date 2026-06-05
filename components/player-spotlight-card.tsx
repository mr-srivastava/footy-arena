import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { PlayerPortrait } from "@/components/player-portrait";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type PlayerSpotlightImage =
  | {
      kind: "portrait";
      src: string;
    }
  | {
      kind: "image";
      src: string;
      sizes: string;
    };

type PlayerSpotlightCardProps = {
  href: string;
  displayName: string;
  nation: string;
  position: string;
  watermark: string;
  image?: PlayerSpotlightImage;
  archetype?: string;
  summary: string;
  footer: string;
};

function PlayerMetaBadges({
  nation,
  position,
}: {
  nation: string;
  position: string;
}) {
  return (
    <div className="mt-3 flex flex-wrap items-center gap-1.5">
      <Badge variant="meta">
        {nation}
      </Badge>
      <Badge variant="playerMeta">
        {position}
      </Badge>
    </div>
  );
}

function PlayerFallbackHeader({
  displayName,
  nation,
  position,
}: {
  displayName: string;
  nation: string;
  position: string;
}) {
  return (
    <div className="relative shrink-0 overflow-hidden border-b border-line-soft bg-gradient-to-br from-pitch/15 via-navy to-navy-light/40 px-5 py-5">
      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-gold">
        {nation}
      </p>
      <p className="mt-1 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        {position}
      </p>
      <p className="mt-4 font-display text-4xl leading-none tracking-wide text-foreground/90">
        {displayName.toUpperCase()}
      </p>
    </div>
  );
}

function PlayerSpotlightMedia({
  displayName,
  image,
}: {
  displayName: string;
  image?: PlayerSpotlightImage;
}) {
  if (!image) return null;

  if (image.kind === "portrait") {
    return (
      <div className="relative shrink-0 overflow-hidden border-b border-line-soft">
        <PlayerPortrait
          player={{ name: displayName }}
          src={image.src}
          variant="card"
        />
      </div>
    );
  }

  return (
    <div className="relative shrink-0 overflow-hidden border-b border-line-soft">
      <div className="relative aspect-square max-h-[212px] bg-[radial-gradient(ellipse_at_50%_92%,rgba(107,158,135,0.28),transparent_68%),linear-gradient(180deg,rgba(255,255,255,0.05),transparent_36%)] sm:max-h-[228px]">
        <Image
          src={image.src}
          alt={displayName}
          fill
          className="object-contain object-bottom p-4"
          sizes={image.sizes}
        />
      </div>
    </div>
  );
}

export function PlayerSpotlightCard({
  href,
  displayName,
  nation,
  position,
  watermark,
  image,
  archetype,
  summary,
  footer,
}: PlayerSpotlightCardProps) {
  return (
    <Link href={href} className="group block h-full">
      <Card
        variant="artifact"
        shape="artifact"
        padding="none"
        interactive
        className="relative h-full min-h-64 transition-colors group-hover:border-gold/35"
      >
        <div
          className="surface-watermark pointer-events-none absolute -right-1 top-16 z-0 font-display text-6xl leading-none group-hover:text-gold/[0.05] sm:top-20 sm:text-7xl"
          aria-hidden
        >
          {watermark}
        </div>

        {image ? (
          <PlayerSpotlightMedia displayName={displayName} image={image} />
        ) : (
          <PlayerFallbackHeader
            displayName={displayName}
            nation={nation}
            position={position}
          />
        )}

        <CardContent className="relative flex flex-1 flex-col p-5">
          <h3 className="font-display text-3xl leading-none tracking-wide text-foreground transition-colors group-hover:text-gold">
            {displayName.toUpperCase()}
          </h3>
          <PlayerMetaBadges nation={nation} position={position} />
          {archetype ? (
            <p className="mt-3 text-sm font-medium text-pitch-bright">
              {archetype}
            </p>
          ) : null}
          <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {summary}
          </p>
        </CardContent>

        <CardFooter className="relative grid grid-cols-[1fr_auto] items-center gap-3 border-line-soft px-5 py-3">
          <span className="truncate text-xs font-semibold text-pitch-bright">
            {footer}
          </span>
          <ChevronRight
            className="size-4 text-gold transition-transform group-hover:translate-x-1"
            aria-hidden
          />
        </CardFooter>
      </Card>
    </Link>
  );
}

export function PlayerSpotlightCardSkeleton() {
  return (
    <Card
      variant="elevated"
      shape="artifact"
      padding="none"
      className="relative h-full min-h-64 bg-artifact-muted/80"
      aria-hidden
    >
      <div className="surface-watermark pointer-events-none absolute -right-1 top-16 z-0 font-display text-6xl leading-none sm:top-20 sm:text-7xl">
        ---
      </div>

      <div className="relative shrink-0 overflow-hidden border-b border-line-soft">
        <div className="relative aspect-square max-h-[212px] bg-[radial-gradient(ellipse_at_50%_92%,rgba(107,158,135,0.18),transparent_68%),linear-gradient(180deg,rgba(255,255,255,0.04),transparent_36%)] sm:max-h-[228px]">
          <Skeleton className="absolute inset-x-8 bottom-4 h-36 rounded-sm sm:h-40" />
        </div>
      </div>

      <CardContent className="relative flex flex-1 flex-col p-5">
        <Skeleton className="h-8 w-3/4 rounded-sm" />
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <Skeleton className="h-6 w-20 rounded-sm" />
          <Skeleton className="h-6 w-24 rounded-sm" />
        </div>
        <Skeleton className="mt-4 h-4 w-32 rounded-sm" />
        <div className="mt-3 flex flex-col gap-2">
          <Skeleton className="h-3 w-full rounded-sm" />
          <Skeleton className="h-3 w-5/6 rounded-sm" />
        </div>
      </CardContent>

      <CardFooter className="relative grid grid-cols-[1fr_auto] items-center gap-3 border-line-soft px-5 py-3">
        <Skeleton className="h-3 w-36 rounded-sm" />
        <Skeleton className="size-4 rounded-sm" />
      </CardFooter>
    </Card>
  );
}
