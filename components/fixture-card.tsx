import { Clock, MapPin } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  formatKickoff,
  formatPlaceholderTeam,
  isPlaceholderTeam,
} from "@/lib/openfootball/fixtures";
import type { Fixture } from "@/lib/openfootball/types";
import type { CardAccent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

function TeamName({
  name,
  href,
  align = "left",
}: {
  name: string;
  href?: string;
  align?: "left" | "right";
}) {
  const placeholder = isPlaceholderTeam(name);
  const label = placeholder ? formatPlaceholderTeam(name) : name;
  const className = cn(
    "block text-balance font-display text-2xl leading-none tracking-wide transition-colors md:text-3xl",
    align === "right" ? "text-right" : "text-left",
    placeholder
      ? "font-body text-sm font-medium normal-case leading-snug tracking-normal text-muted-foreground italic md:text-base"
      : "text-foreground",
  );

  if (href && !placeholder) {
    return (
      <Link href={href} className={cn(className, "hover:text-gold")}>
        {label}
      </Link>
    );
  }

  return <span className={className}>{label}</span>;
}

const stageAccent: Record<string, CardAccent> = {
  group: "pitch",
  final: "gold",
  "third-place": "gold",
  "semi-final": "gold",
  "quarter-final": "gold",
  "round-of-16": "teal",
  "round-of-32": "teal",
};

const stageTone: Record<string, string> = {
  group: "from-pitch-bright/45 via-pitch/10",
  final: "from-gold/45 via-gold/10",
  "third-place": "from-gold/35 via-gold/10",
  "semi-final": "from-gold/35 via-gold/10",
  "quarter-final": "from-gold/30 via-gold/10",
  "round-of-16": "from-teal/35 via-teal/10",
  "round-of-32": "from-teal/30 via-teal/10",
};

export function FixtureCard({
  fixture,
  team1Href,
  team2Href,
}: {
  fixture: Fixture;
  team1Href?: string;
  team2Href?: string;
}) {
  const knockout = fixture.stage !== "group";
  const accent = stageAccent[fixture.stage] ?? "pitch";
  const tone = stageTone[fixture.stage] ?? stageTone.group;
  const kickoff = formatKickoff(fixture.time);

  return (
    <Card
      accent={accent}
      interactive
      padding="none"
      className="group rounded-sm bg-artifact-strong"
    >
      <CardContent className="relative overflow-hidden p-0">
        <div
          className={cn(
            "pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b to-transparent opacity-70",
            tone,
          )}
          aria-hidden
        />

        <div className="relative flex items-start justify-between gap-4 border-b border-white/8 px-5 py-4">
          <div className="min-w-0">
            <Badge variant={knockout ? "knockout" : "group"}>
              {fixture.stageLabel}
            </Badge>
            <p className="mt-2 text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              Matchday signal
            </p>
          </div>
          <div className="shrink-0 text-right">
            {fixture.num ? (
              <Badge variant="country" className="mb-2">
                #{fixture.num}
              </Badge>
            ) : null}
            <p className="flex items-center justify-end gap-1 text-xs font-medium text-muted-foreground">
              <Clock className="h-3.5 w-3.5 text-pitch-bright/70" aria-hidden />
              {kickoff}
            </p>
          </div>
        </div>

        <div className="relative grid grid-cols-[1fr_auto_1fr] items-center gap-3 px-5 py-7">
          <div className="min-w-0">
            <TeamName name={fixture.team1} href={team1Href} />
          </div>
          <div
            className="relative flex size-11 shrink-0 items-center justify-center rounded-sm border border-white/10 bg-background/80 font-display text-base text-muted-foreground shadow-artifact-inset transition-colors group-hover:border-gold/35 group-hover:text-gold"
            aria-hidden
          >
            VS
          </div>
          <div className="min-w-0">
            <TeamName name={fixture.team2} href={team2Href} align="right" />
          </div>
          <div
            className="absolute left-1/2 top-1/2 -z-10 h-px w-full -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-transparent via-border to-transparent"
            aria-hidden
          />
        </div>

        <div className="relative flex items-start gap-2 border-t border-white/8 bg-background/25 px-5 py-3 text-xs text-muted-foreground">
          <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-pitch-bright/70" aria-hidden />
          <span className="leading-relaxed">{fixture.ground}</span>
        </div>
      </CardContent>
    </Card>
  );
}
