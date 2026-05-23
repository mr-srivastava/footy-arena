import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
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
  if (!collection) return { title: "Collection — Footy Arena" };
  return {
    title: `${collection.title} — Footy Arena`,
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

      <main className="relative z-10 mx-auto max-w-6xl px-6 pb-8">
        <div className="animate-fade-up py-10 md:py-14">
          <Link
            href="/explore"
            className="mb-8 inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-gold"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Explore
          </Link>

          <SectionHeading
            as="h1"
            eyebrow="Discovery Collection"
            title={collection.title.toUpperCase()}
            subtitle={collection.description}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {players.map((player) => (
            <PlayerCard key={player.slug} player={player} />
          ))}
        </div>
      </main>

      <SiteFooter />
    </PageShell>
  );
}
