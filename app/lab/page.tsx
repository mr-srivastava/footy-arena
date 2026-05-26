import { FlaskConical } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchQuery } from "convex/nextjs";
import { PlayerMetadataExplorer } from "@/components/lab/bsd/player-metadata-explorer";
import { ContentContainer } from "@/components/content-container";
import { PageHero } from "@/components/page-hero";
import { PageSection } from "@/components/page-section";
import { PageShell } from "@/components/page-shell";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { api } from "@/convex/_generated/api";
import { hasBsdToken } from "@/lib/bsd/client";
import { toConvexCountrySnapshot } from "@/lib/bsd/convex-snapshots";

export const metadata: Metadata = {
  title: "Lab - Footy Arena",
  description: "Review Convex squads enriched with BSD player metadata.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function LabPage() {
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }

  const countries = await fetchQuery(api.countries.listWithPlayers, {});
  const countrySummaries = countries
    .map(toConvexCountrySnapshot)
    .toSorted(
      (a, b) =>
        a.groupLetter.localeCompare(b.groupLetter) ||
        a.displayName.localeCompare(b.displayName),
    );

  return (
    <PageShell>
      <SiteHeader />

      <ContentContainer>
        <PageHero
          variant="list"
          eyebrow="Convex + BSD review"
          title={
            <>
              PLAYER <span className="text-pitch-bright">METADATA</span>
            </>
          }
          icon={FlaskConical}
          titleClassName="md:text-7xl"
          subtitle="Read teams and players from Convex, enrich each squad member via BSD player APIs, and review matches side-by-side before any database writes."
        />

        <PageSection variant="stack">
          <PlayerMetadataExplorer countries={countrySummaries} hasToken={hasBsdToken()} />
        </PageSection>
      </ContentContainer>

      <SiteFooter />
    </PageShell>
  );
}
