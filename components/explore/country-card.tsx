import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type React from "react";
import { DetailList, DetailListItem } from "@/components/detail-list";
import { MediaImage } from "@/components/media-image";
import { Badge } from "@/components/ui/badge";
import type { CardAccent } from "@/components/ui/card";
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
  const content = (
    <article
      className="group relative flex min-h-[34rem] h-full flex-col justify-between overflow-hidden rounded-2xl border border-line-strong bg-artifact p-6 shadow-card transition-all duration-500 hover:-translate-y-1 hover:border-gold/30 hover:shadow-card-hover md:p-7"
    >
      <MediaImage
        src={getNationImage(nation)}
        alt={imageAlt}
        className="absolute inset-0 transition-transform duration-700 group-hover:scale-[1.035]"
        sizes="(max-width: 768px) 100vw, 33vw"
      />
      <div className="relative z-10 flex items-center justify-between">
        <p className={cn("broadcast-label rounded-full border border-white/15 bg-black/25 px-3 py-2 backdrop-blur-md", accentClass)}>
          {eyebrow}
        </p>
        {href ? (
          <ArrowUpRight className="size-5 text-white transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
        ) : null}
      </div>

      <div className="relative z-10">
        <h2 className="editorial-title type-section-title text-white transition-colors group-hover:text-gold">
          {nation}
        </h2>
        <div className="mt-5 rounded-2xl border border-white/10 bg-black/35 p-4 text-white/80 backdrop-blur-md">
          {children}
          {href && team ? (
            <Link
              href={href}
              className="mt-4 flex items-center justify-between border-t border-white/10 pt-4 text-sm font-semibold text-gold"
            >
              View {team.displayName}
              <ArrowUpRight className="size-4 transition-transform hover:-translate-y-0.5 hover:translate-x-0.5" />
            </Link>
          ) : null}
        </div>
      </div>
    </article>
  );

  return content;
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
              (!item.tone || item.tone === "muted") && "text-white/55",
            )}
          >
            {item.label}
          </dt>
          <dd
            className={cn(
              "mt-1 leading-relaxed",
              item.tone === "bright" ? "text-white" : "text-white/72",
            )}
          >
            {item.value}
          </dd>
        </DetailListItem>
      ))}
    </DetailList>
  );
}
