import { Compass, Layers, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import { CollectionCard } from "@/components/collection-card";
import { DiscoveryCard } from "@/components/discovery-card";
import { MetricTranslationCard } from "@/components/metric-translation-card";
import { PageShell } from "@/components/page-shell";
import { PlayerCard } from "@/components/player-card";
import { SectionHeading } from "@/components/section-heading";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import {
  DISCOVERY_COLLECTIONS,
  getFeaturedPlayers,
  HOMEPAGE_MODULES,
  MATCH_STORY_TEMPLATES,
  METRIC_TRANSLATIONS,
} from "@/lib/discovery";

export const metadata: Metadata = {
  title: "Explore — Footy Arena",
  description:
    "Discover World Cup 2026 through stories, players, collections, and curated narratives.",
};

export default function ExplorePage() {
  const featuredPlayers = getFeaturedPlayers();
  const [startJourney, catchMeUp, nationsToWatch] = HOMEPAGE_MODULES;

  return (
    <PageShell>
      <SiteHeader />

      <main className="relative z-10 mx-auto max-w-6xl px-6 pb-8">
        <div className="animate-fade-up py-12 md:py-16">
          <SectionHeading
            as="h1"
            eyebrow="World Cup Discovery"
            title={
              <>
                EXPLORE <span className="text-pitch-bright">2026</span>
              </>
            }
            icon={Compass}
            titleClassName="md:text-7xl"
            subtitle="Curated stories, players, and narratives to help you discover the tournament — no live data required."
          />
        </div>

        <section className="mb-20">
          <SectionHeading
            eyebrow="Get started"
            title={startJourney.title.toUpperCase()}
            icon={Sparkles}
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {startJourney.cards.map((card) => (
              <DiscoveryCard key={card.href} {...card} />
            ))}
          </div>
        </section>

        <section className="mb-20">
          <SectionHeading
            eyebrow="New to football?"
            title={catchMeUp.title.toUpperCase()}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            {catchMeUp.cards.map((card) => (
              <DiscoveryCard key={card.href} {...card} />
            ))}
          </div>
        </section>

        <section className="mb-20">
          <SectionHeading
            eyebrow="Editorial picks"
            title="FEATURED PLAYERS"
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featuredPlayers.map((player) => (
              <PlayerCard key={player.slug} player={player} />
            ))}
          </div>
        </section>

        <section id="collections" className="mb-20 scroll-mt-24">
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
        </section>

        <section className="mb-20">
          <SectionHeading eyebrow="Can't miss" title={nationsToWatch.title.toUpperCase()} />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {nationsToWatch.cards.map((card) => (
              <DiscoveryCard key={card.href} {...card} />
            ))}
          </div>
        </section>

        <section className="mb-20">
          <SectionHeading
            eyebrow="Understand the numbers"
            title="STATS, TRANSLATED"
          />
          <div className="grid gap-4 sm:grid-cols-2">
            {METRIC_TRANSLATIONS.map((metric) => (
              <MetricTranslationCard key={metric.slug} metric={metric} />
            ))}
          </div>
        </section>

        <section>
          <SectionHeading
            eyebrow="Match day"
            title="STORY TEMPLATES"
            subtitle="Frameworks for how to watch and appreciate different types of matches."
          />
          <div className="grid gap-4 md:grid-cols-3">
            {MATCH_STORY_TEMPLATES.map((template) => (
              <article
                key={template.slug}
                className="glass-panel rounded-2xl p-5"
              >
                <h3 className="font-display text-xl tracking-wide text-foreground">
                  {template.title.toUpperCase()}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {template.narrative}
                </p>
                <ul className="mt-4 space-y-1.5">
                  {template.watchFor.map((item) => (
                    <li key={item} className="text-xs text-pitch-bright">
                      · {item}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </PageShell>
  );
}
