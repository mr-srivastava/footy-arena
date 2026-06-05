import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type React from "react";
import { MediaImage } from "@/components/media-image";
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

type NationStoryGridProps = {
  children: React.ReactNode;
};

type NationStoryCardProps = {
  nation: string;
  eyebrow: string;
  accent: Extract<CardAccent, "pitch" | "gold">;
  team?: Team;
  href?: string;
  imageAlt?: string;
  children: React.ReactNode;
};

type NationStoryTimelineItem = {
  label: string;
  value: string;
  tone?: "accent" | "muted" | "bright";
};

export function NationStoryGrid({ children }: NationStoryGridProps) {
  return <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{children}</div>;
}

export function NationStoryCard({
  nation,
  eyebrow,
  accent,
  team,
  href,
  imageAlt = `${nation} football atmosphere`,
  children,
}: NationStoryCardProps) {
  const accentClass = accent === "pitch" ? "text-pitch-bright" : "text-gold";
  const imageGlowClass =
    accent === "pitch" ? "from-pitch-bright/14" : "from-gold/12";

  return (
    <Card
      padding="none"
      interactive
      accent={accent}
      className="h-full bg-artifact"
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
        <CardFooter className="mt-auto border-white/8 bg-artifact-muted/40 px-5 py-4">
          <Link
            href={href}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-gold transition-colors hover:text-foreground"
          >
            View {team.displayName}
            <ArrowRight
              className="size-4 transition-transform group-hover/card:translate-x-1"
              aria-hidden
            />
          </Link>
        </CardFooter>
      ) : null}
    </Card>
  );
}

export function NationStoryPlayerBadges({
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

export function NationStoryTimeline({
  items,
}: {
  items: NationStoryTimelineItem[];
}) {
  return (
    <dl className="mt-1 flex flex-col divide-y divide-white/8 border-y border-white/8 text-sm">
      {items.map((item) => (
        <div key={item.label} className="py-3">
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
        </div>
      ))}
    </dl>
  );
}
