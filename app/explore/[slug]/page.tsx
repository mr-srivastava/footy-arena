import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ContentContainer } from "@/components/content-container";
import { DiscoveryCard } from "@/components/discovery-card";
import { PageHero } from "@/components/page-hero";
import { PageShell } from "@/components/page-shell";
import { PlayerCard } from "@/components/player-card";
import { SectionHeading } from "@/components/section-heading";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { TeamNarrativePanel } from "@/components/team-narrative-panel";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  getCategoryPlayerSlugs,
  getDiscoveryCategory,
  getPlayersBySlugs,
  RISING_UNDERDOG_ENTRIES,
  TEAM_NARRATIVE_ENTRIES,
} from "@/lib/discovery";
import { LOST_GLORIES } from "@/lib/discovery/seed/categories";
import type { DiscoveryCategorySlug } from "@/lib/discovery/types";
import { getWorldCupTeams } from "@/lib/openfootball/teams";

const CATEGORY_SLUGS: DiscoveryCategorySlug[] = [
  "lost-glories",
  "rising-underdogs",
  "next-generation",
  "legends-legacy",
  "players-to-watch",
  "tactical-identities",
];

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return CATEGORY_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getDiscoveryCategory(slug);
  if (!category) return { title: "Explore — Footy Arena" };
  return {
    title: `${category.title} — Footy Arena`,
    description: category.description,
  };
}

export default async function ExploreCategoryPage({ params }: PageProps) {
  const [{ slug }, { byCode }] = await Promise.all([params, getWorldCupTeams()]);
  const category = getDiscoveryCategory(slug);
  if (!category) notFound();

  const playerSlugs = getCategoryPlayerSlugs(category.slug);
  const players = getPlayersBySlugs(playerSlugs);

  return (
    <PageShell>
      <SiteHeader />

      <ContentContainer>
        <PageHero variant="detail" backHref="/explore" backLabel="Explore">
          <SectionHeading
            as="h1"
            className="mb-0"
            eyebrow={category.tagline}
            title={category.title.toUpperCase()}
            subtitle={category.description}
          />
        </PageHero>

        {category.slug === "lost-glories" ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {LOST_GLORIES.map((entry) => {
              const teamHref = entry.fifaCode
                ? `/teams/${entry.fifaCode.toLowerCase()}`
                : undefined;
              const team = entry.fifaCode
                ? byCode.get(entry.fifaCode)
                : undefined;

              return (
                <Card key={entry.nation} padding="none" className="h-full">
                  <CardContent className="flex h-full flex-col p-6">
                    <CardTitle className="font-display text-3xl tracking-wide text-foreground">
                      {entry.nation.toUpperCase()}
                    </CardTitle>
                    <dl className="mt-5 flex flex-col gap-4 text-sm">
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-widest text-gold">
                        Then
                      </dt>
                      <dd className="mt-1 leading-relaxed text-muted">
                        {entry.then}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-widest text-muted">
                        What changed
                      </dt>
                      <dd className="mt-1 leading-relaxed text-muted">
                        {entry.whatChanged}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-widest text-muted">
                        Now
                      </dt>
                      <dd className="mt-1 leading-relaxed text-muted">
                        {entry.currentStatus}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-widest text-pitch-bright">
                        Hope ahead
                      </dt>
                      <dd className="mt-1 leading-relaxed text-foreground/90">
                        {entry.hopeForTheFuture}
                      </dd>
                    </div>
                  </dl>
                  {teamHref && team ? (
                    <Link
                      href={teamHref}
                      className="mt-5 text-sm font-semibold text-gold hover:text-foreground"
                    >
                      View {team.displayName} →
                    </Link>
                  ) : null}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : null}

        {category.slug === "rising-underdogs" ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {RISING_UNDERDOG_ENTRIES.map((entry) => {
              const { breakoutPlayers } = entry;
              const teamHref = entry.fifaCode
                ? `/teams/${entry.fifaCode.toLowerCase()}`
                : undefined;
              const team = entry.fifaCode
                ? byCode.get(entry.fifaCode)
                : undefined;

              return (
                <Card key={entry.nation} padding="none" className="h-full">
                  <CardContent className="flex h-full flex-col p-6">
                    <CardTitle className="font-display text-3xl tracking-wide text-foreground">
                      {entry.nation.toUpperCase()}
                    </CardTitle>
                    <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                      {entry.whyTheyMatter}
                    </p>
                    <p className="mt-3 rounded-xl bg-pitch/10 px-4 py-3 text-sm text-pitch-bright">
                      {entry.keyIdentity}
                    </p>
                    <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                      {entry.whyCasualFansShouldWatch}
                    </p>
                  {breakoutPlayers.length > 0 ? (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {breakoutPlayers.map((player) => (
                        <Link
                          key={player.slug}
                          href={`/players/${player.slug}`}
                          className="rounded-full border border-white/10 px-3 py-1 text-sm hover:text-gold"
                        >
                          {player.name}
                        </Link>
                      ))}
                    </div>
                  ) : null}
                  {teamHref && team ? (
                    <Link
                      href={teamHref}
                      className="mt-auto pt-5 text-sm font-semibold text-gold hover:text-foreground"
                    >
                      View {team.displayName} →
                    </Link>
                  ) : null}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : null}

        {category.slug === "tactical-identities" ? (
          <div className="grid gap-8 lg:grid-cols-2">
            {TEAM_NARRATIVE_ENTRIES.map(({ narrative, keyPlayers }) => {
              const team = byCode.get(narrative.fifaCode);

              return (
                <div key={narrative.fifaCode} className="space-y-4">
                  <TeamNarrativePanel
                    narrative={narrative}
                    keyPlayers={keyPlayers}
                  />
                  {team ? (
                    <Link
                      href={`/teams/${team.slug}`}
                      className="inline-flex text-sm font-semibold text-gold hover:text-foreground"
                    >
                      Full {team.displayName} profile →
                    </Link>
                  ) : null}
                </div>
              );
            })}
          </div>
        ) : null}

        {players.length > 0 ? (
          <div className="lazy-grid grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {players.map((player) => (
              <PlayerCard key={player.slug} player={player} />
            ))}
          </div>
        ) : null}

        {category.slug !== "tactical-identities" &&
        players.length === 0 &&
        category.slug !== "lost-glories" &&
        category.slug !== "rising-underdogs" ? (
          <p className="text-muted">Content coming soon for this category.</p>
        ) : null}

        <div className="mt-16 border-t border-white/8 pt-10">
          <p className="text-sm text-muted">More to discover</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <DiscoveryCard
              title="All collections"
              description="Curated player lists for every type of fan."
              href="/explore#collections"
            />
            <DiscoveryCard
              title="Stats, translated"
              description="Understand xG, xA, and more in plain language."
              href="/explore"
            />
          </div>
        </div>
      </ContentContainer>

      <SiteFooter />
    </PageShell>
  );
}
