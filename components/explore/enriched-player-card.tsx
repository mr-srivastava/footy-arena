import { PlayerSpotlightCard } from "@/components/player-spotlight-card";
import { exploreCardSubtitle } from "@/lib/explore/load-players";
import type { ExplorePlayerCard } from "@/lib/explore/types";

export function EnrichedPlayerCard({ player }: { player: ExplorePlayerCard }) {
  const displayName = player.shortName ?? player.name;
  const subtitle = exploreCardSubtitle(player);
  const summary = player.editorial?.whyExcited ?? subtitle;
  const footer = player.editorial?.watchFor
    ? `Watch for: ${player.editorial.watchFor}`
    : "View player profile";

  return (
    <PlayerSpotlightCard
      href={player.playerHref}
      displayName={displayName}
      nation={player.nation}
      nationTeamId={player.nationBsdTeamId}
      position={player.position}
      watermark={player.fifaCode}
      image={
        player.imageUrl
          ? {
              kind: "image",
              src: player.imageUrl,
              sizes: "(max-width: 640px) 46vw, 196px",
            }
          : undefined
      }
      archetype={player.editorial?.archetype}
      summary={summary}
      footer={footer}
    />
  );
}
