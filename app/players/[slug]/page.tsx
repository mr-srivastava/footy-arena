import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentContainer } from "@/components/content-container";
import { PlayerProfileView } from "@/components/explore/player-profile-view";
import { PageShell } from "@/components/page-shell";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getAllPlayers } from "@/lib/discovery";
import {
  exploreCardSubtitle,
  loadExplorePlayerShellBySlug,
} from "@/lib/explore/load-players";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllPlayers().map((player) => ({ slug: player.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const player = await loadExplorePlayerShellBySlug(slug);

  if (!player) {
    return { title: "Player - Footy Arena" };
  }

  const displayName = player.shortName ?? player.name;

  return {
    title: `${displayName} - Footy Arena`,
    description:
      player.editorial?.whyExcited ?? exploreCardSubtitle(player),
  };
}

export default async function PlayerPage({ params }: PageProps) {
  const { slug } = await params;
  const player = await loadExplorePlayerShellBySlug(slug);

  if (!player) {
    notFound();
  }

  return (
    <PageShell>
      <SiteHeader />

      <ContentContainer width="narrow">
        <PlayerProfileView initialPlayer={player} />
      </ContentContainer>

      <SiteFooter />
    </PageShell>
  );
}
