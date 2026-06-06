export function playerImageUrl(playerId: number) {
  return `https://sports.bzzoiro.com/img/player/${playerId}/`;
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
