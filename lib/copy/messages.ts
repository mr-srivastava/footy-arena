/** Shared user-facing copy for empty states, errors, and attribution. */

export const MESSAGES = {
  playersPending:
    "Featured players appear here once official squads are published.",
  playersCollectionPending:
    "Collection players appear here once matching squad records are available.",
  playersLoadError:
    "Couldn't load players. Refresh the page or try again in a moment.",
  matchInsightsPending:
    "Match insights aren't available for this fixture yet. Schedule details are still shown above.",
  pageLoadError: {
    title: "This page couldn't load",
    body: "Something went wrong while loading this page. Try again in a moment.",
    retry: "Try again",
    home: "Back to home",
  },
  notFound: {
    title: "Page not found",
    body: "This page doesn't exist or may have moved. Head back to the tournament hub.",
    fixtures: "View fixtures",
    explore: "Explore stories",
    teams: "Browse teams",
  },
  categoryEmpty:
    "More stories for this category are on the way. Browse all discovery routes on Explore.",
  recentResultsEmpty: "No recent results yet.",
  formDataError:
    "Form and results data couldn't load. Try the Overview tab or refresh the page.",
  loading: "Loading…",
  openFootballLink: "openfootball schedule data",
  openFootballFooter: "Schedule data via openfootball · CC0",
  teamDataFooter: "Team data via openfootball · CC0",
} as const;
