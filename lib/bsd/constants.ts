export const BSD_BASE_URL = 'https://sports.bzzoiro.com/api/v2/';
export const BSD_IMAGE_BASE = 'https://sports.bzzoiro.com/img';
export const BSD_WORLD_CUP_LEAGUE_ID = 16;

export const BSD_POSITION_LABELS: Record<string, string> = {
  G: 'Goalkeeper',
  GK: 'Goalkeeper',
  D: 'Defender',
  M: 'Midfielder',
  F: 'Forward',
};

export const BSD_POSITION_GROUPS: Record<string, string> = {
  G: 'GK',
  GK: 'GK',
  D: 'DF',
  M: 'MF',
  F: 'FW',
};

export const BSD_PREFERRED_FOOT_LABELS: Record<string, string> = {
  R: 'Right',
  L: 'Left',
  right: 'Right',
  left: 'Left',
};

export const BSD_ALLOWED_PATH_PREFIXES = [
  'events',
  'worldcup',
  'leagues',
  'teams',
  'players',
  'managers',
  'odds',
  'predictions',
  'referees',
  'venues',
  'tv-channels',
  'broadcasts',
  'social',
  'bookmakers',
] as const;
