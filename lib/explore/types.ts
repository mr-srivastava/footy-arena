import type { PlayerProfile } from "@/lib/discovery/types";

type ExplorePlayerEditorial = Pick<
  PlayerProfile,
  "archetype" | "whyExcited" | "watchFor" | "similarEnergy"
>;

export type ExplorePlayerCard = {
  id: string;
  slug: string;
  name: string;
  shortName?: string;
  nation: string;
  countrySlug: string;
  fifaCode: string;
  position: string;
  detailedPosition: string;
  club: string;
  league: string;
  clubCountry: string;
  age: number;
  jerseyNumber?: number | null;
  preferredFoot?: string;
  heightCm?: number | null;
  weightKg?: number | null;
  marketValueEur?: number | null;
  contractUntil?: string | null;
  availability?: string;
  dateOfBirth?: string | null;
  isCaptain?: boolean;
  previousWorldCupsCount?: number;
  bsdPlayerId?: number;
  imageUrl?: string;
  enriched: boolean;
  editorial?: ExplorePlayerEditorial;
  playerHref: string;
  teamHref: string;
};
