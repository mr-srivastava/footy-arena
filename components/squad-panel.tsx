import { ClipboardList, UserRound } from "lucide-react";
import Image from "next/image";
import { DetailList, DetailListItem } from "@/components/detail-list";
import { EntityIconFrame, EntityRow } from "@/components/entity-row";
import { RevealSection } from "@/components/motion/reveal-section";
import { SubsectionTitle } from "@/components/subsection-title";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { TeamCrest } from "@/components/team-crest";
import { formatPlayerMetaLine, playerImageUrl } from "@/lib/bsd/format";
import type { TeamManagerSummary } from "@/lib/bsd/team-analytics";
import { squadPlayerListKey } from "@/lib/tournament/map-squad";
import { groupPlayersByPosition } from "@/lib/tournament/squads";
import type {
  SquadManager,
  SquadPlayer,
  TeamSquad,
} from "@/lib/tournament/types";

function squadPlayerMeta(player: SquadPlayer) {
  return formatPlayerMetaLine({
    detailedPosition: player.detailedPosition,
    club: player.club,
    age: player.age,
    heightCm: player.heightCm,
    preferredFoot: player.preferredFoot,
    marketValueEur: player.marketValueEur,
    includeClubWhenPositionMissing: true,
  });
}

function availabilityLabel(value: string | null | undefined) {
  if (!value || value === "available") return null;
  return value.replace(/_/g, " ");
}

function mergeManagerProfile(
  squadManager: SquadManager | undefined,
  analyticsManager: TeamManagerSummary | null | undefined,
): SquadManager | undefined {
  const name = squadManager?.name ?? analyticsManager?.name;
  if (!name) return undefined;

  const nationality = squadManager?.nationality ?? analyticsManager?.country;
  const careerRecord = analyticsManager
    ? `${analyticsManager.wins}-${analyticsManager.draws}-${analyticsManager.losses}`
    : squadManager?.careerRecord;

  return {
    name,
    nationality,
    preferredFormation:
      analyticsManager?.preferred_formation ?? squadManager?.preferredFormation,
    tacticalProfile:
      analyticsManager?.tactical_profile ?? squadManager?.tacticalProfile,
    careerRecord,
    winPct: analyticsManager?.win_pct ?? squadManager?.winPct,
  };
}

function SquadPlayerAvatar({ player }: { player: SquadPlayer }) {
  const displayName = player.shortName ?? player.name;

  if (player.bsdPlayerId) {
    return (
      <div className="relative size-12 shrink-0 overflow-hidden rounded-full border border-line-strong bg-navy-light/60">
        <Image
          src={playerImageUrl(player.bsdPlayerId)}
          alt={displayName}
          fill
          className="object-contain p-1"
          sizes="40px"
        />
      </div>
    );
  }

  return (
    <div
      className="flex size-12 shrink-0 items-center justify-center rounded-full border border-line-strong bg-surface-glass"
      aria-hidden
    >
      <UserRound className="h-4 w-4 text-muted-foreground" />
    </div>
  );
}

function HeadCoachCard({ manager }: { manager: SquadManager }) {
  const tacticalLine = [
    manager.preferredFormation,
    manager.tacticalProfile ? manager.tacticalProfile.replace(/_/g, " ") : null,
  ]
    .filter(Boolean)
    .join(" · ");

  const statsLine = [
    manager.careerRecord ? `Career ${manager.careerRecord}` : null,
    manager.winPct != null ? `${manager.winPct}% win rate` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <Card variant="elevated" shape="artifact" className="surface-gold-glow">
      <CardContent className="p-6">
        <SubsectionTitle level="label">Head coach</SubsectionTitle>
        <div className="mt-3 flex items-center gap-4">
          <EntityIconFrame className="border-gold/25 bg-gold/10">
            <UserRound className="h-6 w-6 text-gold" aria-hidden />
          </EntityIconFrame>
          <div>
            <p className="editorial-title type-card-title text-foreground">
              {manager.name}
            </p>
            {manager.nationality ? (
              <p className="mt-0.5 text-sm text-muted-foreground">
                {manager.nationality}
              </p>
            ) : null}
            {tacticalLine ? (
              <p className="mt-1 text-sm capitalize text-muted-foreground">
                {tacticalLine}
              </p>
            ) : null}
            {statsLine ? (
              <p className="mt-1 text-sm text-muted-foreground">{statsLine}</p>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function SquadPanel({
  squad,
  managerAnalytics,
}: {
  squad: TeamSquad;
  managerAnalytics?: TeamManagerSummary | null;
}) {
  const playersByPosition = groupPlayersByPosition(squad);
  const hasPlayers = squad.players.length > 0;
  const coach = mergeManagerProfile(squad.manager, managerAnalytics);

  return (
    <RevealSection className="flex flex-col gap-6">
      {coach ? <HeadCoachCard manager={coach} /> : null}

      <Card
        variant="elevated"
        shape="artifact"
        className="bg-artifact-muted/90"
      >
        <CardContent className="p-6 md:p-7">
          <SubsectionTitle level="panel" icon={ClipboardList}>
            SQUAD
          </SubsectionTitle>

          {hasPlayers ? (
            <div className="mt-6 flex flex-col gap-7">
              {playersByPosition.map(({ position, label, players }) =>
                players.length > 0 ? (
                  <div key={position}>
                    <SubsectionTitle level="label" tone="gold">
                      {label}
                    </SubsectionTitle>
                    <DetailList className="mt-3">
                      {players.map((player, index) => (
                        <DetailListItem
                          key={squadPlayerListKey(player, index)}
                          className="py-0"
                        >
                          <EntityRow
                            href={`/players/${player.profileSlug}`}
                            leading={<SquadPlayerAvatar player={player} />}
                            title={player.shortName ?? player.name}
                            titleClassName="editorial-title text-2xl normal-case tracking-normal"
                            meta={
                              <span className="flex items-center gap-2">
                                <TeamCrest
                                  teamId={player.clubTeamId}
                                  name={player.club}
                                  size="xs"
                                />
                                {squadPlayerMeta(player)}
                              </span>
                            }
                            trailing={
                              <div className="flex items-center gap-2">
                                {player.isCaptain ? (
                                  <Badge
                                    variant="code"
                                    className="bg-gold/15 text-gold"
                                  >
                                    C
                                  </Badge>
                                ) : null}
                                {availabilityLabel(player.availability) ? (
                                  <Badge
                                    variant="code"
                                    className="bg-red/12 text-red"
                                  >
                                    {availabilityLabel(player.availability)}
                                  </Badge>
                                ) : null}
                                {player.number ? (
                                  <Badge variant="code">{player.number}</Badge>
                                ) : null}
                              </div>
                            }
                            showChevron={false}
                            className="grid-cols-[auto_1fr_auto] gap-3 py-3"
                          />
                        </DetailListItem>
                      ))}
                    </DetailList>
                  </div>
                ) : null,
              )}
            </div>
          ) : (
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {squad.status === "announced"
                ? "Manager confirmed - full player roster will be added as squads are officially published."
                : "Squad and coaching staff to be confirmed closer to the tournament."}
            </p>
          )}
        </CardContent>
      </Card>
    </RevealSection>
  );
}
