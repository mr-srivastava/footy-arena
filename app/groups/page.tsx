import { LayoutGrid, Users } from "lucide-react";
import type { Metadata } from "next";
import { ContentContainer } from "@/components/content-container";
import { GroupCard } from "@/components/group-card";
import { OpenFootballLink } from "@/components/openfootball-link";
import { PageHero } from "@/components/page-hero";
import { PageShell } from "@/components/page-shell";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { StatCard } from "@/components/stat-card";
import { GROUP_LETTERS, getWorldCupTeams } from "@/lib/openfootball/teams";

export const metadata: Metadata = {
  title: "Groups · Footy Arena",
  description:
    "FIFA World Cup 2026 group stage - all 12 groups from A to L with four nations each.",
};

export default async function GroupsPage() {
  const { groups, teams } = await getWorldCupTeams();

  return (
    <PageShell>
      <SiteHeader />

      <ContentContainer>
        <PageHero
          variant="list"
          eyebrow="FIFA World Cup 2026"
          title={
            <>
              GROUP <span className="text-pitch-bright">STAGE</span>
            </>
          }
          icon={LayoutGrid}
          titleClassName="md:text-7xl"
          subtitle={
            <>
              Twelve groups of four in the expanded 48-team format. Data from{" "}
              <OpenFootballLink />.
            </>
          }
          stats={
            <>
              <StatCard
                value={GROUP_LETTERS.length}
                label="Groups"
                icon={LayoutGrid}
                accent="text-gold"
              />
              <StatCard value={teams.length} label="Nations" icon={Users} />
              <StatCard value={4} label="Teams per group" icon={Users} />
            </>
          }
        />

        <div className="reveal-grid grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map((group) => (
            <GroupCard key={group.letter} group={group} />
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
