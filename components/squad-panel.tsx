import { ClipboardList, UserRound } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SubsectionTitle } from "@/components/subsection-title";
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
    <section className="flex flex-col gap-6">
      {squad.manager ? (
        <Card padding="none">
          <CardContent className="p-5">
            <SubsectionTitle level="label">Head coach</SubsectionTitle>
            <div className="mt-3 flex items-center gap-4">
              <div className="flex size-12 items-center justify-center rounded-full bg-gold/12 ring-1 ring-gold/25">
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
          </CardContent>
        </Card>
      ) : null}

      <Card padding="none">
        <CardContent className="p-5">
          <SubsectionTitle level="panel" icon={ClipboardList}>
            SQUAD
          </SubsectionTitle>

          {hasPlayers ? (
            <div className="mt-6 flex flex-col gap-6">
              {playersByPosition.map(({ position, label, players }) =>
                players.length > 0 ? (
                  <div key={position}>
                    <SubsectionTitle level="label" tone="gold">
                      {label}
                    </SubsectionTitle>
                    <ul className="mt-3">
                      {players.map((player, index) => (
                        <li key={`${player.name}-${player.number ?? ""}`}>
                          {index > 0 ? <Separator className="my-2.5" /> : null}
                          <div className="flex items-center justify-between gap-3 py-2.5">
                            <div className="min-w-0">
                              <p className="font-medium text-foreground">
                                {player.name}
                              </p>
                              {player.club ? (
                                <p className="text-xs text-muted-foreground">
                                  {player.club}
                                </p>
                              ) : null}
                            </div>
                            {player.number ? (
                              <span className="font-mono text-sm text-muted-foreground">
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
        </CardContent>
      </Card>
    </section>
  );
}
