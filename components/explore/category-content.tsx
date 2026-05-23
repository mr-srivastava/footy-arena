import { PlayerCard } from "@/components/player-card";
import { LostGloriesGrid } from "@/components/explore/lost-glories-grid";
import { RisingUnderdogsGrid } from "@/components/explore/rising-underdogs-grid";
import { TacticalIdentitiesGrid } from "@/components/explore/tactical-identities-grid";
import type {
  DiscoveryCategorySlug,
  PlayerProfile,
} from "@/lib/discovery/types";
import type { Team } from "@/lib/openfootball/types";

const SPECIALIZED_CATEGORY_SLUGS = new Set<DiscoveryCategorySlug>([
  "lost-glories",
  "rising-underdogs",
  "tactical-identities",
]);

type CategoryContentProps = {
  slug: DiscoveryCategorySlug;
  players: PlayerProfile[];
  byCode: Map<string, Team>;
};

export function CategoryContent({ slug, players, byCode }: CategoryContentProps) {
  return (
    <>
      {slug === "lost-glories" ? <LostGloriesGrid byCode={byCode} /> : null}
      {slug === "rising-underdogs" ? (
        <RisingUnderdogsGrid byCode={byCode} />
      ) : null}
      {slug === "tactical-identities" ? (
        <TacticalIdentitiesGrid byCode={byCode} />
      ) : null}

      {players.length > 0 ? (
        <div className="lazy-grid grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {players.map((player) => (
            <PlayerCard key={player.slug} player={player} />
          ))}
        </div>
      ) : null}

      {!SPECIALIZED_CATEGORY_SLUGS.has(slug) && players.length === 0 ? (
        <p className="text-muted">Content coming soon for this category.</p>
      ) : null}
    </>
  );
}
