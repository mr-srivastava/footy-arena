import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentContainer } from "@/components/content-container";
import { PageHero } from "@/components/page-hero";
import { PageShell } from "@/components/page-shell";
import { SectionHeading } from "@/components/section-heading";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Card, CardContent } from "@/components/ui/card";
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

      <ContentContainer width="narrow">
        <PageHero variant="detail" backHref="/explore" backLabel="Explore">
          <SectionHeading
            as="h1"
            className="mb-0"
            eyebrow="Catch Me Up"
            title={topic.title.toUpperCase()}
            subtitle={topic.summary}
          />
        </PageHero>

        <Card accent="pitch" padding="none">
          <CardContent className="p-6 md:p-8">
            <ul className="flex flex-col gap-5">
              {topic.bullets.map((bullet) => (
                <li
                  key={bullet}
                  className="flex gap-3 text-base leading-relaxed text-muted-foreground"
                >
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-pitch-bright" />
                  {bullet}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </ContentContainer>

      <SiteFooter />
    </PageShell>
  );
}
