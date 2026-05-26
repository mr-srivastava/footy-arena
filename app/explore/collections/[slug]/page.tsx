import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentContainer } from "@/components/content-container";
import { ExplorePlayersGrid } from "@/components/explore/explore-players-grid";
import { PageHero } from "@/components/page-hero";
import { PageShell } from "@/components/page-shell";
import { SectionHeading } from "@/components/section-heading";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import {
  DISCOVERY_COLLECTIONS,
  getCollectionImage,
  getDiscoveryCollection,
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

  return (
    <PageShell>
      <SiteHeader />

      <ContentContainer>
        <PageHero
          variant="detail"
          backHref="/explore"
          backLabel="Explore"
          bannerImage={getCollectionImage(collection.slug)}
          bannerAlt={`${collection.title} atmosphere`}
        >
          <SectionHeading
            as="h1"
            className="mb-0"
            eyebrow="Discovery Collection"
            title={collection.title.toUpperCase()}
            subtitle={collection.description}
          />
        </PageHero>

        <ExplorePlayersGrid
          slugs={collection.playerSlugs}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          emptyMessage="Collection players will appear here once matching squad records are available in Convex."
        />
      </ContentContainer>

      <SiteFooter />
    </PageShell>
  );
}
