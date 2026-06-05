import { PlayerSpotlightCard } from "@/components/player-spotlight-card";
import { getPlayerImage } from "@/lib/discovery";
import type { PlayerProfile } from "@/lib/discovery/types";

export function PlayerCard({ player }: { player: PlayerProfile }) {
  const image = getPlayerImage(player.slug);

  return (
    <PlayerSpotlightCard
      href={`/players/${player.slug}`}
      displayName={player.name}
      nation={player.nation}
      position={player.position}
      watermark={player.nation.slice(0, 3).toUpperCase()}
      image={image ? { kind: "portrait", src: image } : undefined}
      archetype={player.archetype}
      summary={player.whyExcited}
      footer={`Watch for: ${player.watchFor}`}
    />
  );
}
