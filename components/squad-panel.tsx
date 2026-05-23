import { ClipboardList, UserRound } from "lucide-react";
import type { TeamSquad } from "@/lib/tournament/types";

const positionLabels: Record<string, string> = {
  GK: "Goalkeepers",
  DF: "Defenders",
  MF: "Midfielders",
  FW: "Forwards",
};

const positionOrder = ["GK", "DF", "MF", "FW"] as const;

export function SquadPanel({ squad }: { squad: TeamSquad }) {
  const playersByPosition = positionOrder.map((position) => ({
    position,
    label: positionLabels[position],
    players: squad.players.filter((player) => player.position === position),
  }));

  const hasPlayers = squad.players.length > 0;

  return (
    <section className="space-y-6">
      {squad.manager ? (
        <div className="glass-panel rounded-xl p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">
            Head coach
          </p>
          <div className="mt-3 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/12 ring-1 ring-gold/25">
              <UserRound className="h-6 w-6 text-gold" aria-hidden />
            </div>
            <div>
              <p className="font-display text-2xl tracking-wide text-foreground">
                {squad.manager.name.toUpperCase()}
              </p>
              {squad.manager.nationality ? (
                <p className="mt-0.5 text-sm text-muted">
                  {squad.manager.nationality}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}

      <div className="glass-panel rounded-xl p-5">
        <div className="flex items-center gap-2">
          <ClipboardList className="h-5 w-5 text-pitch-bright" aria-hidden />
          <h2 className="font-display text-2xl tracking-wide text-foreground">
            SQUAD
          </h2>
        </div>

        {hasPlayers ? (
          <div className="mt-6 space-y-6">
            {playersByPosition.map(
              ({ position, label, players }) =>
                players.length > 0 && (
                  <div key={position}>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-gold">
                      {label}
                    </h3>
                    <ul className="mt-3 divide-y divide-white/6">
                      {players.map((player) => (
                        <li
                          key={`${player.name}-${player.number ?? ""}`}
                          className="flex items-center justify-between gap-3 py-2.5 first:pt-0"
                        >
                          <div className="min-w-0">
                            <p className="font-medium text-foreground">
                              {player.name}
                            </p>
                            {player.club ? (
                              <p className="text-xs text-muted">{player.club}</p>
                            ) : null}
                          </div>
                          {player.number ? (
                            <span className="font-mono text-sm text-muted">
                              {player.number}
                            </span>
                          ) : null}
                        </li>
                      ))}
                    </ul>
                  </div>
                ),
            )}
          </div>
        ) : (
          <p className="mt-4 text-sm leading-relaxed text-muted">
            {squad.status === "announced"
              ? "Manager confirmed — full player roster will be added as squads are officially published."
              : "Squad and coaching staff to be confirmed closer to the tournament."}
          </p>
        )}
      </div>
    </section>
  );
}
