import type { MetricTranslation } from "../types";

export const METRIC_TRANSLATIONS: MetricTranslation[] = [
  {
    metric: "xG",
    slug: "xg",
    friendlyLabel: "Chance Quality",
    explanation: "Measures how likely a shot was to become a goal.",
    casualTranslation: "Gets into dangerous scoring positions.",
  },
  {
    metric: "xA",
    slug: "xa",
    friendlyLabel: "Chance Creation",
    explanation: "Measures how likely a pass was to become an assist.",
    casualTranslation: "Creates dangerous opportunities for teammates.",
  },
  {
    metric: "Progressive Carries",
    slug: "progressive-carries",
    friendlyLabel: "Ball Progression",
    explanation: "Tracks how often players move the ball into dangerous areas.",
    casualTranslation: "Pushes attacks forward personally.",
  },
  {
    metric: "Pressures",
    slug: "pressures",
    friendlyLabel: "Defensive Pressure",
    explanation: "Tracks how aggressively players challenge opponents.",
    casualTranslation: "Constantly disrupts opposition buildup.",
  },
];
