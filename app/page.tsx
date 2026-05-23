import {
  ArrowRight,
  Bell,
  Calendar,
  CalendarDays,
  Globe2,
  Landmark,
  MapPin,
  Trophy,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { FixtureCard } from "@/components/fixture-card";
import { PageShell } from "@/components/page-shell";
import { SectionHeading } from "@/components/section-heading";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { StatCard } from "@/components/stat-card";
import {
  HOST_CITIES,
  HOST_COUNTRIES,
  OPENING_DAY,
  TOURNAMENT_NATIONS,
} from "@/lib/openfootball/constants";
import {
  getOpeningDayFixtures,
  getWorldCupFixtures,
} from "@/lib/openfootball/fixtures";

function buildTickerItems(
  stats: { ticker: string }[],
): string[] {
  const items = stats.flatMap((s) => [s.ticker, "·"]);
  items.push("JUN 11 — JUL 19", "·");
  return items;
}

const hostNations = [
  {
    country: "United States",
    flag: "🇺🇸",
    cities: 11,
    accent: "from-red via-red/40",
    detail: "MetLife Stadium hosts the Final on July 19",
  },
  {
    country: "Mexico",
    flag: "🇲🇽",
    cities: 3,
    accent: "from-teal via-teal/40",
    detail: "Estadio Azteca opens the tournament on June 11",
  },
  {
    country: "Canada",
    flag: "🇨🇦",
    cities: 2,
    accent: "from-pitch-bright via-pitch/40",
    detail: "Toronto & Vancouver welcome the world",
  },
];

const hostCities = [
  { city: "New York / New Jersey", country: "USA", venue: "MetLife Stadium" },
  { city: "Los Angeles", country: "USA", venue: "SoFi Stadium" },
  { city: "Dallas", country: "USA", venue: "AT&T Stadium" },
  { city: "Miami", country: "USA", venue: "Hard Rock Stadium" },
  { city: "Atlanta", country: "USA", venue: "Mercedes-Benz Stadium" },
  { city: "Houston", country: "USA", venue: "NRG Stadium" },
  { city: "Philadelphia", country: "USA", venue: "Lincoln Financial Field" },
  { city: "Seattle", country: "USA", venue: "Lumen Field" },
  { city: "San Francisco", country: "USA", venue: "Levi's Stadium" },
  { city: "Boston", country: "USA", venue: "Gillette Stadium" },
  { city: "Kansas City", country: "USA", venue: "Arrowhead Stadium" },
  { city: "Mexico City", country: "MEX", venue: "Estadio Azteca" },
  { city: "Guadalajara", country: "MEX", venue: "Estadio Akron" },
  { city: "Monterrey", country: "MEX", venue: "Estadio BBVA" },
  { city: "Toronto", country: "CAN", venue: "BMO Field" },
  { city: "Vancouver", country: "CAN", venue: "BC Place" },
];

export default async function Home() {
  const { fixtures } = await getWorldCupFixtures();
  const matchCount = fixtures.length;
  const openingFixtures = getOpeningDayFixtures(fixtures, OPENING_DAY);

  const stats: {
    value: number;
    label: string;
    icon: LucideIcon;
    ticker: string;
  }[] = [
    {
      value: TOURNAMENT_NATIONS,
      label: "Nations",
      icon: Users,
      ticker: `${TOURNAMENT_NATIONS} NATIONS`,
    },
    {
      value: matchCount,
      label: "Matches",
      icon: Calendar,
      ticker: `${matchCount} MATCHES`,
    },
    {
      value: HOST_CITIES,
      label: "Host Cities",
      icon: MapPin,
      ticker: `${HOST_CITIES} CITIES`,
    },
    {
      value: HOST_COUNTRIES,
      label: "Countries",
      icon: Globe2,
      ticker: `${HOST_COUNTRIES} HOST COUNTRIES`,
    },
  ];

  const tickerItems = buildTickerItems(stats);

  return (
    <PageShell>
      <SiteHeader className="animate-fade-up" />

      <div
        className="relative z-10 overflow-hidden border-b border-white/6 bg-navy/80 py-2"
        aria-hidden
      >
        <div className="flex w-max animate-ticker gap-8 whitespace-nowrap px-6 text-xs font-semibold uppercase tracking-[0.35em] text-muted">
          {[...tickerItems, ...tickerItems].map((item, i) => (
            <span
              key={`${item}-${i}`}
              className={item === "·" ? "text-pitch/50" : "text-pitch-bright/70"}
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      <section className="relative z-10 mx-auto max-w-6xl px-6 pb-24 pt-10 md:pt-16">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div className="text-center lg:text-left">
            <p className="animate-fade-up animate-delay-1 section-eyebrow justify-center lg:justify-start">
              FIFA World Cup
            </p>

            <div className="relative mt-2">
              <p
                className="hero-watermark pointer-events-none absolute -left-2 top-1/2 -translate-y-1/2 font-display text-[clamp(6rem,22vw,14rem)] leading-none tracking-tight select-none md:-left-4"
                aria-hidden
              >
                26
              </p>
              <h1 className="animate-fade-up animate-delay-2 relative font-display text-[clamp(4.5rem,16vw,10rem)] leading-[0.88] tracking-tight">
                <span className="text-foreground">20</span>
                <span className="text-pitch-bright">26</span>
              </h1>
            </div>

            <p className="animate-fade-up animate-delay-3 mx-auto mt-6 max-w-lg text-lg leading-relaxed text-muted lg:mx-0 md:text-xl">
              The greatest show on earth returns to North America.{" "}
              <span className="text-foreground">
                {TOURNAMENT_NATIONS} nations
              </span>
              ,{" "}
              <span className="text-foreground">{matchCount} matches</span>,
              three countries united by the beautiful game.
            </p>

            <div className="animate-fade-up animate-delay-4 mt-10 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
              <div className="glass-panel rounded-2xl px-8 py-4">
                <p className="flex items-center justify-center gap-1.5 text-xs uppercase tracking-widest text-muted lg:justify-start">
                  <Calendar className="h-3.5 w-3.5" aria-hidden />
                  Tournament Dates
                </p>
                <p className="font-display text-3xl tracking-wide text-gold">
                  JUN 11 — JUL 19
                </p>
              </div>
              <div className="flex gap-2">
                {["🇺🇸", "🇨🇦", "🇲🇽"].map((flag) => (
                  <span
                    key={flag}
                    className="flex h-14 w-14 items-center justify-center rounded-xl glass-panel glass-panel-interactive text-2xl"
                  >
                    {flag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="animate-fade-up animate-delay-5 grid grid-cols-2 gap-3 sm:gap-4">
            {stats.map((stat) => (
              <StatCard
                key={stat.label}
                value={stat.value}
                label={stat.label}
                icon={stat.icon}
                layout="stacked"
              />
            ))}
          </div>
        </div>
      </section>

      <section id="hosts" className="relative z-10 mx-auto max-w-6xl px-6 py-20">
        <SectionHeading
          eyebrow="First Tri-Host Tournament"
          title="THREE NATIONS, ONE DREAM"
          icon={Globe2}
        />
        <div className="grid gap-6 md:grid-cols-3">
          {hostNations.map((nation) => (
            <article
              key={nation.country}
              className="group relative overflow-hidden rounded-2xl glass-panel glass-panel-interactive p-6"
            >
              <div
                className={`absolute inset-x-0 top-0 h-24 bg-gradient-to-b ${nation.accent} to-transparent opacity-20 transition-opacity group-hover:opacity-35`}
                aria-hidden
              />
              <span className="relative text-5xl drop-shadow-lg">{nation.flag}</span>
              <h3 className="relative mt-5 font-display text-3xl tracking-wide">
                {nation.country.toUpperCase()}
              </h3>
              <p className="relative mt-1 flex items-center gap-1.5 text-sm font-medium text-gold">
                <MapPin className="h-3.5 w-3.5" aria-hidden />
                {nation.cities} host cities
              </p>
              <p className="relative mt-4 text-sm leading-relaxed text-muted">
                {nation.detail}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section
        id="schedule"
        className="relative z-10 border-y border-white/8 bg-navy-light/25 py-20"
      >
        <div className="mx-auto max-w-6xl px-6">
          <SectionHeading
            eyebrow="Opening Day · June 11"
            title="OPENING FIXTURES"
            icon={CalendarDays}
          >
            <Link
              href="/fixtures"
              className="group flex items-center gap-2 text-sm font-semibold text-gold transition-colors hover:text-foreground"
            >
              View all {matchCount} matches
              <ArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
                aria-hidden
              />
            </Link>
          </SectionHeading>
          {openingFixtures.length > 0 ? (
            <div className="fixture-grid grid gap-3 md:grid-cols-3">
              {openingFixtures.map((fixture) => (
                <FixtureCard key={fixture.id} fixture={fixture} />
              ))}
            </div>
          ) : (
            <p className="text-muted">
              Opening day fixtures are not available yet.{" "}
              <Link href="/fixtures" className="text-gold hover:text-foreground">
                View the full schedule
              </Link>
              .
            </p>
          )}
        </div>
      </section>

      <section id="cities" className="relative z-10 mx-auto max-w-6xl px-6 py-20">
        <SectionHeading
          eyebrow="Venues"
          title={`${HOST_CITIES} HOST CITIES`}
          icon={Landmark}
        >
          <p className="max-w-sm text-sm leading-relaxed text-muted">
            From the Azteca&apos;s roar to SoFi&apos;s spectacle — world-class
            stadiums across the continent.
          </p>
        </SectionHeading>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {hostCities.map((city) => (
            <div
              key={city.city}
              className="glass-panel glass-panel-interactive rounded-xl px-4 py-3"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="font-medium text-foreground">{city.city}</p>
                <span className="shrink-0 rounded bg-white/5 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted">
                  {city.country}
                </span>
              </div>
              <p className="mt-1.5 flex items-center gap-1 text-xs text-muted">
                <Landmark className="h-3 w-3 shrink-0 text-pitch-bright/60" aria-hidden />
                {city.venue}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section id="notify" className="relative z-10 mx-auto max-w-6xl px-6 pb-8">
        <div className="card-border relative overflow-hidden rounded-3xl p-px">
          <div className="relative rounded-3xl bg-navy-light/90 px-8 py-14 text-center backdrop-blur-md md:px-16">
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
            <p className="relative mx-auto mt-4 max-w-md text-muted">
              Be the first to know when fixtures drop, tickets go on sale, and
              Footy Arena launches full tournament coverage.
            </p>
            <div className="relative mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
              <input
                type="email"
                placeholder="you@email.com"
                aria-label="Email address"
                disabled
                className="flex-1 cursor-not-allowed rounded-full border border-white/10 bg-background/50 px-5 py-3 text-sm text-muted placeholder:text-muted/60"
              />
              <button
                type="button"
                disabled
                className="flex cursor-not-allowed items-center justify-center gap-2 rounded-full border border-white/10 bg-navy-light px-6 py-3 text-sm font-semibold text-muted"
                aria-disabled="true"
              >
                <Bell className="h-4 w-4" aria-hidden />
                Coming soon
              </button>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </PageShell>
  );
}
