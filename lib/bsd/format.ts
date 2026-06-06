const BSD_IMG_BASE = "https://sports.bzzoiro.com/img";

export type BsdImageOptions = {
  /** Sortitoutsi cut-out face pack — falls back to standard portrait when unavailable. */
  cutout?: boolean;
  /** Strip flat white background for compositing over coloured surfaces. */
  transparent?: boolean;
};

/** Cut-out portrait with transparent background — ideal for hero cards and avatars. */
export const BSD_PLAYER_PORTRAIT_OPTIONS: BsdImageOptions = {
  cutout: true,
  transparent: true,
};

function bsdImageQuery(options?: BsdImageOptions): string {
  if (!options) {
    return "";
  }

  const params = new URLSearchParams();
  if (options.cutout) {
    params.set("sor", "true");
  }
  if (options.transparent) {
    params.set("bg", "transparent");
  }

  const query = params.toString();
  return query ? `?${query}` : "";
}

export function playerImageUrl(
  playerId: number,
  options: BsdImageOptions = BSD_PLAYER_PORTRAIT_OPTIONS,
) {
  return `${BSD_IMG_BASE}/player/${playerId}/${bsdImageQuery(options)}`;
}

export function teamImageUrl(teamId: number) {
  return `${BSD_IMG_BASE}/team/${teamId}/`;
}

export function formatPlayerMetaLine(input: {
  detailedPosition?: string | null;
  club?: string | null;
  age?: number | null;
  heightCm?: number | null;
  preferredFoot?: string | null;
  marketValueEur?: number | null;
  includeClubWhenPositionMissing?: boolean;
}) {
  const marketValue = formatMarketValueEur(input.marketValueEur);
  const position = input.detailedPosition ?? null;
  const club = input.club ?? null;

  return [
    position ?? (input.includeClubWhenPositionMissing ? club : null),
    position && club ? club : null,
    input.age ? `Age ${input.age}` : null,
    input.heightCm ? `${input.heightCm} cm` : null,
    input.preferredFoot ? `${input.preferredFoot} foot` : null,
    marketValue,
  ]
    .filter(Boolean)
    .join(" · ");
}

export function formatMarketValueEur(value: number | null | undefined) {
  if (value == null) {
    return null;
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "EUR",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}
