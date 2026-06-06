import { iso2ForFifa } from "@/lib/bsd/fifa-nation";
import { normalizeTeamName } from "@/lib/teams/normalize-name";
import { WC2026_NATIONS } from "@/lib/teams/wc2026-nations";

function flagFromIso2(iso2: string) {
  return iso2
    .toUpperCase()
    .split("")
    .map((char) => String.fromCodePoint(char.charCodeAt(0) + 127397))
    .join("");
}

const metadataByName = new Map<string, (typeof WC2026_NATIONS)[number]>();

for (const entry of WC2026_NATIONS) {
  const keys = [entry.displayName, ...(entry.aliases ?? [])];
  for (const key of keys) {
    metadataByName.set(normalizeTeamName(key), entry);
  }
}

export function teamSlugFromName(name: string) {
  return normalizeTeamName(name).replace(/\s+/g, "-");
}

export function tryGetTeamMetadata(name: string) {
  return metadataByName.get(normalizeTeamName(name));
}

export function resolveTeamDisplayName(name: string) {
  return tryGetTeamMetadata(name)?.displayName ?? name;
}

export function getTeamMetadata(name: string) {
  const metadata = tryGetTeamMetadata(name);
  if (!metadata) {
    throw new Error(`Missing team metadata for ${name}`);
  }

  const iso2 = iso2ForFifa(metadata.fifaCode);
  if (!iso2) {
    throw new Error(`Missing ISO2 mapping for ${metadata.fifaCode}`);
  }

  return {
    fifaCode: metadata.fifaCode,
    displayName: metadata.displayName,
    confed: metadata.confed,
    continent: metadata.continent,
    aliases: metadata.aliases,
    flag: flagFromIso2(iso2),
  };
}
