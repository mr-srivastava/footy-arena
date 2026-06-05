import { Calendar, Globe2, MapPin, Trophy, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ContentContainer } from "@/components/content-container";
import { MediaImage } from "@/components/media-image";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { HOME_HERO_IMAGE } from "@/lib/discovery";
import {
  HOST_CITIES,
  HOST_COUNTRIES,
  TOURNAMENT_NATIONS,
} from "@/lib/openfootball/constants";
import { getHomeHeroData } from "@/lib/page-data/home";

export function HomeHeroSkeleton() {
  return (
    <ContentContainer as="div" className="pb-24 pt-10 md:pt-16">
      <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        <div className="text-center lg:text-left">
          <Skeleton className="mx-auto h-4 w-36 rounded-sm lg:mx-0" />
          <div className="relative mt-2">
            <Skeleton className="mx-auto h-28 w-56 rounded-sm md:h-36 md:w-72 lg:mx-0" />
          </div>
          <div className="mx-auto mt-6 flex max-w-lg flex-col gap-2 lg:mx-0">
            <Skeleton className="h-5 w-full rounded-sm" />
            <Skeleton className="h-5 w-5/6 rounded-sm" />
          </div>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start">
            <div className="rounded-sm border border-gold/20 bg-gold/8 px-5 py-3">
              <Skeleton className="h-3 w-36 rounded-sm" />
              <Skeleton className="mt-2 h-8 w-44 rounded-sm" />
            </div>
            <div className="flex gap-2">
              {Array.from({ length: 3 }, (_, index) => (
                <Skeleton key={index} className="size-12 rounded-sm md:size-14" />
              ))}
            </div>
          </div>
        </div>

        <div className="relative">
          <Card variant="artifact" shape="artifact" padding="none" className="relative shadow-board">
            <CardHeader className="flex flex-row items-center justify-between border-b border-line-soft px-4 py-3">
              <Skeleton className="h-3 w-40 rounded-sm" />
              <Skeleton className="h-3 w-24 rounded-sm" />
            </CardHeader>
            <CardContent className="grid grid-cols-4 divide-x divide-line-soft p-0">
              {Array.from({ length: 4 }, (_, index) => (
                <div key={index} className="p-3 md:p-5">
                  <Skeleton className="mb-3 size-4 rounded-sm md:mb-8" />
                  <Skeleton className="h-9 w-12 rounded-sm md:h-12 md:w-16" />
                  <Skeleton className="mt-3 h-3 w-16 rounded-sm" />
                </div>
              ))}
            </CardContent>
            <CardFooter className="grid grid-cols-[1fr_auto] items-center border-line-soft px-4 py-3">
              <Skeleton className="h-3 w-40 rounded-sm" />
              <Skeleton className="h-6 w-12 rounded-sm" />
            </CardFooter>
          </Card>
        </div>
      </div>
    </ContentContainer>
  );
}

export async function HomeHero() {
  const { matchCount } = await getHomeHeroData();

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

  return (
    <>

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

            <div className="animate-fade-up animate-delay-4 mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start">
              <div className="relative overflow-hidden rounded-sm border border-gold/35 bg-gold/8 px-5 py-3 shadow-artifact-inset">
                <div
                  className="absolute inset-y-0 left-0 w-1 bg-gold"
                  aria-hidden
                />
                <p className="flex items-center justify-center gap-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground lg:justify-start">
                  <Calendar className="h-3.5 w-3.5" aria-hidden />
                  Tournament Dates
                </p>
                <p className="font-display text-2xl tracking-wide text-gold md:text-3xl">
                  JUN 11 - JUL 19
                </p>
              </div>
              <div className="flex gap-2" aria-label="Host nations">
                {["🇺🇸", "🇨🇦", "🇲🇽"].map((flag) => (
                  <div
                    key={flag}
                    className="flex size-12 items-center justify-center rounded-sm border border-line-strong bg-surface-glass text-2xl shadow-artifact-inset md:size-14"
                  >
                    {flag}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="animate-fade-up animate-delay-5 relative">
            <MediaImage
              src={HOME_HERO_IMAGE}
              alt="World Cup 2026 host stadium atmosphere"
              overlay="hero"
              className="absolute -inset-4 -z-10 hidden rounded-sm opacity-35 lg:block"
              sizes="40vw"
            />
            <div
              className="absolute -inset-x-8 top-1/2 hidden h-px bg-gradient-to-r from-transparent via-pitch-bright/30 to-transparent lg:block"
              aria-hidden
            />
            <Card
              variant="artifact"
              shape="artifact"
              padding="none"
              className="relative shadow-board"
            >
              <CardHeader className="flex flex-row items-center justify-between border-b border-line-soft px-4 py-3 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                <span className="flex items-center gap-2 text-gold">
                  <Trophy className="h-3.5 w-3.5" aria-hidden />
                  Tournament Board
                </span>
                <span>North America</span>
              </CardHeader>
              <CardContent className="grid grid-cols-4 divide-x divide-line-soft p-0">
                {stats.map((stat) => (
                  <div key={stat.label} className="p-3 md:p-5">
                    <stat.icon
                      className="mb-3 h-3.5 w-3.5 text-pitch-bright/75 md:mb-8 md:h-4 md:w-4"
                      aria-hidden
                    />
                    <p className="font-display text-3xl leading-none text-pitch-bright md:text-5xl">
                      {stat.value}
                    </p>
                    <p className="mt-2 text-[0.58rem] font-semibold uppercase tracking-[0.1em] text-muted-foreground md:text-[0.68rem] md:tracking-[0.16em]">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </CardContent>
              <CardFooter className="grid grid-cols-[1fr_auto] items-center border-line-soft px-4 py-3 text-xs text-muted-foreground">
                <span>Expanded 48-team format</span>
                <span className="font-display text-xl tracking-wide text-gold">
                  2026
                </span>
              </CardFooter>
            </Card>
          </div>
        </div>
      </ContentContainer>
    </>
  );
}
