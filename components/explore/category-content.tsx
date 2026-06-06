import { ExplorePlayersGrid } from "@/components/explore/explore-players-grid";
import { LostGloriesGrid } from "@/components/explore/lost-glories-grid";
import { RisingUnderdogsGrid } from "@/components/explore/rising-underdogs-grid";
import { TacticalIdentitiesGrid } from "@/components/explore/tactical-identities-grid";
import type { DiscoveryCategorySlug } from "@/lib/discovery/types";
import type { Team } from "@/lib/openfootball/types";

const SPECIALIZED_CATEGORY_SLUGS = new Set<DiscoveryCategorySlug>([
  "lost-glories",
  "rising-underdogs",
  "tactical-identities",
]);

type CategoryContentProps = {
  slug: DiscoveryCategorySlug;
  playerSlugs: string[];
  byCode: Map<string, Team>;
};

export function CategoryContent({
  slug,
  playerSlugs,
  byCode,
}: CategoryContentProps) {
  return (
    <>
      {slug === "lost-glories" ? <LostGloriesGrid byCode={byCode} /> : null}
      {slug === "rising-underdogs" ? (
        <RisingUnderdogsGrid byCode={byCode} />
      ) : null}
      {slug === "tactical-identities" ? (
        <TacticalIdentitiesGrid byCode={byCode} />
      ) : null}

      {playerSlugs.length > 0 ? (
        <ExplorePlayersGrid slugs={playerSlugs} />
      ) : null}

      {!SPECIALIZED_CATEGORY_SLUGS.has(slug) && playerSlugs.length === 0 ? (
        <p className="text-muted">Content coming soon for this category.</p>
      ) : null}
    </>
  );
}
