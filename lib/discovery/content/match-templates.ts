import type { MatchStoryTemplate } from "../types";

export const MATCH_STORY_TEMPLATES: MatchStoryTemplate[] = [
  {
    slug: "legacy-match",
    title: "Legacy Match",
    narrative: "A battle between experienced legends and the next generation.",
    watchFor: [
      "Leadership moments",
      "Tactical maturity",
      "Emotional intensity",
    ],
  },
  {
    slug: "underdog-challenge",
    title: "Underdog Challenge",
    narrative:
      "An organized underdog attempts to frustrate a traditional powerhouse.",
    watchFor: ["Defensive resilience", "Counterattacks", "Crowd momentum"],
  },
  {
    slug: "tactical-clash",
    title: "Tactical Clash",
    narrative: "Contrasting football philosophies collide.",
    watchFor: ["Possession battles", "Pressing intensity", "Transition speed"],
  },
];
