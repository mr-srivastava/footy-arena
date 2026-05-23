import { Sparkles } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ContentContainer } from "@/components/content-container";
import { PageHero } from "@/components/page-hero";
import { PageShell } from "@/components/page-shell";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SubsectionTitle } from "@/components/subsection-title";
import { Card, CardContent } from "@/components/ui/card";
import { getAllPlayers, getPlayerBySlug } from "@/lib/discovery";
import { getWorldCupTeams } from "@/lib/openfootball/teams";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllPlayers().map((player) => ({ slug: player.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const player = getPlayerBySlug(slug);
  if (!player) return { title: "Player — Footy Arena" };
  return {
    title: `${player.name} — Footy Arena`,
    description: player.whyExcited,
  };
}

export default async function PlayerPage({ params }: PageProps) {
  const [{ slug }, { byCode }] = await Promise.all([params, getWorldCupTeams()]);
  const player = getPlayerBySlug(slug);
  if (!player) notFound();
  const team = player.fifaCode ? byCode.get(player.fifaCode) : undefined;

  return (
    <PageShell>
      <SiteHeader />

      <ContentContainer width="narrow">
        <PageHero
          variant="detail"
          backHref="/explore"
          backLabel="Explore"
          eyebrow={player.nation}
          title={player.name.toUpperCase()}
          meta={
            <p className="text-lg text-muted">
              {player.position} · {player.archetype}
            </p>
          }
        />

        <Card accent="pitch" padding="none">
          <CardContent className="flex flex-col gap-8 p-6 md:p-8">
            <section>
              <SubsectionTitle level="panel" icon={Sparkles}>
                WHY PEOPLE ARE EXCITED
              </SubsectionTitle>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                {player.whyExcited}
              </p>
            </section>

            <section>
              <SubsectionTitle level="label" tone="accent">
                Watch for
              </SubsectionTitle>
              <p className="mt-2 text-base leading-relaxed text-foreground/90">
                {player.watchFor}
              </p>
            </section>

            <section>
              <SubsectionTitle level="label">Similar energy</SubsectionTitle>
              <p className="mt-2 text-base italic leading-relaxed text-gold">
                {player.similarEnergy}
              </p>
            </section>

            {team ? (
              <Link
                href={`/teams/${team.slug}`}
                className="inline-flex text-sm font-semibold text-gold hover:text-foreground"
              >
                View {team.displayName} at the World Cup →
              </Link>
            ) : null}
          </CardContent>
        </Card>
      </ContentContainer>

      <SiteFooter />
    </PageShell>
  );
}
