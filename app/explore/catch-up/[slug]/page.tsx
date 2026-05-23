import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/page-shell";
import { SectionHeading } from "@/components/section-heading";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { CATCH_UP_TOPICS, getCatchUpTopic } from "@/lib/discovery";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return CATCH_UP_TOPICS.map((topic) => ({ slug: topic.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const topic = getCatchUpTopic(slug);
  if (!topic) return { title: "Catch Up — Footy Arena" };
  return {
    title: `${topic.title} — Footy Arena`,
    description: topic.summary,
  };
}

export default async function CatchUpPage({ params }: PageProps) {
  const { slug } = await params;
  const topic = getCatchUpTopic(slug);
  if (!topic) notFound();

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

          <SectionHeading
            as="h1"
            eyebrow="Catch Me Up"
            title={topic.title.toUpperCase()}
            subtitle={topic.summary}
          />
        </div>

        <article className="glass-panel rounded-2xl p-6 md:p-8">
          <ul className="space-y-5">
            {topic.bullets.map((bullet) => (
              <li
                key={bullet}
                className="flex gap-3 text-base leading-relaxed text-muted"
              >
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-pitch-bright" />
                {bullet}
              </li>
            ))}
          </ul>
        </article>
      </main>

      <SiteFooter />
    </PageShell>
  );
}
