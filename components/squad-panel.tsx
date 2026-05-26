import { ClipboardList, UserRound } from "lucide-react";
import Image from "next/image";
import { SubsectionTitle } from "@/components/subsection-title";
import { formatMarketValueEur, playerImageUrl } from "@/lib/bsd/format";
import { groupPlayersByPosition } from "@/lib/tournament/squads";
import type { SquadPlayer, TeamSquad } from "@/lib/tournament/types";
import { artifactSurface } from "@/lib/utils";

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
      <div className="relative size-10 shrink-0 overflow-hidden rounded-sm border border-white/10 bg-navy-light/60">
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
      className="flex size-10 shrink-0 items-center justify-center rounded-sm border border-white/10 bg-white/5"
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
        <article className={artifactSurface("bg-artifact-muted p-5")}>
            <SubsectionTitle level="label">Head coach</SubsectionTitle>
            <div className="mt-3 flex items-center gap-4">
              <div className="flex size-12 items-center justify-center rounded-sm border border-gold/25 bg-gold/10">
                <UserRound className="h-6 w-6 text-gold" aria-hidden />
              </div>
              <div>
                <p className="font-display text-2xl tracking-wide text-foreground">
                  {squad.manager.name.toUpperCase()}
                </p>
                {squad.manager.nationality ? (
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {squad.manager.nationality}
                  </p>
                ) : null}
              </div>
            </div>
        </article>
      ) : null}

      <article className={artifactSurface("bg-artifact-muted p-5")}>
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
                    <ul className="mt-3 divide-y divide-white/8 border-y border-white/8">
                      {players.map((player) => (
                        <li key={`${player.name}-${player.number ?? ""}`}>
                          <div className="flex items-center justify-between gap-3 py-3">
                            <div className="flex min-w-0 items-center gap-3">
                              <SquadPlayerAvatar player={player} />
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <p className="font-medium text-foreground">
                                    {player.shortName ?? player.name}
                                  </p>
                                  {player.isCaptain ? (
                                    <span className="rounded-sm bg-gold/15 px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-gold">
                                      C
                                    </span>
                                  ) : null}
                                </div>
                                <p className="mt-0.5 text-xs text-muted-foreground">
                                  {squadPlayerMeta(player)}
                                </p>
                              </div>
                            </div>
                            {player.number ? (
                              <span className="rounded-sm bg-white/5 px-2 py-1 font-mono text-xs text-muted-foreground">
                                {player.number}
                              </span>
                            ) : null}
                          </div>
                        </li>
                      ))}
                    </ul>
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
      </article>
    </section>
  );
}
