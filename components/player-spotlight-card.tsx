import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
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
      <div className="surface-player-stage absolute inset-0">
        <Image
          src={image.src}
          alt={displayName}
          fill
          sizes="(max-width: 640px) 100vw, 33vw"
          className="portrait-shadow origin-bottom object-contain object-bottom px-4 pt-10 transition-transform duration-700 group-hover:scale-[1.045]"
        />
      </div>
    );
  }

  return (
    <div className="surface-player-stage absolute inset-0">
      <Image
        src={image.src}
        alt={displayName}
        fill
        className="portrait-shadow object-contain object-bottom p-6 transition-transform duration-700 group-hover:scale-[1.045]"
        sizes={image.sizes}
      />
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
    <Link
      href={href}
      className="group relative block h-full min-h-[34rem] overflow-hidden rounded-2xl border border-line-strong bg-artifact shadow-card transition-all duration-500 hover:-translate-y-1 hover:border-gold/30 hover:shadow-card-hover"
    >
      {image ? (
        <PlayerSpotlightMedia displayName={displayName} image={image} />
      ) : (
        <div className="surface-player-fallback absolute inset-0" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/5" />
      <div className="absolute inset-0 flex flex-col justify-between p-6">
        <div
          className="pointer-events-none absolute -right-2 top-14 font-display text-[7rem] leading-none text-white/[0.055]"
          aria-hidden
        >
          {watermark}
        </div>
        <div className="relative z-10 flex items-start justify-between gap-4">
          <PlayerMetaBadges nation={nation} position={position} />
          <ArrowUpRight className="mt-1 size-5 text-white transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
        </div>
        <div className="relative z-10">
          {archetype ? <p className="broadcast-label text-gold">{archetype}</p> : null}
          <h3 className="editorial-title type-card-title mt-3 text-white transition-colors group-hover:text-gold">
            {displayName}
          </h3>
          <p className="type-copy mt-4 line-clamp-2 text-white/70">
            {summary}
          </p>
          <p className="type-meta mt-5 truncate border-t border-white/10 pt-4 font-semibold text-gold">
            {footer}
          </p>
        </div>
      </div>
    </Link>
  );
}

export function PlayerSpotlightCardSkeleton() {
  return (
    <Card
      variant="elevated"
      shape="artifact"
      padding="none"
      className="relative h-full min-h-[34rem] bg-artifact-muted/80"
      aria-hidden
    >
      <div className="surface-player-stage-muted absolute inset-0">
        <Skeleton className="absolute inset-x-8 bottom-0 h-80 rounded-t-full" />
      </div>
      <div className="absolute inset-0 flex flex-col justify-between p-6">
        <div className="flex gap-2">
          <Skeleton className="h-6 w-20 rounded-sm" />
          <Skeleton className="h-6 w-24 rounded-sm" />
        </div>
        <div>
          <Skeleton className="h-4 w-32 rounded-sm" />
          <Skeleton className="mt-3 h-12 w-3/4 rounded-sm" />
          <div className="mt-4 flex flex-col gap-2">
          <Skeleton className="h-3 w-full rounded-sm" />
          <Skeleton className="h-3 w-5/6 rounded-sm" />
          </div>
          <Skeleton className="mt-5 h-3 w-36 rounded-sm" />
        </div>
      </div>
    </Card>
  );
}
