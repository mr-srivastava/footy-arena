import {
  Calendar,
  Footprints,
  MapPin,
  Ruler,
  Shield,
  Shirt,
  Sparkles,
  Trophy,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { DetailList, DetailListRow } from "@/components/detail-list";
import { HighlightBlock } from "@/components/highlight-block";
import { StatCard } from "@/components/stat-card";
import { SubsectionTitle } from "@/components/subsection-title";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatMarketValueEur } from "@/lib/bsd/format";
import { exploreCardSubtitle } from "@/lib/explore/load-players";
import type { ExplorePlayerCard } from "@/lib/explore/types";

function HeadlineStats({ player }: { player: ExplorePlayerCard }) {
  const marketValue = formatMarketValueEur(player.marketValueEur);
  const stats = [
    player.jerseyNumber != null
      ? { label: "Shirt", value: String(player.jerseyNumber), icon: Shirt }
      : null,
    { label: "Age", value: String(player.age), icon: Calendar },
    player.heightCm
      ? { label: "Height", value: `${player.heightCm} cm`, icon: Ruler }
      : null,
    marketValue
      ? { label: "Value", value: marketValue, icon: TrendingUp }
      : null,
    player.previousWorldCupsCount
      ? {
          label: "World Cups",
          value: String(player.previousWorldCupsCount),
          icon: Trophy,
        }
      : null,
  ].filter(Boolean) as Array<{
    label: string;
    value: string;
    icon: typeof Calendar;
  }>;

  if (stats.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-x-8 gap-y-5 border-y border-line-soft py-5">
      {stats.map((stat) => (
        <StatCard
          key={stat.label}
          label={stat.label}
          value={stat.value}
          icon={stat.icon}
          layout="inline"
        />
      ))}
    </div>
  );
}

function ClubContext({ player }: { player: ExplorePlayerCard }) {
  return (
    <HighlightBlock>
      <SubsectionTitle level="label">At the club</SubsectionTitle>
      <p className="mt-2 font-display text-2xl tracking-wide text-foreground">
        {player.club.toUpperCase()}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {player.league}
        {player.clubCountry ? ` · ${player.clubCountry}` : ""}
      </p>
      <p className="mt-3 text-sm text-muted-foreground">
        {player.detailedPosition || player.position}
        {player.preferredFoot ? ` · ${player.preferredFoot} foot` : ""}
      </p>
    </HighlightBlock>
  );
}

function SecondaryDetails({ player }: { player: ExplorePlayerCard }) {
  const rows = [
    ["Weight", player.weightKg ? `${player.weightKg} kg` : null],
    ["Date of birth", player.dateOfBirth ?? null],
    ["Contract until", player.contractUntil ?? null],
    ["Availability", player.availability ?? null],
    [
      "World Cup experience",
      player.previousWorldCupsCount
        ? `${player.previousWorldCupsCount} tournament${player.previousWorldCupsCount === 1 ? "" : "s"}`
        : null,
    ],
  ].filter((entry): entry is [string, string] => Boolean(entry[1]));

  if (rows.length === 0) {
    return null;
  }

  return (
    <section>
      <SubsectionTitle level="label" tone="gold">
        More detail
      </SubsectionTitle>
      <DetailList className="mt-3">
        {rows.map(([label, value]) => (
          <DetailListRow key={label} label={label} value={value} />
        ))}
      </DetailList>
    </section>
  );
}

export function PlayerProfilePanel({ player }: { player: ExplorePlayerCard }) {
  const hasEditorial = Boolean(
    player.editorial?.whyExcited ||
      player.editorial?.watchFor ||
      player.editorial?.similarEnergy,
  );

  return (
    <Card variant="artifact" shape="artifact">
      <CardContent className="p-6 md:p-8">
        <div className="flex flex-col gap-8">
        <HeadlineStats player={player} />

        <ClubContext player={player} />

        {!hasEditorial ? (
          <section>
            <SubsectionTitle level="panel" icon={Sparkles}>
              IN THE SQUAD
            </SubsectionTitle>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              {exploreCardSubtitle(player)}
            </p>
          </section>
        ) : null}

        {player.editorial?.whyExcited ? (
          <section>
            <SubsectionTitle level="panel" icon={Sparkles}>
              WHY PEOPLE ARE EXCITED
            </SubsectionTitle>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              {player.editorial.whyExcited}
            </p>
          </section>
        ) : null}

        {player.editorial?.watchFor ? (
          <HighlightBlock tone="gold">
            <SubsectionTitle level="label" tone="accent">
              Watch for
            </SubsectionTitle>
            <p className="mt-2 text-base leading-relaxed text-foreground/90">
              {player.editorial.watchFor}
            </p>
          </HighlightBlock>
        ) : null}

        {player.editorial?.similarEnergy ? (
          <section>
            <SubsectionTitle level="label">Similar energy</SubsectionTitle>
            <p className="mt-2 text-base italic leading-relaxed text-gold">
              {player.editorial.similarEnergy}
            </p>
          </section>
        ) : null}

        <SecondaryDetails player={player} />

        <div className="flex flex-wrap items-center gap-3 pt-2">
          {player.isCaptain ? (
            <Badge variant="group" className="h-auto gap-1.5 rounded-sm px-3 py-1">
              <Shield className="h-3.5 w-3.5" aria-hidden />
              Captain
            </Badge>
          ) : null}
          {player.enriched ? (
            <Badge variant="group" className="h-auto gap-1.5 rounded-sm px-3 py-1">
              <Footprints className="h-3.5 w-3.5" aria-hidden />
              Live squad data
            </Badge>
          ) : null}
          <Link
            href={player.teamHref}
            className="inline-flex items-center gap-2 rounded-sm border border-gold/25 px-4 py-2 text-sm font-semibold text-gold transition-colors hover:border-gold/50 hover:text-foreground"
          >
            <MapPin className="h-4 w-4" aria-hidden />
            View {player.nation} at the World Cup
          </Link>
        </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function PlayerHeroBadges({ player }: { player: ExplorePlayerCard }) {
  return (
    <div className="mt-4 flex flex-wrap items-center gap-2">
      <Badge variant="meta">
        {player.nation}
      </Badge>
      <Badge variant="playerMeta">
        {player.position}
      </Badge>
      {player.isCaptain ? (
        <Badge variant="code" className="bg-gold/15 text-gold">
          Captain
        </Badge>
      ) : null}
      {player.jerseyNumber != null ? (
        <Badge variant="code">
          #{player.jerseyNumber}
        </Badge>
      ) : null}
    </div>
  );
}
