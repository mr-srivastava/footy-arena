import { ArrowUpRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { HighlightBlock } from "@/components/highlight-block";
import { MediaImage } from "@/components/media-image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { SubsectionTitle } from "@/components/subsection-title";
import { getTeamNarrativeImage } from "@/lib/discovery";
import type { PlayerProfile, TeamNarrative } from "@/lib/discovery/types";

export function TeamNarrativePanel({
  narrative,
  keyPlayers,
}: {
  narrative: TeamNarrative;
  keyPlayers: PlayerProfile[];
}) {
  return (
    <Card
      variant="artifact"
      shape="artifact"
      padding="none"
      className="relative min-h-[34rem]"
    >
      <MediaImage
        src={getTeamNarrativeImage(narrative.fifaCode)}
        alt={`${narrative.fifaCode} football culture`}
        className="absolute inset-0"
        sizes="(max-width: 1024px) 100vw, 50vw"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/72 to-black/25" />
      <CardContent className="relative flex min-h-[34rem] max-w-3xl flex-col justify-end p-6 md:p-10">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-pitch-bright/12 to-transparent"
          aria-hidden
        />
        <SubsectionTitle level="panel" icon={Sparkles}>
          THE STORY
        </SubsectionTitle>

        <h2 className="editorial-title type-section-title mt-4 text-white">
          A nation in motion
        </h2>
        <p className="mt-5 text-base leading-relaxed text-white/80">
          {narrative.narrative}
        </p>

        <p className="mt-2 text-sm italic text-gold">{narrative.vibe}</p>

        <HighlightBlock className="mt-6 bg-black/25">
          <SubsectionTitle level="label">Why watch</SubsectionTitle>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {narrative.whyCasualFansShouldCare}
          </p>
        </HighlightBlock>

        <div className="mt-6 flex flex-wrap gap-2">
          {narrative.identityTags.map((tag) => (
            <Badge
              key={tag}
              variant="group"
              className="h-auto rounded-sm px-3 py-1"
            >
              {tag}
            </Badge>
          ))}
        </div>

        <div className="mt-6 border-y border-line-soft py-4">
          <SubsectionTitle level="label">Current themes</SubsectionTitle>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {narrative.currentThemes.map((theme) => (
              <li
                key={theme}
                className="grid grid-cols-[auto_1fr] gap-2 text-sm text-muted-foreground"
              >
                <span
                  className="mt-2 h-px w-4 bg-pitch-bright/55"
                  aria-hidden
                />
                <span>{theme}</span>
              </li>
            ))}
          </ul>
        </div>

        {keyPlayers.length > 0 ? (
          <div className="mt-6">
            <SubsectionTitle level="label">Key players</SubsectionTitle>
            <div className="mt-3 flex flex-wrap gap-2-[0] gap-2">
              {keyPlayers.map((player) => (
                <Link
                  key={player.slug}
                  href={`/players/${player.slug}`}
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/25 px-4 py-2 text-sm font-medium text-white backdrop-blur-md transition-colors hover:border-gold/40 hover:text-gold"
                >
                  {player.name}
                  <ArrowUpRight className="size-3.5" />
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
