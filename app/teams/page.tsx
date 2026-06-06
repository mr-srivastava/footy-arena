import { Globe2, LayoutGrid, Users } from "lucide-react";
import type { Metadata } from "next";
import { ContentContainer } from "@/components/content-container";
import { OpenFootballLink } from "@/components/openfootball-link";
import { PageHero } from "@/components/page-hero";
import { PageShell } from "@/components/page-shell";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { StatCard } from "@/components/stat-card";
import { TeamDirectory } from "@/components/teams/team-directory";
import { GROUP_LETTERS, getWorldCupTeams } from "@/lib/openfootball/teams";

export const revalidate = 1800;

export const metadata: Metadata = {
  title: "Teams - Footy Arena",
  description:
    "All 48 nations at FIFA World Cup 2026 - flags, groups, confederations, and squad info.",
};

export default async function TeamsPage() {
  const { teams } = await getWorldCupTeams();
  const linkedTeams = teams.filter((team) => team.bsdTeamId != null).length;
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
                value={linkedTeams}
                label="Linked squads"
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
