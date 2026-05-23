import { Clock, MapPin } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  formatKickoff,
  formatPlaceholderTeam,
  isPlaceholderTeam,
} from "@/lib/openfootball/fixtures";
import type { Fixture } from "@/lib/openfootball/types";
import type { CardAccent } from "@/components/ui/card";

function TeamName({ name, href }: { name: string; href?: string }) {
  const placeholder = isPlaceholderTeam(name);
  const label = placeholder ? formatPlaceholderTeam(name) : name;
  const className = placeholder
    ? "text-sm font-medium text-muted-foreground italic"
    : "text-sm font-semibold leading-tight text-foreground";

  if (href && !placeholder) {
    return (
      <Link href={href} className={`${className} hover:text-gold`}>
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

  return (
    <Card accent={accent} interactive padding="none" className="group">
      <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2 pb-0 pl-6">
        <Badge variant={knockout ? "knockout" : "group"}>
          {fixture.stageLabel}
        </Badge>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {fixture.num ? (
            <Badge variant="country">#{fixture.num}</Badge>
          ) : null}
          <span className="flex items-center gap-1">
            <Clock aria-hidden />
            {formatKickoff(fixture.time)}
          </span>
        </div>
      </CardHeader>

      <CardContent className="pl-6">
        <div className="relative">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0 flex-1 text-left">
              <TeamName name={fixture.team1} href={team1Href} />
            </div>
            <div
              className="flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-surface-sunken/80 font-display text-sm text-muted-foreground transition-colors group-hover:border-pitch/30 group-hover:text-pitch-bright"
              aria-hidden
            >
              VS
            </div>
            <div className="min-w-0 flex-1 text-right">
              <TeamName name={fixture.team2} href={team2Href} />
            </div>
          </div>
          <div
            className="absolute left-1/2 top-1/2 -z-10 h-px w-full -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-transparent via-border to-transparent"
            aria-hidden
          />
        </div>
      </CardContent>

      <CardFooter className="mt-0 flex-col items-stretch gap-3 border-0 bg-transparent p-0 px-4 pb-4 pl-6 pt-0">
        <Separator />
        <p className="flex items-start gap-1.5 text-xs text-muted-foreground">
          <MapPin className="mt-0.5 shrink-0 text-pitch-bright/70" aria-hidden />
          <span>{fixture.ground}</span>
        </p>
      </CardFooter>
    </Card>
  );
}
