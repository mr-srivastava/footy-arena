import { Sparkles } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { SubsectionTitle } from "@/components/subsection-title";
import type { PlayerProfile, TeamNarrative } from "@/lib/discovery/types";

export function TeamNarrativePanel({
  narrative,
  keyPlayers,
}: {
  narrative: TeamNarrative;
  keyPlayers: PlayerProfile[];
}) {
  return (
    <Card accent="pitch" padding="none">
      <CardContent className="p-6 md:p-8">
        <SubsectionTitle level="panel" icon={Sparkles}>
          THE STORY
        </SubsectionTitle>

        <p className="mt-4 text-base leading-relaxed text-foreground/90">
          {narrative.narrative}
        </p>

        <p className="mt-2 text-sm italic text-gold">{narrative.vibe}</p>

        <div className="mt-6">
          <SubsectionTitle level="label">Why watch</SubsectionTitle>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {narrative.whyCasualFansShouldCare}
          </p>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {narrative.identityTags.map((tag) => (
            <Badge key={tag} variant="group" className="h-auto rounded-full px-3 py-1">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="mt-6">
          <SubsectionTitle level="label">Current themes</SubsectionTitle>
          <ul className="mt-2 flex flex-col gap-1.5">
            {narrative.currentThemes.map((theme) => (
              <li key={theme} className="text-sm text-muted-foreground">
                · {theme}
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
                  className="rounded-full border border-border bg-surface-elevated/60 px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:border-gold/40 hover:text-gold"
                >
                  {player.name}
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
