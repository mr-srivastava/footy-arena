export const DEFAULT_FORMATION = "4-3-3";

export type FormationSlots = {
  df: number;
  cdm: number;
  cm: number;
  cam: number;
  fw: number;
  label: string;
};

export function normalizeFormation(value: string | null | undefined): string {
  const match = value?.match(/(\d+(?:\s*[-–]\s*\d+)+)/)?.[0];
  return match?.replace(/\s/g, "") ?? DEFAULT_FORMATION;
}

export function parseFormationSlots(
  formation: string | null | undefined,
  fallbackLabel: string = DEFAULT_FORMATION,
): FormationSlots {
  const label = formation?.trim()
    ? normalizeFormation(formation)
    : fallbackLabel;
  const numbers = label.match(/\d+/g)?.map(Number).filter(Number.isFinite);

  if (!numbers || numbers.length < 3) {
    return { df: 4, cdm: 0, cm: 3, cam: 0, fw: 3, label: DEFAULT_FORMATION };
  }

  if (numbers.length === 3) {
    return {
      df: numbers[0],
      cdm: 0,
      cm: numbers[1],
      cam: 0,
      fw: numbers[2],
      label,
    };
  }

  if (numbers.length === 4) {
    return {
      df: numbers[0],
      cdm: numbers[1],
      cm: 0,
      cam: numbers[2],
      fw: numbers[3],
      label,
    };
  }

  return {
    df: numbers[0],
    cdm: numbers[1],
    cm: numbers[2],
    cam: numbers[3],
    fw: numbers[4],
    label,
  };
}
