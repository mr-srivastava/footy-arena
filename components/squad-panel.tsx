import { ClipboardList, UserRound } from "lucide-react";
import Image from "next/image";
import { DetailList, DetailListItem } from "@/components/detail-list";
import { EntityIconFrame, EntityRow } from "@/components/entity-row";
import { SubsectionTitle } from "@/components/subsection-title";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatMarketValueEur, playerImageUrl } from "@/lib/bsd/format";
import { groupPlayersByPosition } from "@/lib/tournament/squads";
import type { SquadPlayer, TeamSquad } from "@/lib/tournament/types";

function squadPlayerMeta(player: SquadPlayer) {
  const marketValue = formatMarketValueEur(player.marketValueEur);

  return [
    player.detailedPosition ?? player.club,
    player.club && player.detailedPosition ? player.club : null,
    player.age ? `Age ${player.age}` : null,
    player.heightCm ? `${player.heightCm} cm` : null,
    player.preferredFoot ? `${player.preferredFoot} foot` : null,
    marketValue,
  ]
    .filter(Boolean)
    .join(" · ");
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

export function SquadPanel({ squad }: { squad: TeamSquad }) {
  const playersByPosition = groupPlayersByPosition(squad);
  const hasPlayers = squad.players.length > 0;

  return (
    <section className="flex flex-col gap-6">
      {squad.manager ? (
        <Card variant="elevated" shape="artifact" className="surface-gold-glow">
          <CardContent className="p-6">
            <SubsectionTitle level="label">Head coach</SubsectionTitle>
            <div className="mt-3 flex items-center gap-4">
              <EntityIconFrame className="border-gold/25 bg-gold/10">
                <UserRound className="h-6 w-6 text-gold" aria-hidden />
              </EntityIconFrame>
              <div>
                <p className="editorial-title type-card-title text-foreground">
                  {squad.manager.name}
                </p>
                {squad.manager.nationality ? (
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {squad.manager.nationality}
                  </p>
                ) : null}
              </div>
            </div>
          </CardContent>
        </Card>
      ) : null}

      <Card variant="elevated" shape="artifact" className="bg-artifact-muted/90">
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
                      {players.map((player) => (
                        <DetailListItem
                          key={`${player.name}-${player.number ?? ""}`}
                          className="py-0"
                        >
                          <EntityRow
                            href={`/players/${player.profileSlug}`}
                            leading={<SquadPlayerAvatar player={player} />}
                            title={player.shortName ?? player.name}
                            titleClassName="editorial-title text-2xl normal-case tracking-normal"
                            meta={squadPlayerMeta(player)}
                            trailing={
                              <div className="flex items-center gap-2">
                                {player.isCaptain ? (
                                  <Badge variant="code" className="bg-gold/15 text-gold">
                                    C
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
    </section>
  );
}
