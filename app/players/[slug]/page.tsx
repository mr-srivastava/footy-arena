import { ArrowLeft, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/page-shell";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
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
  const { slug } = await params;
  const player = getPlayerBySlug(slug);
  if (!player) notFound();

  const { byCode } = await getWorldCupTeams();
  const team = player.fifaCode ? byCode.get(player.fifaCode) : undefined;

  return (
    <PageShell>
      <SiteHeader />

      <main className="relative z-10 mx-auto max-w-3xl px-6 pb-8">
        <div className="animate-fade-up py-10 md:py-14">
          <Link
            href="/explore"
            className="mb-8 inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-gold"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Explore
          </Link>

          <p className="section-eyebrow">{player.nation}</p>
          <h1 className="mt-2 font-display text-5xl tracking-wide text-foreground md:text-6xl">
            {player.name.toUpperCase()}
          </h1>
          <p className="mt-3 text-lg text-muted">
            {player.position} · {player.archetype}
          </p>
        </div>

        <article className="glass-panel space-y-8 rounded-2xl p-6 md:p-8">
          <section>
            <h2 className="flex items-center gap-2 font-display text-xl tracking-wide text-foreground">
              <Sparkles className="h-5 w-5 text-gold" aria-hidden />
              WHY PEOPLE ARE EXCITED
            </h2>
            <p className="mt-3 leading-relaxed text-muted">{player.whyExcited}</p>
          </section>

          <section>
            <h2 className="text-xs font-semibold uppercase tracking-widest text-pitch-bright">
              Watch for
            </h2>
            <p className="mt-2 text-base leading-relaxed text-foreground/90">
              {player.watchFor}
            </p>
          </section>

          <section>
            <h2 className="text-xs font-semibold uppercase tracking-widest text-muted">
              Similar energy
            </h2>
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
        </article>
      </main>

      <SiteFooter />
    </PageShell>
  );
}
