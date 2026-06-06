import { Calendar } from "lucide-react";
import { ContentContainer } from "@/components/content-container";
import { TournamentBoard } from "@/components/home/tournament-board";
import { MediaImage } from "@/components/media-image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
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
            <div className="rounded-xl border border-gold/20 bg-gold/8 px-5 py-3">
              <Skeleton className="h-3 w-36 rounded-sm" />
              <Skeleton className="mt-2 h-8 w-44 rounded-sm" />
            </div>
            <div className="flex gap-2">
              {Array.from({ length: 3 }, (_, index) => (
                <Skeleton
                  key={index}
                  className="size-12 rounded-full md:size-14"
                />
              ))}
            </div>
          </div>
        </div>

        <div className="relative">
          <Card
            variant="artifact"
            shape="artifact"
            padding="none"
            className="relative shadow-board"
          >
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

  const stats = [
    {
      value: TOURNAMENT_NATIONS,
      label: "Nations",
      icon: "users" as const,
      ticker: `${TOURNAMENT_NATIONS} NATIONS`,
    },
    {
      value: matchCount,
      label: "Matches",
      icon: "calendar" as const,
      ticker: `${matchCount} MATCHES`,
    },
    {
      value: HOST_CITIES,
      label: "Host Cities",
      icon: "map-pin" as const,
      ticker: `${HOST_CITIES} CITIES`,
    },
    {
      value: HOST_COUNTRIES,
      label: "Countries",
      icon: "globe" as const,
      ticker: `${HOST_COUNTRIES} HOST COUNTRIES`,
    },
  ];

  return (
    <section className="relative isolate min-h-[78vh] overflow-hidden border-b border-line-soft">
      <MediaImage
        src={HOME_HERO_IMAGE}
        alt="World Cup 2026 host stadium atmosphere"
        overlay="hero"
        priority
        className="absolute inset-0 -z-20"
        imageClassName="scale-105"
        sizes="100vw"
      />
      <div className="hero-ink-overlay absolute inset-0 -z-10" />
      <ContentContainer
        as="div"
        className="flex min-h-[78vh] flex-col justify-end pb-10 pt-24 md:pb-14"
      >
        <div className="grid items-end gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <div>
            <p className="animate-fade-up animate-delay-1 section-eyebrow justify-center lg:justify-start">
              FIFA World Cup · North America
            </p>

            <div className="relative mt-5">
              <h1 className="animate-fade-up animate-delay-2 editorial-title type-hero relative max-w-4xl text-white">
                The world comes
                <span className="block text-gold">to play.</span>
              </h1>
            </div>

            <p className="animate-fade-up animate-delay-3 type-lead mt-8 max-w-xl text-white/70">
              Football&apos;s greatest ceremony returns to North America.{" "}
              <span className="text-foreground">
                {TOURNAMENT_NATIONS} nations
              </span>
              , <span className="text-foreground">{matchCount} matches</span>,
              three countries united by the beautiful game.
            </p>

            <div className="animate-fade-up animate-delay-4 mt-9 flex flex-col items-start gap-4 sm:flex-row">
              <div className="relative overflow-hidden rounded-xl border border-gold/35 bg-black/30 px-5 py-3 backdrop-blur-md">
                <div
                  className="absolute inset-y-0 left-0 w-1 bg-gold"
                  aria-hidden
                />
                <p className="type-label flex items-center justify-center gap-1.5 tracking-[var(--tracking-board)] text-muted-foreground lg:justify-start">
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
                    className="flex size-12 items-center justify-center rounded-full border border-line-strong bg-surface-glass text-2xl shadow-artifact-inset md:size-14"
                  >
                    {flag}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="animate-fade-up animate-delay-5 relative">
            <div
              className="absolute -inset-x-8 top-1/2 hidden h-px bg-gradient-to-r from-transparent via-pitch-bright/30 to-transparent lg:block"
              aria-hidden
            />
            <TournamentBoard stats={stats} />
          </div>
        </div>
      </ContentContainer>
    </section>
  );
}
