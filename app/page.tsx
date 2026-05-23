import {
  ArrowRight,
  Bell,
  Compass,
  Globe2,
  Landmark,
  MapPin,
  RadioTower,
  Trophy,
} from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { ContentContainer } from "@/components/content-container";
import History from "@/components/home/home-history";
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
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { artifactSurface } from "@/lib/utils";
import { HOST_CITIES } from "@/lib/openfootball/constants";
import { HOST_CITY_VENUES, HOST_NATIONS } from "@/lib/openfootball/host-venues";
import { HOMEPAGE_MODULES } from "@/lib/discovery";

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
            {featuredJourneyCard ? (
              <div className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
                <Link
                  href={featuredJourneyCard.href}
                  className={artifactSurface(
                    "group relative min-h-80 overflow-hidden p-6 md:p-8",
                  )}
                >
                  <div
                    className="home-discovery-feature-bg absolute inset-0"
                    aria-hidden
                  />
                  <div
                    className="home-discovery-field-lines absolute bottom-0 left-0 right-0 h-24 opacity-50"
                    aria-hidden
                  />
                  <div className="relative flex h-full flex-col justify-between">
                    <div className="flex items-center justify-between gap-4 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                      <span>Featured route</span>
                      <span className="text-gold">01</span>
                    </div>
                    <div>
                      <h3 className="max-w-xl font-display text-5xl leading-none tracking-wide text-foreground transition-colors group-hover:text-gold md:text-7xl">
                        {featuredJourneyCard.title.toUpperCase()}
                      </h3>
                      <p className="mt-4 max-w-md text-base leading-relaxed text-muted">
                        {featuredJourneyCard.description}
                      </p>
                      <span className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-gold">
                        Start here
                        <ArrowRight
                          className="h-4 w-4 transition-transform group-hover:translate-x-1"
                          aria-hidden
                        />
                      </span>
                    </div>
                  </div>
                </Link>
                <div className="grid gap-3">
                  {secondaryJourneyCards.slice(0, 4).map((card, index) => (
                    <Link
                      key={card.href}
                      href={card.href}
                      className="group grid grid-cols-[auto_1fr_auto] items-center gap-4 border-b border-white/8 py-4 transition-colors hover:border-gold/40"
                    >
                      <span className="font-display text-3xl text-pitch-bright/70">
                        0{index + 2}
                      </span>
                      <span>
                        <span className="block font-display text-2xl tracking-wide text-foreground transition-colors group-hover:text-gold">
                          {card.title.toUpperCase()}
                        </span>
                        <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
                          {card.description}
                        </span>
                      </span>
                      <ArrowRight
                        className="h-4 w-4 text-gold transition-transform group-hover:translate-x-1"
                        aria-hidden
                      />
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
          </PageSection>
        ) : null}

        <PageSection id="hosts" variant="feature">
          <SectionHeading
            eyebrow="First Tri-Host Tournament"
            title="THREE NATIONS, ONE DREAM"
            icon={Globe2}
          />
          <div className="overflow-hidden rounded-sm border-y border-white/10">
            {HOST_NATIONS.map((nation) => (
              <div
                key={nation.country}
                className="group relative grid gap-4 border-b border-white/8 px-2 py-7 last:border-b-0 md:grid-cols-[0.55fr_0.3fr_1fr] md:items-center md:px-0"
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
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      Host nation
                    </p>
                    <h3 className="font-display text-4xl tracking-wide text-foreground">
                    {nation.country.toUpperCase()}
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
        </PageSection>

        <Suspense fallback={<HomeOpeningFixturesSkeleton />}>
          <HomeOpeningFixtures />
        </Suspense>

        <PageSection id="cities" variant="dense">
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
          <div className="grid gap-8 md:grid-cols-[0.75fr_1.25fr]">
            <div className="border-l border-gold/40 pl-5">
              <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-gold">
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
                <div key={country} className={country === "USA" ? "sm:row-span-2" : ""}>
                  <div className="mb-3 flex items-center justify-between border-b border-white/10 pb-2">
                    <Badge variant="country">{country}</Badge>
                    <span className="text-xs text-muted-foreground">
                      {
                        HOST_CITY_VENUES.filter((city) => city.country === country)
                          .length
                      }{" "}
                      cities
                    </span>
                  </div>
                  <ul className="space-y-3">
                    {HOST_CITY_VENUES.filter((city) => city.country === country).map(
                      (city) => (
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
                      ),
                    )}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </PageSection>

        <History />

        <ContentContainer as="div" id="notify">
          <section className={artifactSurface("relative overflow-hidden text-center")}>
            <div className="relative px-8 py-14 md:px-16">
              <div
                className="notify-glow pointer-events-none absolute inset-0"
                aria-hidden
              />
              <Trophy
                className="relative mx-auto h-14 w-14 text-gold drop-shadow-gold-glow"
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
            </div>
          </section>
        </ContentContainer>
      </main>

      <SiteFooter />
    </PageShell>
  );
}
