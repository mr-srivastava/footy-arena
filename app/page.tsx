import {
  ArrowRight,
  Bell,
  Compass,
  Globe2,
  Landmark,
  MapPin,
  Trophy,
} from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Suspense } from "react";
import { ContentContainer } from "@/components/content-container";
import { DiscoveryCard } from "@/components/discovery-card";
import {
  HomeHero,
  HomeHeroSkeleton,
} from "@/components/home/home-hero";
import {
  HomeOpeningFixtures,
  HomeOpeningFixturesSkeleton,
} from "@/components/home/home-opening-fixtures";
import { PageSection } from "@/components/page-section";
import { PageShell } from "@/components/page-shell";
import { SectionHeading } from "@/components/section-heading";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { HOST_CITIES } from "@/lib/openfootball/constants";
import { HOST_CITY_VENUES, HOST_NATIONS } from "@/lib/openfootball/host-venues";
import { HOMEPAGE_MODULES } from "@/lib/discovery";

const History = dynamic(() => import("@/components/history"), {
  loading: () => (
    <section
      aria-hidden
      className="relative z-10 border-y border-white/8"
    >
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <div className="mx-auto h-24 max-w-xl animate-pulse rounded-2xl bg-white/5" />
      </div>
      <div className="mx-auto max-w-6xl px-6 pb-16 md:pb-20">
        <div className="card-border rounded-3xl p-px">
          <div className="min-h-[min(85vh,780px)] rounded-3xl bg-navy lg:min-h-[640px]" />
        </div>
      </div>
    </section>
  ),
});

export default function Home() {
  const startJourney = HOMEPAGE_MODULES.find(
    (module) => module.slug === "start-your-journey",
  );

  return (
    <PageShell>
      <SiteHeader className="animate-fade-up" />

      <main>
        <Suspense fallback={<HomeHeroSkeleton />}>
          <HomeHero />
        </Suspense>

        {startJourney ? (
          <PageSection id="discover" variant="band">
            <SectionHeading
              eyebrow="Discovery-first"
              title="START YOUR JOURNEY"
              icon={Compass}
            >
              <Link
                href="/explore"
                className="group flex items-center gap-2 text-sm font-semibold text-gold transition-colors hover:text-foreground"
              >
                Explore all stories
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  aria-hidden
                />
              </Link>
            </SectionHeading>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {startJourney.cards.map((card) => (
                <DiscoveryCard key={card.href} {...card} />
              ))}
            </div>
          </PageSection>
        ) : null}

        <PageSection id="hosts" variant="default">
          <SectionHeading
            eyebrow="First Tri-Host Tournament"
            title="THREE NATIONS, ONE DREAM"
            icon={Globe2}
          />
          <div className="grid gap-6 md:grid-cols-3">
            {HOST_NATIONS.map((nation) => (
              <Card
                key={nation.country}
                interactive
                accent="pitch"
                padding="none"
                className="group overflow-hidden rounded-2xl"
              >
                <div
                  className={`pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b ${nation.accent} to-transparent opacity-20 transition-opacity group-hover:opacity-35`}
                  aria-hidden
                />
                <CardContent className="relative p-6">
                  <span className="text-5xl drop-shadow-lg">{nation.flag}</span>
                  <CardTitle className="mt-5 font-display text-3xl tracking-wide">
                    {nation.country.toUpperCase()}
                  </CardTitle>
                  <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-gold">
                    <MapPin className="h-3.5 w-3.5" aria-hidden />
                    {nation.cities} host cities
                  </p>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                    {nation.detail}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </PageSection>

        <Suspense fallback={<HomeOpeningFixturesSkeleton />}>
          <HomeOpeningFixtures />
        </Suspense>

        <PageSection id="cities" variant="default">
          <SectionHeading
            eyebrow="Venues"
            title={`${HOST_CITIES} HOST CITIES`}
            icon={Landmark}
          >
            <p className="max-w-sm text-sm leading-relaxed text-muted">
              From the Azteca&apos;s roar to SoFi&apos;s spectacle - world-class
              stadiums across the continent.
            </p>
          </SectionHeading>
          <div className="lazy-grid grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {HOST_CITY_VENUES.map((city) => (
              <Card key={city.city} interactive padding="none">
                <CardContent className="px-4 py-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium text-foreground">{city.city}</p>
                    <Badge variant="country">{city.country}</Badge>
                  </div>
                  <p className="mt-1.5 flex items-center gap-1 text-xs text-muted-foreground">
                    <Landmark className="h-3 w-3 shrink-0 text-pitch-bright/60" aria-hidden />
                    {city.venue}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </PageSection>

        <History />

        <ContentContainer as="div" id="notify">
          <Card variant="featured" padding="none" className="text-center">
            <CardContent className="relative px-8 py-14 md:px-16">
              <div
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(22,128,63,0.18),transparent_65%)]"
                aria-hidden
              />
              <Trophy
                className="relative mx-auto h-14 w-14 text-gold drop-shadow-[0_0_24px_rgba(240,192,32,0.4)]"
                aria-hidden
              />
              <h2 className="relative mt-6 font-display text-5xl tracking-wide md:text-6xl">
                NEVER MISS A KICK
              </h2>
              <p className="relative mx-auto mt-4 max-w-md text-muted-foreground">
                Be the first to know when fixtures drop, tickets go on sale, and
                Footy Arena launches full tournament coverage.
              </p>
              <FieldGroup className="relative mx-auto mt-8 max-w-md">
                <Field orientation="responsive" className="flex-col gap-3 sm:flex-row">
                  <Input
                    type="email"
                    placeholder="you@email.com"
                    aria-label="Email address"
                    disabled
                    className="h-11 flex-1 rounded-full px-5"
                  />
                  <Button type="button" disabled size="pill" className="h-11 px-6">
                    <Bell data-icon="inline-start" aria-hidden />
                    Coming soon
                  </Button>
                </Field>
              </FieldGroup>
            </CardContent>
          </Card>
        </ContentContainer>
      </main>

      <SiteFooter />
    </PageShell>
  );
}
