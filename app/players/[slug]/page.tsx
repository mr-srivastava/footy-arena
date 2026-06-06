import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PlayerProfileView } from "@/components/explore/player-profile-view";
import { PageShell } from "@/components/page-shell";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getPlayerBySlug } from "@/lib/discovery";
import { explorePlayerCardFromProfile } from "@/lib/explore/load-players";

export const revalidate = 1800;
export const dynamicParams = true;

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const profile = getPlayerBySlug(slug);

  if (!profile) {
    return { title: "Player - Footy Arena" };
  }

  return {
    title: `${profile.name} - Footy Arena`,
    description: profile.whyExcited,
  };
}

export default async function PlayerPage({ params }: PageProps) {
  const { slug } = await params;
  const profile = getPlayerBySlug(slug);

  if (!profile) {
    notFound();
  }

  const initialPlayer = explorePlayerCardFromProfile(profile);

  return (
    <PageShell>
      <SiteHeader />

      <PlayerProfileView initialPlayer={initialPlayer} />

      <SiteFooter />
    </PageShell>
  );
}
