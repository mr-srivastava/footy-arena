import { bsdFetch, hasBsdToken } from "@/lib/bsd/client";

export type BsdPlayerDetail = {
  id: number;
  name: string;
  short_name: string;
  position: string;
  specific_position: string | null;
  jersey_number: number | null;
  date_of_birth: string;
  height_cm: number | null;
  weight_kg: number | null;
  preferred_foot: string | null;
  nationality: string;
  current_team_id: number | null;
  national_team_id: number | null;
  market_value_eur: number | null;
  contract_until: string | null;
  availability: string;
  strengths?: string[];
  weaknesses?: string[];
};

export async function fetchBsdPlayerDetail(
  playerId: number | null | undefined,
): Promise<BsdPlayerDetail | null> {
  if (!playerId || !hasBsdToken()) {
    return null;
  }

  try {
    return await bsdFetch<BsdPlayerDetail>(`players/${playerId}`);
  } catch {
    return null;
  }
}

export function bsdPlayerDetailToListItem(detail: BsdPlayerDetail) {
  return {
    ...detail,
    specific_position: detail.specific_position ?? detail.position,
  };
}
