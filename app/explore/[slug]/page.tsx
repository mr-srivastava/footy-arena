import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoryContent } from "@/components/explore/category-content";
import { ContentContainer } from "@/components/content-container";
import { DiscoveryCard } from "@/components/discovery-card";
import { PageHero } from "@/components/page-hero";
import { PageShell } from "@/components/page-shell";
import { SectionHeading } from "@/components/section-heading";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import {
  getCategoryImage,
  getCategoryPlayerSlugs,
  getDiscoveryCategory,
  getDiscoveryCategorySlugs,
  getPlayersBySlugs,
} from "@/lib/discovery";
import { getWorldCupTeams } from "@/lib/openfootball/teams";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getDiscoveryCategorySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getDiscoveryCategory(slug);
  if (!category) return { title: "Explore - Footy Arena" };
  return {
    title: `${category.title} - Footy Arena`,
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
        <PageHero
          variant="detail"
          backHref="/explore"
          backLabel="Explore"
          bannerImage={getCategoryImage(category.slug)}
          bannerAlt={`${category.title} atmosphere`}
        >
          <SectionHeading
            as="h1"
            className="mb-0"
            eyebrow={category.tagline}
            title={category.title.toUpperCase()}
            subtitle={category.description}
          />
        </PageHero>

        <CategoryContent slug={category.slug} players={players} byCode={byCode} />

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
