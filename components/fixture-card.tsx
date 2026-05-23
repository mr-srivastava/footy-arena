import { Clock, MapPin } from "lucide-react";
import Link from "next/link";
import {
  formatKickoff,
  formatPlaceholderTeam,
  isPlaceholderTeam,
} from "@/lib/openfootball/fixtures";
import type { Fixture } from "@/lib/openfootball/types";

function TeamName({ name, href }: { name: string; href?: string }) {
  const placeholder = isPlaceholderTeam(name);
  const label = placeholder ? formatPlaceholderTeam(name) : name;
  const className = placeholder
    ? "text-sm font-medium text-muted italic"
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

const stageAccent: Record<string, string> = {
  group: "from-pitch-bright/80",
  final: "from-gold",
  "third-place": "from-gold/70",
  "semi-final": "from-gold/60",
  "quarter-final": "from-gold/50",
  "round-of-16": "from-teal/80",
  "round-of-32": "from-teal/60",
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
  const accent = stageAccent[fixture.stage] ?? "from-pitch-bright/80";

  return (
    <article className="glass-panel glass-panel-interactive group relative overflow-hidden rounded-xl p-4">
      <div
        className={`absolute inset-y-0 left-0 w-0.5 bg-gradient-to-b ${accent} to-transparent opacity-80`}
        aria-hidden
      />

      <div className="flex flex-wrap items-center justify-between gap-2 pl-2">
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide ${
            knockout
              ? "bg-gold/12 text-gold ring-1 ring-gold/20"
              : "bg-pitch/12 text-pitch-bright ring-1 ring-pitch/25"
          }`}
        >
          {fixture.stageLabel}
        </span>
        <div className="flex items-center gap-2 text-xs text-muted">
          {fixture.num ? (
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted/80">
              #{fixture.num}
            </span>
          ) : null}
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden />
            {formatKickoff(fixture.time)}
          </span>
        </div>
      </div>

      <div className="relative mt-4 pl-2">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0 flex-1 text-left">
            <TeamName name={fixture.team1} href={team1Href} />
          </div>
          <div
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-background/80 font-display text-sm text-muted transition-colors group-hover:border-pitch/30 group-hover:text-pitch-bright"
            aria-hidden
          >
            VS
          </div>
          <div className="min-w-0 flex-1 text-right">
            <TeamName name={fixture.team2} href={team2Href} />
          </div>
        </div>
        <div
          className="absolute left-1/2 top-1/2 -z-10 h-px w-full -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-transparent via-white/8 to-transparent"
          aria-hidden
        />
      </div>

      <p className="mt-4 flex items-start gap-1.5 border-t border-white/6 pt-3 pl-2 text-xs text-muted">
        <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-pitch-bright/70" aria-hidden />
        <span>{fixture.ground}</span>
      </p>
    </article>
  );
}
