import {
  ArrowRight,
  Compass,
  Globe2,
  Landmark,
  MapPin,
  RadioTower,
} from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { EntityRow } from "@/components/entity-row";
import History from "@/components/home/home-history";
import { HomeHero, HomeHeroSkeleton } from "@/components/home/home-hero";
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
import { Card, CardContent } from "@/components/ui/card";
import { HOST_CITIES } from "@/lib/openfootball/constants";
import { HOST_CITY_VENUES, HOST_NATIONS } from "@/lib/openfootball/host-venues";
import { MediaImage } from "@/components/media-image";
import { CityJournalCard } from "@/components/cities/city-journal-card";
import { getHomepageCardImage, HOMEPAGE_MODULES } from "@/lib/discovery";
import { HOST_CITIES as CITY_JOURNAL } from "@/lib/cities";

export default function Home() {
  const startJourney = HOMEPAGE_MODULES.find(
    (module) => module.slug === "start-your-journey",
  );
  const [featuredJourneyCard, ...secondaryJourneyCards] =
    startJourney?.cards ?? [];

  return (
    <PageShell>
      <SiteHeader className="animate-fade-up" />

      <main>
        <Suspense fallback={<HomeHeroSkeleton />}>
          <HomeHero />
        </Suspense>

        {startJourney ? (
          <PageSection id="discover" variant="editorial">
            <SectionHeading
              eyebrow="Where to start"
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
            {featuredJourneyCard ? (
              <div className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
                <Link
                  href={featuredJourneyCard.href}
                  className="group block min-h-80"
                >
                  <Card
                    variant="artifact"
                    shape="artifact"
                    padding="none"
                    interactive
                    className="surface-panel-elevated relative min-h-[30rem] p-6 md:p-8"
                  >
                    <MediaImage
                      src={getHomepageCardImage(featuredJourneyCard.href)}
                      alt={`${featuredJourneyCard.title} atmosphere`}
                      overlay="hero"
                      className="absolute inset-0"
                      sizes="(max-width: 1024px) 100vw, 60vw"
                      priority
                    />
                    <div
                      className="home-discovery-field-lines absolute bottom-0 left-0 right-0 h-24 opacity-50"
                      aria-hidden
                    />
                    <CardContent className="relative flex min-h-68 flex-col justify-between p-0">
                      <div className="flex items-center justify-between gap-4 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                        <span>Featured route</span>
                        <span className="text-gold">01</span>
                      </div>
                      <div>
                        <h3 className="editorial-title type-section-title max-w-xl text-foreground transition-colors group-hover:text-gold">
                          {featuredJourneyCard.title}
                        </h3>
                        <p className="mt-4 max-w-md text-base leading-relaxed text-muted">
                          {featuredJourneyCard.description}
                        </p>
                        <span className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-gold">
                          Start here
                          <ArrowRight
                            className="size-4 transition-transform group-hover:translate-x-1"
                            aria-hidden
                          />
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
                <div className="grid gap-3">
                  {secondaryJourneyCards.slice(0, 4).map((card, index) => (
                    <EntityRow
                      key={card.href}
                      href={card.href}
                      leading={
                        <span className="font-display text-3xl text-pitch-bright/70">
                          0{index + 2}
                        </span>
                      }
                      title={card.title.toUpperCase()}
                      meta={card.description}
                      titleClassName="text-2xl"
                      metaClassName="normal-case tracking-normal leading-relaxed"
                    />
                  ))}
                </div>
              </div>
            ) : null}
          </PageSection>
        ) : null}

        <Suspense fallback={<HomeOpeningFixturesSkeleton />}>
          <HomeOpeningFixtures />
        </Suspense>

        <PageSection id="hosts" variant="feature">
          <SectionHeading
            eyebrow="First Tri-Host Tournament"
            title="THREE NATIONS, ONE DREAM"
            icon={Globe2}
          />
          <div className="overflow-hidden rounded-2xl border border-line-strong bg-artifact-muted shadow-card">
            {HOST_NATIONS.map((nation) => (
              <div
                key={nation.country}
                className="group relative grid gap-4 border-b border-line-soft px-6 py-8 last:border-b-0 md:grid-cols-[0.55fr_0.3fr_1fr] md:items-center md:px-8"
              >
                <div
                  className={`pointer-events-none absolute inset-x-0 h-px bg-gradient-to-r ${nation.accent} to-transparent opacity-0 transition-opacity group-hover:opacity-80`}
                  aria-hidden
                />
                <div className="flex items-center gap-4">
                  <span className="text-5xl drop-shadow-lg md:text-6xl">
                    {nation.flag}
                  </span>
                  <div>
                    <p className="type-label text-muted-foreground">
                      Host nation
                    </p>
                    <h3 className="editorial-title type-card-title text-foreground">
                      {nation.country}
                    </h3>
                  </div>
                </div>
                <p className="flex items-center gap-1.5 font-display text-3xl tracking-wide text-gold">
                  <MapPin className="h-3.5 w-3.5" aria-hidden />
                  {nation.cities} host cities
                </p>
                <p className="max-w-xl text-sm leading-relaxed text-muted-foreground md:justify-self-end md:text-right">
                  {nation.detail}
                </p>
              </div>
            ))}
          </div>

          <div id="cities" className="mt-16 pt-14 md:mt-16 md:pt-10">
            <SectionHeading
              eyebrow="Venues"
              title={`${HOST_CITIES} HOST CITIES`}
              icon={Landmark}
              titleClassName="md:text-5xl"
              className="mb-8 md:mb-10"
            >
              <p className="max-w-sm text-sm leading-relaxed text-muted">
                From the Azteca&apos;s roar to SoFi&apos;s spectacle -
                world-class stadiums across the continent.
              </p>
            </SectionHeading>
            <div className="grid gap-8 md:grid-cols-[0.75fr_1.25fr]">
              <div className="border-l border-gold/40 pl-5">
                <p className="type-label flex items-center gap-2 text-gold">
                  <RadioTower className="h-4 w-4" aria-hidden />
                  Venue directory
                </p>
                <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
                  Sixteen stadiums stretch from Pacific coast nights to Azteca
                  altitude and the final stage outside New York.
                </p>
              </div>
              <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                {["USA", "MEX", "CAN"].map((country) => (
                  <div
                    key={country}
                    className={country === "USA" ? "sm:row-span-2" : ""}
                  >
                    <div className="mb-3 flex items-center justify-between border-b border-line-strong pb-2">
                      <Badge variant="country">{country}</Badge>
                      <span className="text-xs text-muted-foreground">
                        {
                          HOST_CITY_VENUES.filter(
                            (city) => city.country === country,
                          ).length
                        }{" "}
                        cities
                      </span>
                    </div>
                    <ul className="flex flex-col gap-3">
                      {HOST_CITY_VENUES.filter(
                        (city) => city.country === country,
                      ).map((city) => (
                        <li
                          key={city.city}
                          className="grid grid-cols-[1fr_auto] gap-3 text-sm"
                        >
                          <span className="font-medium text-foreground">
                            {city.city}
                          </span>
                          <span className="text-right text-xs text-muted-foreground">
                            {city.venue}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-20">
            <SectionHeading
              eyebrow="The host-city journal"
              title="BEYOND THE STADIUM"
              icon={MapPin}
            >
              <Link
                href="/cities"
                className="group flex items-center gap-2 text-sm font-semibold text-gold"
              >
                Explore all cities
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </SectionHeading>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {CITY_JOURNAL.slice(0, 4).map((city, index) => (
                <CityJournalCard
                  key={city.slug}
                  city={city}
                  featured={index === 0}
                />
              ))}
            </div>
          </div>
        </PageSection>

        <History />
      </main>

      <SiteFooter />
    </PageShell>
  );
}
