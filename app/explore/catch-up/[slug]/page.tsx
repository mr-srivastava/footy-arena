import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentContainer } from "@/components/content-container";
import { PageHero } from "@/components/page-hero";
import { PageShell } from "@/components/page-shell";
import { SectionHeading } from "@/components/section-heading";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { CATCH_UP_TOPICS, getCatchUpImage, getCatchUpTopic } from "@/lib/discovery";
import { artifactSurface } from "@/lib/utils";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return CATCH_UP_TOPICS.map((topic) => ({ slug: topic.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const topic = getCatchUpTopic(slug);
  if (!topic) return { title: "Catch Up - Footy Arena" };
  return {
    title: `${topic.title} - Footy Arena`,
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

      <ContentContainer width="narrow">
        <PageHero
          variant="detail"
          backHref="/explore"
          backLabel="Explore"
          bannerImage={getCatchUpImage(topic.slug)}
          bannerAlt={`${topic.title} atmosphere`}
        >
          <SectionHeading
            as="h1"
            className="mb-0"
            eyebrow="Catch Me Up"
            title={topic.title.toUpperCase()}
            subtitle={topic.summary}
          />
        </PageHero>

        <article className={artifactSurface("p-6 md:p-8")}>
          <ul className="divide-y divide-white/8 border-y border-white/8">
            {topic.bullets.map((bullet) => (
              <li
                key={bullet}
                className="grid grid-cols-[auto_1fr] gap-4 py-5 text-base leading-relaxed text-muted-foreground"
              >
                <span
                  className="mt-3 h-px w-7 shrink-0 bg-pitch-bright/60"
                  aria-hidden
                />
                {bullet}
              </li>
            ))}
          </ul>
        </article>
      </ContentContainer>

      <SiteFooter />
    </PageShell>
  );
}
