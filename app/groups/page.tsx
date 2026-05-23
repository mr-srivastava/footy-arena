import { LayoutGrid, Users } from "lucide-react";
import type { Metadata } from "next";
import { GroupCard } from "@/components/group-card";
import { OpenFootballLink } from "@/components/openfootball-link";
import { PageShell } from "@/components/page-shell";
import { SectionHeading } from "@/components/section-heading";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { StatCard } from "@/components/stat-card";
import { GROUP_LETTERS, getWorldCupTeams } from "@/lib/openfootball/teams";

export const metadata: Metadata = {
  title: "Groups — Footy Arena",
  description:
    "FIFA World Cup 2026 group stage — all 12 groups from A to L with four nations each.",
};

export default async function GroupsPage() {
  const { groups, teams } = await getWorldCupTeams();

  return (
    <PageShell>
      <SiteHeader />

      <main className="relative z-10 mx-auto max-w-6xl px-6 pb-8">
        <div className="animate-fade-up py-12 md:py-16">
          <SectionHeading
            as="h1"
            eyebrow="FIFA World Cup 2026"
            title={
              <>
                GROUP <span className="text-gold">STAGE</span>
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
          />

          <div className="animate-fade-up animate-delay-2 mt-8 flex flex-wrap gap-4">
            <StatCard
              value={GROUP_LETTERS.length}
              label="Groups"
              icon={LayoutGrid}
              accent="text-gold"
            />
            <StatCard value={teams.length} label="Nations" icon={Users} />
            <StatCard value={4} label="Teams per group" icon={Users} />
          </div>
        </div>

        <div className="fixture-grid grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map((group) => (
            <GroupCard key={group.letter} group={group} />
          ))}
        </div>
      </main>

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
