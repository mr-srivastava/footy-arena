import { ArrowLeft, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ContentContainer } from "@/components/content-container";
import { PlayerPortrait } from "@/components/player-portrait";
import { PageShell } from "@/components/page-shell";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SubsectionTitle } from "@/components/subsection-title";
import { getAllPlayers, getPlayerBySlug, getPlayerImage } from "@/lib/discovery";
import { getWorldCupTeams } from "@/lib/openfootball/teams";
import { artifactSurface } from "@/lib/utils";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllPlayers().map((player) => ({ slug: player.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const player = getPlayerBySlug(slug);
  if (!player) return { title: "Player - Footy Arena" };
  return {
    title: `${player.name} - Footy Arena`,
    description: player.whyExcited,
  };
}

export default async function PlayerPage({ params }: PageProps) {
  const [{ slug }, { byCode }] = await Promise.all([params, getWorldCupTeams()]);
  const player = getPlayerBySlug(slug);
  if (!player) notFound();
  const team = player.fifaCode ? byCode.get(player.fifaCode) : undefined;
  const image = getPlayerImage(player.slug);

  return (
    <PageShell>
      <SiteHeader />

      <ContentContainer width="narrow">
        <div className="animate-fade-up py-10 md:py-14">
          <Link
            href="/explore"
            className="mb-8 inline-flex items-center gap-2 rounded-sm border border-white/10 bg-white/5 px-3 py-2 text-sm text-muted transition-colors hover:border-gold/35 hover:text-gold"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Explore
          </Link>

          <div
            className={artifactSurface(
              "overflow-hidden md:grid md:grid-cols-[minmax(220px,260px)_1fr] md:items-center",
            )}
          >
            {image ? (
              <PlayerPortrait
                player={player}
                src={image}
                variant="hero"
                priority
                className="border-b border-white/8 md:border-b-0 md:border-r"
              />
            ) : null}

            <div className="relative flex flex-col justify-center p-6 md:p-8">
              <div
                className="pointer-events-none absolute -right-2 top-4 font-display text-7xl leading-none text-white/[0.025]"
                aria-hidden
              >
                {player.nation.slice(0, 3).toUpperCase()}
              </div>
              <p className="section-eyebrow">{player.nation}</p>
              <h1 className="mt-2 font-display text-5xl tracking-wide text-foreground md:text-6xl">
                {player.name.toUpperCase()}
              </h1>
              <p className="mt-3 text-lg text-muted">
                {player.position} · {player.archetype}
              </p>
            </div>
          </div>
        </div>

        <article className={artifactSurface("p-6 md:p-8")}>
          <div className="flex flex-col gap-8">
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
                className="inline-flex w-fit rounded-sm border border-gold/25 px-4 py-2 text-sm font-semibold text-gold hover:border-gold/50 hover:text-foreground"
              >
                View {team.displayName} at the World Cup →
              </Link>
            ) : null}
          </div>
        </article>
      </ContentContainer>

      <SiteFooter />
    </PageShell>
  );
}
