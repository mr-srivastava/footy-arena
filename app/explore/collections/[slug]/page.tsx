import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentContainer } from "@/components/content-container";
import { PageHero } from "@/components/page-hero";
import { PageShell } from "@/components/page-shell";
import { PlayerCard } from "@/components/player-card";
import { SectionHeading } from "@/components/section-heading";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import {
  DISCOVERY_COLLECTIONS,
  getDiscoveryCollection,
  getPlayersBySlugs,
} from "@/lib/discovery";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return DISCOVERY_COLLECTIONS.map((collection) => ({
    slug: collection.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const collection = getDiscoveryCollection(slug);
  if (!collection) return { title: "Collection - Footy Arena" };
  return {
    title: `${collection.title} - Footy Arena`,
    description: collection.description,
  };
}

export default async function CollectionPage({ params }: PageProps) {
  const { slug } = await params;
  const collection = getDiscoveryCollection(slug);
  if (!collection) notFound();

  const players = getPlayersBySlugs(collection.playerSlugs);

  return (
    <PageShell>
      <SiteHeader />

      <ContentContainer>
        <PageHero variant="detail" backHref="/explore" backLabel="Explore">
          <SectionHeading
            as="h1"
            className="mb-0"
            eyebrow="Discovery Collection"
            title={collection.title.toUpperCase()}
            subtitle={collection.description}
          />
        </PageHero>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {players.map((player) => (
            <PlayerCard key={player.slug} player={player} />
          ))}
        </div>
      </ContentContainer>

      <SiteFooter />
    </PageShell>
  );
}
