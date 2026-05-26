import { Compass, Layers, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import { CollectionCard } from "@/components/collection-card";
import { ContentContainer } from "@/components/content-container";
import { DiscoveryCard } from "@/components/discovery-card";
import { ExplorePlayersGrid } from "@/components/explore/explore-players-grid";
import { MetricTranslationCard } from "@/components/metric-translation-card";
import { PageHero } from "@/components/page-hero";
import { PageSection } from "@/components/page-section";
import { PageShell } from "@/components/page-shell";
import { SectionHeading } from "@/components/section-heading";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { StoryTemplateCard } from "@/components/story-template-card";
import {
  DISCOVERY_COLLECTIONS,
  EXPLORE_HERO_IMAGE,
  getFeaturedPlayerSlugs,
  getHomepageCardImage,
  HOMEPAGE_MODULES,
  MATCH_STORY_TEMPLATES,
  METRIC_TRANSLATIONS,
} from "@/lib/discovery";

export const metadata: Metadata = {
  title: "Explore - Footy Arena",
  description:
    "Discover World Cup 2026 through stories, players, collections, and curated narratives.",
};

export default function ExplorePage() {
  const featuredPlayerSlugs = getFeaturedPlayerSlugs();
  const [startJourney, catchMeUp, nationsToWatch] = HOMEPAGE_MODULES;

  return (
    <PageShell>
      <SiteHeader />

      <ContentContainer>
        <PageHero
          variant="list"
          eyebrow="World Cup Discovery"
          title={
            <>
              EXPLORE <span className="text-pitch-bright">2026</span>
            </>
          }
          icon={Compass}
          titleClassName="md:text-7xl"
          subtitle="Curated stories and live squad intelligence to help you discover the tournament."
          bannerImage={EXPLORE_HERO_IMAGE}
          bannerAlt="World Cup atmosphere"
        />

        <PageSection variant="editorial">
          <SectionHeading
            eyebrow="Get started"
            title={startJourney.title.toUpperCase()}
            icon={Sparkles}
          />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {startJourney.cards.map((card) => (
              <DiscoveryCard
                key={card.href}
                {...card}
                image={getHomepageCardImage(card.href)}
              />
            ))}
          </div>
        </PageSection>

        <PageSection variant="dense">
          <SectionHeading
            eyebrow="New to football?"
            title={catchMeUp.title.toUpperCase()}
          />
          <div className="grid gap-3 sm:grid-cols-2">
            {catchMeUp.cards.map((card) => (
              <DiscoveryCard
                key={card.href}
                {...card}
                image={getHomepageCardImage(card.href)}
              />
            ))}
          </div>
        </PageSection>

        <PageSection variant="stack">
          <SectionHeading eyebrow="Editorial picks" title="FEATURED PLAYERS" />
          <ExplorePlayersGrid
            slugs={featuredPlayerSlugs}
            emptyMessage="Featured players will appear here once World Cup squads are loaded in Convex."
          />
        </PageSection>

        <PageSection variant="stack" id="collections" className="scroll-mt-24">
          <SectionHeading
            eyebrow="Curated lists"
            title="DISCOVERY COLLECTIONS"
            icon={Layers}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            {DISCOVERY_COLLECTIONS.map((collection) => (
              <CollectionCard
                key={collection.slug}
                collection={collection}
                playerCount={collection.playerSlugs.length}
              />
            ))}
          </div>
        </PageSection>

        <PageSection variant="stack">
          <SectionHeading
            eyebrow="Can't miss"
            title={nationsToWatch.title.toUpperCase()}
          />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {nationsToWatch.cards.map((card) => (
              <DiscoveryCard
                key={card.href}
                {...card}
                image={getHomepageCardImage(card.href)}
              />
            ))}
          </div>
        </PageSection>

        <PageSection variant="stack">
          <SectionHeading
            eyebrow="Understand the numbers"
            title="STATS, TRANSLATED"
          />
          <div className="grid gap-4 sm:grid-cols-2">
            {METRIC_TRANSLATIONS.map((metric) => (
              <MetricTranslationCard key={metric.slug} metric={metric} />
            ))}
          </div>
        </PageSection>

        <PageSection variant="stack">
          <SectionHeading
            eyebrow="Match day"
            title="STORY TEMPLATES"
            subtitle="Frameworks for how to watch and appreciate different types of matches."
          />
          <div className="grid gap-4 md:grid-cols-3">
            {MATCH_STORY_TEMPLATES.map((template) => (
              <StoryTemplateCard key={template.slug} template={template} />
            ))}
          </div>
        </PageSection>
      </ContentContainer>

      <SiteFooter />
    </PageShell>
  );
}
