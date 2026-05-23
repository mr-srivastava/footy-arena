import { Sparkles } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { SubsectionTitle } from "@/components/subsection-title";
import type { PlayerProfile, TeamNarrative } from "@/lib/discovery/types";
import { artifactSurface } from "@/lib/utils";

export function TeamNarrativePanel({
  narrative,
  keyPlayers,
}: {
  narrative: TeamNarrative;
  keyPlayers: PlayerProfile[];
}) {
  return (
    <section className={artifactSurface("relative overflow-hidden p-6 md:p-8")}>
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-pitch-bright/12 to-transparent"
        aria-hidden
      />
      <div className="relative">
        <SubsectionTitle level="panel" icon={Sparkles}>
          THE STORY
        </SubsectionTitle>

        <p className="mt-4 text-base leading-relaxed text-foreground/90">
          {narrative.narrative}
        </p>

        <p className="mt-2 text-sm italic text-gold">{narrative.vibe}</p>

        <div className="mt-6 border-l border-pitch-bright/45 pl-4">
          <SubsectionTitle level="label">Why watch</SubsectionTitle>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {narrative.whyCasualFansShouldCare}
          </p>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {narrative.identityTags.map((tag) => (
            <Badge key={tag} variant="group" className="h-auto rounded-sm px-3 py-1">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="mt-6 border-y border-white/8 py-4">
          <SubsectionTitle level="label">Current themes</SubsectionTitle>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {narrative.currentThemes.map((theme) => (
              <li
                key={theme}
                className="grid grid-cols-[auto_1fr] gap-2 text-sm text-muted-foreground"
              >
                <span className="mt-2 h-px w-4 bg-pitch-bright/55" aria-hidden />
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
                  className="rounded-sm border border-white/10 bg-white/5 px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:border-gold/40 hover:text-gold"
                >
                  {player.name}
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
