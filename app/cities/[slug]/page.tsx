import { ArrowLeft, MapPin, Plane, RadioTower } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ContentContainer } from "@/components/content-container";
import { MediaImage } from "@/components/media-image";
import { PageShell } from "@/components/page-shell";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { HOST_CITIES, getHostCity } from "@/lib/cities";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return HOST_CITIES.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const city = getHostCity((await params).slug);
  return city
    ? { title: `${city.city} - Footy Arena`, description: city.dek }
    : { title: "Host City - Footy Arena" };
}

export default async function CityPage({ params }: PageProps) {
  const city = getHostCity((await params).slug);
  if (!city) notFound();

  return (
    <PageShell>
      <SiteHeader />
      <main>
        <section className="relative min-h-[72vh] border-b border-line-soft">
          <MediaImage src={city.image} alt={`${city.city} host-city atmosphere`} overlay="hero" priority className="absolute inset-0" sizes="100vw" />
          <ContentContainer as="div" className="flex min-h-[72vh] flex-col justify-between pb-10 pt-12 md:pb-16 md:pt-20">
            <Link href="/cities" className="relative z-10 inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-black/25 px-4 py-2 text-sm text-white/80 backdrop-blur-md">
              <ArrowLeft className="size-4" /> All host cities
            </Link>
            <div className="relative z-10 max-w-4xl">
              <p className="section-eyebrow">{city.countryName} · World Cup 2026</p>
              <h1 className="editorial-title type-hero mt-4 text-white">{city.city}</h1>
              <p className="type-lead mt-7 max-w-2xl text-white/75">{city.dek}</p>
            </div>
          </ContentContainer>
        </section>
        <ContentContainer className="grid gap-8 py-16 md:grid-cols-3">
          {[
            { icon: MapPin, label: "The venue", title: city.venue, copy: "The city’s tournament stage and the focal point for its match-day rhythm." },
            { icon: RadioTower, label: "The atmosphere", title: "Local signal", copy: city.atmosphere },
            { icon: Plane, label: "Arrival note", title: "Plan the day", copy: city.arrival },
          ].map((item) => (
            <article key={item.label} className="rounded-2xl border border-line-strong bg-artifact-muted p-6 shadow-card">
              <item.icon className="size-5 text-gold" />
              <p className="broadcast-label mt-8 text-muted-foreground">{item.label}</p>
              <h2 className="editorial-title type-card-title mt-2">{item.title}</h2>
              <p className="mt-4 text-sm leading-relaxed text-muted">{item.copy}</p>
            </article>
          ))}
        </ContentContainer>
      </main>
      <SiteFooter />
    </PageShell>
  );
}
