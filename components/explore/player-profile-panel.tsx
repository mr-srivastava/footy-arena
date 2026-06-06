import {
  Activity,
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
import {
  DetailList,
  DetailListItem,
  DetailListRow,
} from "@/components/detail-list";
import { StatCard } from "@/components/stat-card";
import { SubsectionTitle } from "@/components/subsection-title";
import { Badge } from "@/components/ui/badge";
import { TeamCrest } from "@/components/team-crest";
import { formatMarketValueEur } from "@/lib/bsd/format";
import { exploreCardSubtitle } from "@/lib/explore/load-players";
import type { ExplorePlayerCard } from "@/lib/explore/types";

function HeadlineStats({ player }: { player: ExplorePlayerCard }) {
  const marketValue = formatMarketValueEur(player.marketValueEur);
  const stats = [
    player.formRating != null
      ? { label: "Form", value: player.formRating.toFixed(2), icon: Activity }
      : null,
    player.seasonAverageRating != null
      ? {
          label: "Season",
          value: player.seasonAverageRating.toFixed(2),
          icon: TrendingUp,
        }
      : null,
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
    player.nationalTeamRecord
      ? {
          label: "Caps / Goals",
          value: `${player.nationalTeamRecord.caps}/${player.nationalTeamRecord.goals}`,
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
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
      {stats.map((stat) => (
        <StatCard
          key={stat.label}
          label={stat.label}
          value={stat.value}
          icon={stat.icon}
          layout="stacked"
        />
      ))}
    </div>
  );
}

function FormGuide({ player }: { player: ExplorePlayerCard }) {
  if (!player.recentAppearances?.length) {
    return null;
  }

  return (
    <section className="rounded-2xl border border-line-strong bg-artifact-muted p-6 shadow-card md:p-8">
      <SubsectionTitle level="label" tone="gold">
        Form guide
      </SubsectionTitle>
      <DetailList className="mt-4">
        {player.recentAppearances.map((appearance, index) => {
          const details = [
            appearance.rating != null
              ? `Rating ${appearance.rating.toFixed(1)}`
              : null,
            appearance.goals
              ? `${appearance.goals} goal${appearance.goals === 1 ? "" : "s"}`
              : null,
            appearance.assists
              ? `${appearance.assists} assist${appearance.assists === 1 ? "" : "s"}`
              : null,
          ]
            .filter(Boolean)
            .join(" · ");

          return (
            <DetailListItem
              key={`${appearance.eventId ?? "appearance"}-${index}`}
              className="flex items-center justify-between gap-4 text-sm"
            >
              <span className="flex min-w-0 items-center gap-2.5 text-muted-foreground">
                <TeamCrest
                  teamId={appearance.opponentTeamId}
                  name={appearance.opponentName ?? undefined}
                  size="sm"
                />
                <span className="min-w-0 truncate">
                  {appearance.opponentName ?? "Opponent TBC"}
                  {details ? ` · ${details}` : ""}
                </span>
              </span>
              <span className="shrink-0 font-medium text-foreground">
                {appearance.result ?? "—"}
              </span>
            </DetailListItem>
          );
        })}
      </DetailList>
    </section>
  );
}

function PerformanceDetail({ player }: { player: ExplorePlayerCard }) {
  if (!(player.strengths?.length || player.weaknesses?.length)) {
    return null;
  }

  return (
    <section className="rounded-2xl border border-line-strong bg-artifact-muted p-6 shadow-card md:p-8">
      <SubsectionTitle level="label">Performance detail</SubsectionTitle>
      {player.strengths?.length ? (
        <div className="mt-4">
          <p className="broadcast-label text-gold">Strengths</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {player.strengths.map((item) => (
              <Badge
                key={item}
                variant="group"
                className="h-auto rounded-sm px-3 py-1"
              >
                {item}
              </Badge>
            ))}
          </div>
        </div>
      ) : null}
      {player.weaknesses?.length ? (
        <div className="mt-5">
          <p className="broadcast-label text-red">Watchouts</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {player.weaknesses.map((item) => (
              <Badge key={item} variant="code" className="bg-red/10 text-red">
                {item}
              </Badge>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}

function ClubContext({ player }: { player: ExplorePlayerCard }) {
  return (
    <section className="surface-sage-glow rounded-2xl border border-line-strong p-6 shadow-card md:p-8">
      <SubsectionTitle level="label">At the club</SubsectionTitle>
      <p className="mt-4 inline-icon-row gap-3 editorial-title type-card-title text-foreground">
        <TeamCrest
          teamId={player.clubTeamId}
          name={player.club}
          size="md"
          className="mt-1 shrink-0"
        />
        <span className="min-w-0 text-balance">{player.club}</span>
      </p>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {[player.league, player.clubCountry].filter(Boolean).join(" · ")}
      </p>
      <p className="mt-3 text-sm text-muted-foreground">
        {player.detailedPosition || player.position}
        {player.preferredFoot ? ` · ${player.preferredFoot} foot` : ""}
      </p>
    </section>
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
  return (
    <div className="flex flex-col gap-12">
      <HeadlineStats player={player} />

      <div className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
        <article className="rounded-2xl border border-line-strong bg-artifact-muted p-6 shadow-card md:p-9">
          <p className="section-eyebrow">
            <Sparkles className="size-4" />
            Player file
          </p>
          <h2 className="editorial-title type-section-title mt-4">
            {player.editorial?.whyExcited
              ? "Why the tournament is watching"
              : "In the squad"}
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-muted">
            {player.editorial?.whyExcited ?? exploreCardSubtitle(player)}
          </p>
          {player.editorial?.watchFor ? (
            <div className="mt-8 border-l-2 border-gold pl-5">
              <p className="broadcast-label text-gold">Watch for</p>
              <p className="mt-3 text-lg leading-relaxed text-foreground/90">
                {player.editorial.watchFor}
              </p>
            </div>
          ) : null}
          {player.editorial?.similarEnergy ? (
            <p className="mt-8 border-t border-line-soft pt-6 font-heading text-2xl italic text-gold">
              “{player.editorial.similarEnergy}”
            </p>
          ) : null}
        </article>

        <div className="flex flex-col gap-6">
          <ClubContext player={player} />
          <section className="rounded-2xl border border-line-strong bg-artifact-muted p-6 shadow-card">
            <SecondaryDetails player={player} />
          </section>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <FormGuide player={player} />
        <PerformanceDetail player={player} />
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-line-strong bg-artifact-muted p-5">
        {player.isCaptain ? (
          <Badge
            variant="group"
            className="h-auto gap-1.5 rounded-sm px-3 py-1"
          >
            <Shield className="h-3.5 w-3.5" aria-hidden />
            Captain
          </Badge>
        ) : null}
        {player.enriched ? (
          <Badge
            variant="group"
            className="h-auto gap-1.5 rounded-sm px-3 py-1"
          >
            <Footprints className="h-3.5 w-3.5" aria-hidden />
            Live squad data
          </Badge>
        ) : null}
        <Link
          href={player.teamHref}
          className="inline-flex items-center gap-2 rounded-full border border-gold/25 px-4 py-2 text-sm font-semibold text-gold transition-colors hover:border-gold/50 hover:text-foreground"
        >
          <MapPin className="h-4 w-4" aria-hidden />
          View {player.nation} at the World Cup
        </Link>
      </div>
    </div>
  );
}

export function PlayerHeroBadges({ player }: { player: ExplorePlayerCard }) {
  return (
    <div className="mt-4 flex flex-wrap items-center gap-2">
      <Badge variant="meta" className="gap-1.5">
        <TeamCrest
          teamId={player.nationBsdTeamId}
          name={player.nation}
          size="xs"
        />
        {player.nation}
      </Badge>
      <Badge variant="playerMeta">{player.position}</Badge>
      {player.isCaptain ? (
        <Badge variant="code" className="bg-gold/15 text-gold">
          Captain
        </Badge>
      ) : null}
      {player.jerseyNumber != null ? (
        <Badge variant="code">#{player.jerseyNumber}</Badge>
      ) : null}
    </div>
  );
}
