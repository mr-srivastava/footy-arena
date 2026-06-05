import Link from "next/link";
import type React from "react";
import { DetailList, DetailListItem } from "@/components/detail-list";
import { MediaImage } from "@/components/media-image";
import { SurfaceLink } from "@/components/surface-link";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  type CardAccent,
} from "@/components/ui/card";
import { getNationImage } from "@/lib/discovery";
import type { Team } from "@/lib/openfootball/types";
import { cn } from "@/lib/utils";

type CountryCardGridProps = {
  children: React.ReactNode;
};

type CountryCardProps = {
  nation: string;
  eyebrow: string;
  accent: Extract<CardAccent, "pitch" | "gold">;
  team?: Team;
  href?: string;
  imageAlt?: string;
  children: React.ReactNode;
};

type CountryTimelineItem = {
  label: string;
  value: string;
  tone?: "accent" | "muted" | "bright";
};

export function CountryCardGrid({ children }: CountryCardGridProps) {
  return <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{children}</div>;
}

export function CountryCard({
  nation,
  eyebrow,
  accent,
  team,
  href,
  imageAlt = `${nation} football atmosphere`,
  children,
}: CountryCardProps) {
  const accentClass = accent === "pitch" ? "text-pitch-bright" : "text-gold";
  const imageGlowClass =
    accent === "pitch" ? "from-pitch-bright/14" : "from-gold/12";

  return (
    <Card
      variant="artifact"
      padding="none"
      interactive
      accent={accent}
      className="h-full"
    >
      <MediaImage
        src={getNationImage(nation)}
        alt={imageAlt}
        className="h-28 shrink-0 transition-transform duration-300 group-hover/card:scale-[1.02]"
        sizes="(max-width: 768px) 100vw, 33vw"
      />
      <CardHeader className="relative px-5 pt-1">
        <div
          className={cn(
            "pointer-events-none absolute inset-x-0 -top-4 h-20 bg-gradient-to-b to-transparent",
            imageGlowClass,
          )}
          aria-hidden
        />
        <p
          className={cn(
            "relative text-[0.65rem] font-semibold uppercase tracking-[0.22em]",
            accentClass,
          )}
        >
          {eyebrow}
        </p>
        <h2 className="relative font-display text-4xl leading-none tracking-wide text-foreground transition-colors group-hover/card:text-gold">
          {nation.toUpperCase()}
        </h2>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col px-5 pb-1">{children}</CardContent>
      {href && team ? (
        <CardFooter className="mt-auto border-line-soft bg-artifact-muted/40 px-5 py-4">
          <SurfaceLink href={href}>
            View {team.displayName}
          </SurfaceLink>
        </CardFooter>
      ) : null}
    </Card>
  );
}

export function CountryPlayerLinks({
  players,
}: {
  players: { name: string; slug: string }[];
}) {
  if (players.length === 0) return null;

  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {players.map((player) => (
        <Badge
          key={player.slug}
          variant="outline"
          className="h-auto rounded-sm px-3 py-1"
          render={<Link href={`/players/${player.slug}`} />}
        >
          {player.name}
        </Badge>
      ))}
    </div>
  );
}

export function CountryTimeline({
  items,
}: {
  items: CountryTimelineItem[];
}) {
  return (
    <DetailList className="mt-1 text-sm" as="dl">
      {items.map((item) => (
        <DetailListItem key={item.label} as="div">
          <dt
            className={cn(
              "text-xs font-semibold uppercase tracking-widest",
              item.tone === "accent" && "text-gold",
              item.tone === "bright" && "text-pitch-bright",
              (!item.tone || item.tone === "muted") && "text-muted",
            )}
          >
            {item.label}
          </dt>
          <dd
            className={cn(
              "mt-1 leading-relaxed",
              item.tone === "bright" ? "text-foreground/90" : "text-muted",
            )}
          >
            {item.value}
          </dd>
        </DetailListItem>
      ))}
    </DetailList>
  );
}
