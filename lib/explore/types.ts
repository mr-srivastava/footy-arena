import type { PlayerProfile } from "@/lib/discovery/types";

type ExplorePlayerEditorial = Pick<
  PlayerProfile,
  "archetype" | "whyExcited" | "watchFor" | "similarEnergy"
>;

import type {
  PlayerAppearanceSummary,
  PlayerNationalTeamRecord,
} from "@/lib/bsd/enrichment-types";

export type ExplorePlayerCard = {
  id: string;
  slug: string;
  name: string;
  shortName?: string;
  nation: string;
  countrySlug: string;
  nationBsdTeamId?: number | null;
  clubTeamId?: number | null;
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
  formRating?: number | null;
  seasonAverageRating?: number | null;
  recentAppearances?: PlayerAppearanceSummary[];
  nationalTeamRecord?: PlayerNationalTeamRecord | null;
  strengths?: string[];
  weaknesses?: string[];
  enriched: boolean;
  editorial?: ExplorePlayerEditorial;
  playerHref: string;
  teamHref: string;
};
