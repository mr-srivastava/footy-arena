import { Globe2, LayoutGrid, Users } from "lucide-react";
import type { Metadata } from "next";
import { cache } from "react";
import { ContentContainer } from "@/components/content-container";
import { OpenFootballLink } from "@/components/openfootball-link";
import { PageHero } from "@/components/page-hero";
import { PageShell } from "@/components/page-shell";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { StatCard } from "@/components/stat-card";
import { bsdFetch } from "@/lib/bsd/client";
import { TeamDirectory } from "@/components/teams/team-directory";
import { GROUP_LETTERS, getWorldCupTeams } from "@/lib/openfootball/teams";

export const metadata: Metadata = {
  title: "Teams - Footy Arena",
  description:
    "All 48 nations at FIFA World Cup 2026 - flags, groups, confederations, and squad info.",
};

const countListedManagers = cache(async (teamIds: number[]) => {
  const remaining = new Set(teamIds);
  let offset = 0;
  let matches = 0;

  while (remaining.size > 0) {
    const response = await bsdFetch<{
      next: string | null;
      results: Array<{ current_team_id: number | null }>;
    }>(`managers?limit=200&offset=${offset}`);

    for (const manager of response.results) {
      const teamId = manager.current_team_id;
      if (teamId != null && remaining.has(teamId)) {
        remaining.delete(teamId);
        matches += 1;
      }
    }

    if (!response.next || response.results.length === 0) {
      break;
    }

    offset += response.results.length;
  }

  return matches;
});

export default async function TeamsPage() {
  const { teams } = await getWorldCupTeams();
  const announcedManagers = await countListedManagers(
    teams
      .map((team) => team.bsdTeamId)
      .filter((teamId): teamId is number => teamId != null),
  );
  const confederations = new Set(teams.map((team) => team.confed)).size;

  return (
    <PageShell>
      <SiteHeader />

      <ContentContainer>
        <PageHero
          variant="list"
          eyebrow="FIFA World Cup 2026"
          title={
            <>
              ALL <span className="text-pitch-bright">TEAMS</span>
            </>
          }
          icon={Users}
          titleClassName="md:text-7xl"
          subtitle={
            <>
              Every nation competing in the expanded 48-team tournament. Team
              data from <OpenFootballLink />.
            </>
          }
          stats={
            <>
              <StatCard value={teams.length} label="Nations" icon={Users} />
              <StatCard
                value={GROUP_LETTERS.length}
                label="Groups"
                icon={LayoutGrid}
                accent="text-gold"
              />
              <StatCard
                value={confederations}
                label="Confederations"
                icon={Globe2}
              />
              <StatCard
                value={announcedManagers}
                label="Managers listed"
                icon={Users}
                accent="text-teal"
              />
            </>
          }
        />

        <TeamDirectory teams={teams} />
      </ContentContainer>

      <SiteFooter
        center={
          <p className="text-center">
            Team data via <OpenFootballLink showIcon={false} /> · CC0
          </p>
        }
      />
    </PageShell>
  );
}
