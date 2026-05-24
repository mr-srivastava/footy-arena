import { fetchQuery } from "convex/nextjs";
import { Globe2, LayoutGrid, Users } from "lucide-react";
import type { Metadata } from "next";
import { ContentContainer } from "@/components/content-container";
import { OpenFootballLink } from "@/components/openfootball-link";
import { PageHero } from "@/components/page-hero";
import { PageShell } from "@/components/page-shell";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { StatCard } from "@/components/stat-card";
import { TeamCard } from "@/components/team-card";
import { api } from "@/convex/_generated/api";
import { GROUP_LETTERS, getWorldCupTeams } from "@/lib/openfootball/teams";

export const metadata: Metadata = {
  title: "Teams - Footy Arena",
  description:
    "All 48 nations at FIFA World Cup 2026 - flags, groups, confederations, and squad info.",
};

export default async function TeamsPage() {
  const [{ teams }, announcedManagers] = await Promise.all([
    getWorldCupTeams(),
    fetchQuery(api.squads.countAnnounced, {}),
  ]);
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

        <div className="reveal-grid lazy-grid grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {teams.map((team) => (
            <TeamCard key={team.fifa_code} team={team} />
          ))}
        </div>
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
