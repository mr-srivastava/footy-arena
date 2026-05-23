import { Calendar, Globe2, MapPin, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ContentContainer } from "@/components/content-container";
import { StatCard } from "@/components/stat-card";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  HOST_CITIES,
  HOST_COUNTRIES,
  TOURNAMENT_NATIONS,
} from "@/lib/openfootball/constants";
import { getWorldCupFixtures } from "@/lib/openfootball/fixtures";

function buildTickerItems(stats: { ticker: string }[]): string[] {
  const items = stats.flatMap((s) => [s.ticker, "·"]);
  items.push("JUN 11 - JUL 19", "·");
  return items;
}

export function HomeHeroSkeleton() {
  return (
    <>
      <div
        className="relative z-10 overflow-hidden border-b border-white/6 bg-navy/80 py-2"
        aria-hidden
      >
        <Skeleton className="mx-6 h-4 w-64" />
      </div>
      <ContentContainer as="div" className="pb-24 pt-10 md:pt-16">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div className="text-center lg:text-left">
            <Skeleton className="mx-auto h-4 w-32 lg:mx-0" />
            <Skeleton className="mx-auto mt-6 h-28 w-64 lg:mx-0" />
            <Skeleton className="mx-auto mt-6 h-20 w-full max-w-lg lg:mx-0" />
            <Skeleton className="mx-auto mt-10 h-24 w-72 lg:mx-0" />
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-2xl" />
            ))}
          </div>
        </div>
      </ContentContainer>
    </>
  );
}

export async function HomeHero() {
  const { fixtures } = await getWorldCupFixtures();
  const matchCount = fixtures.length;

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
    <>
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

      <ContentContainer as="div" className="pb-24 pt-10 md:pt-16">
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
              <Card accent="gold" padding="none" className="rounded-2xl">
                <CardContent className="px-8 py-4">
                  <p className="flex items-center justify-center gap-1.5 text-xs uppercase tracking-widest text-muted-foreground lg:justify-start">
                    <Calendar className="h-3.5 w-3.5" aria-hidden />
                    Tournament Dates
                  </p>
                  <p className="font-display text-3xl tracking-wide text-gold">
                    JUN 11 - JUL 19
                  </p>
                </CardContent>
              </Card>
              <div className="flex gap-2">
                {["🇺🇸", "🇨🇦", "🇲🇽"].map((flag) => (
                  <Card
                    key={flag}
                    interactive
                    padding="none"
                    className="flex size-14 items-center justify-center rounded-xl text-2xl"
                  >
                    {flag}
                  </Card>
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
      </ContentContainer>
    </>
  );
}
