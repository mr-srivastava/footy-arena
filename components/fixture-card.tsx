import { Clock, MapPin } from "lucide-react";
import Link from "next/link";
import { TeamCrest } from "@/components/team-crest";
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
  teamId,
}: {
  name: string;
  href?: string;
  teamId?: number | null;
}) {
  const placeholder = isPlaceholderTeam(name);
  const label = placeholder ? formatPlaceholderTeam(name) : name;
  const nameClassName = cn(
    "min-w-0 text-balance text-center",
    placeholder
      ? "font-body text-sm font-medium normal-case leading-snug tracking-normal text-muted-foreground italic md:text-base"
      : "type-broadcast text-xl leading-snug text-foreground md:text-2xl",
  );

  const stackClassName =
    "flex w-full min-w-0 flex-col items-center gap-2 text-center";

  const content = (
    <>
      <TeamCrest teamId={teamId} name={name} size="md" className="shrink-0" />
      <span className={nameClassName}>{label}</span>
    </>
  );

  if (href && !placeholder) {
    return (
      <Link href={href} className={cn(stackClassName, "hover:text-gold")}>
        {content}
      </Link>
    );
  }

  return <span className={stackClassName}>{content}</span>;
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
  team1Name,
  team2Name,
  team1Href,
  team2Href,
  team1Id,
  team2Id,
}: {
  fixture: Fixture;
  team1Name?: string;
  team2Name?: string;
  team1Href?: string;
  team2Href?: string;
  team1Id?: number | null;
  team2Id?: number | null;
}) {
  const homeName = team1Name ?? fixture.team1;
  const awayName = team2Name ?? fixture.team2;
  const knockout = fixture.stage !== "group";
  const accent = stageAccent[fixture.stage] ?? "pitch";
  const tone = stageTone[fixture.stage] ?? stageTone.group;
  const kickoff = formatKickoff(fixture.time);

  return (
    <Card
      variant="artifact"
      accent={accent}
      interactive
      padding="none"
      className="surface-sage-glow group rounded-2xl transition-shadow duration-200 hover:shadow-card-hover"
    >
      <CardContent className="relative overflow-hidden p-0">
        <div
          className={cn(
            "pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b to-transparent opacity-70",
            tone,
          )}
          aria-hidden
        />

        <div className="relative flex items-start justify-between gap-4 border-b border-line-soft px-6 py-5">
          <div className="min-w-0">
            <Badge variant={knockout ? "knockout" : "group"}>
              {fixture.stageLabel}
            </Badge>
            <p className="type-label mt-2 text-muted-foreground">
              Matchday signal
            </p>
          </div>
          <div className="shrink-0 text-right">
            {fixture.num ? (
              <Badge variant="country" className="mb-2">
                #{fixture.num}
              </Badge>
            ) : null}
            <p className="type-meta type-data flex items-center justify-end gap-1">
              <Clock className="h-3.5 w-3.5 text-pitch-bright/70" aria-hidden />
              {kickoff}
            </p>
          </div>
        </div>

        <div className="relative flex flex-col items-center gap-5 px-6 py-8">
          <TeamName name={homeName} href={team1Href} teamId={team1Id} />
          <div
            className="type-broadcast flex size-12 shrink-0 items-center justify-center rounded-full border border-line-strong bg-background/80 text-base text-muted-foreground shadow-artifact-inset transition-colors group-hover:border-gold/35 group-hover:text-gold"
            aria-hidden
          >
            VS
          </div>
          <TeamName name={awayName} href={team2Href} teamId={team2Id} />
        </div>

        <div className="type-meta relative flex items-start gap-2 border-t border-line-soft bg-white/[0.025] px-6 py-4">
          <MapPin
            className="mt-0.5 h-3.5 w-3.5 shrink-0 text-pitch-bright/70"
            aria-hidden
          />
          <div className="flex min-w-0 flex-1 items-start justify-between gap-3">
            <span className="leading-relaxed">{fixture.ground}</span>
            <Link
              href={`/fixtures/${fixture.id}`}
              className="shrink-0 text-gold transition-colors hover:text-foreground"
            >
              Match brief
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
