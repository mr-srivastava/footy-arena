"use client";

import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { SectionHeading } from "@/components/section-heading";
import { WORLD_CUP_HISTORY_ERAS } from "@/lib/discovery/content/history";
import type { HistoryEra, HistoryLegend } from "@/lib/discovery/types";
import { artifactSurface } from "@/lib/utils";

function subscribeToReducedMotion(onStoreChange: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", onStoreChange);
  return () => mq.removeEventListener("change", onStoreChange);
}

function getReducedMotionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );
}

function HistoryLegendCard({ player }: { player: HistoryLegend }) {
  return (
    <article
      className={artifactSurface(
        "group/legend relative flex h-full min-h-32 flex-col overflow-hidden bg-background/35 transition-colors hover:border-gold/30",
      )}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-gold/10 to-transparent opacity-70"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-1 top-3 text-5xl leading-none opacity-[0.07] transition-opacity group-hover/legend:opacity-[0.12]"
        aria-hidden
      >
        {player.flag}
      </div>

      <div className="relative flex items-start gap-3 border-b border-white/8 p-3">
          <span
            className="flex size-9 items-center justify-center rounded-sm border border-white/10 bg-white/5 text-xl leading-none"
            aria-hidden
          >
            {player.flag}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-gold">
              {player.country}
            </p>
            <h4 className="mt-1 font-display text-xl leading-none tracking-wide text-foreground">
              {player.name}
            </h4>
            <p className="mt-2 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              {player.role}
            </p>
          </div>
      </div>

      <div className="relative flex flex-1 flex-col justify-between p-3">
        <p className="text-xs leading-relaxed text-muted-foreground">
          {player.achievement}
        </p>
        <div className="mt-3 h-px w-10 bg-gradient-to-r from-pitch-bright/70 to-transparent" />
      </div>
    </article>
  );
}

function EraSlide({ era, index }: { era: HistoryEra; index: number }) {
  return (
    <article
      data-slide={index}
      id={`history-slide-${index}`}
      className="history-carousel-slide-item grid min-h-[520px] w-full shrink-0 snap-start lg:min-h-[500px] lg:grid-cols-[0.9fr_1.1fr]"
      aria-labelledby={`history-era-title-${index}`}
    >
      <div className="relative min-h-48 bg-navy lg:min-h-full">
        <Image
          src={era.image}
          alt={`Atmosphere for ${era.title}`}
          fill
          sizes="(max-width: 1024px) 100vw, 44vw"
          className="object-cover"
          priority={index === 0}
        />
        <div
          className={`absolute inset-0 bg-gradient-to-r ${era.overlay}`}
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-navy/30 lg:to-navy"
          aria-hidden
        />
        <div className="grain absolute inset-0" aria-hidden />
        <div className="absolute bottom-5 left-5 lg:bottom-8 lg:left-8">
          <p className="mb-2 text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-white/55">
            Archive frame
          </p>
          <p
            className={`font-display text-4xl leading-none tracking-wide sm:text-5xl ${era.accent}`}
          >
            {era.year}
          </p>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-artifact-deep px-5 py-6 sm:px-6 lg:px-8 lg:py-7">
        <p className="section-eyebrow">{era.title}</p>
        <h3
          id={`history-era-title-${index}`}
          className="mt-2 max-w-xl font-display text-3xl leading-none tracking-wide text-foreground sm:text-4xl"
        >
          {era.headline}
        </h3>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
          {era.narrative}
        </p>

        <div className="mt-6">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-pitch-bright/80">
            Legends of the era
          </p>
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            {era.players.map((player) => (
              <HistoryLegendCard key={player.name} player={player} />
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}

export default function History() {
  const [index, setIndex] = useState(0);
  const reducedMotion = usePrefersReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);

  const scrollToIndex = useCallback(
    (next: number) => {
      const i = (next + WORLD_CUP_HISTORY_ERAS.length) % WORLD_CUP_HISTORY_ERAS.length;
      const track = trackRef.current;
      const slide = track?.querySelector<HTMLElement>(`[data-slide="${i}"]`);
      if (!slide) return;
      slide.scrollIntoView({
        behavior: reducedMotion ? "auto" : "smooth",
        inline: "start",
        block: "nearest",
      });
      setIndex(i);
    },
    [reducedMotion],
  );

  const goNext = useCallback(
    () => scrollToIndex(index + 1),
    [scrollToIndex, index],
  );
  const goPrev = useCallback(
    () => scrollToIndex(index - 1),
    [scrollToIndex, index],
  );

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const slides = track.querySelectorAll<HTMLElement>("[data-slide]");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.55) {
            const i = Number((entry.target as HTMLElement).dataset.slide);
            if (!Number.isNaN(i)) setIndex(i);
          }
        }
      },
      { root: track, threshold: [0.55, 0.75] },
    );

    slides.forEach((slide) => observer.observe(slide));
    return () => observer.disconnect();
  }, []);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      goNext();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      goPrev();
    } else if (e.key === "Home") {
      e.preventDefault();
      scrollToIndex(0);
    } else if (e.key === "End") {
      e.preventDefault();
      scrollToIndex(WORLD_CUP_HISTORY_ERAS.length - 1);
    }
  };

  return (
    <section
      id="history"
      aria-label="Why the World Cup matters"
      className="relative z-10 border-y border-white/8 bg-background/45"
    >
      <div className="relative mx-auto max-w-6xl px-6 py-10 md:py-12">
        <SectionHeading
          align="center"
          className="mb-0"
          eyebrow="Act II - Mythology"
          title="WHY IT MATTERS"
          icon={Clock}
          subtitle="Five eras. Scroll sideways - or use the arrows - through the story of the tournament."
        />
      </div>

      <div className="mx-auto max-w-6xl px-6 pb-10 md:pb-12">
        <div
          className={artifactSurface(
            "history-carousel relative overflow-hidden",
          )}
          role="region"
          aria-roledescription="carousel"
          aria-label="World Cup history by era"
          tabIndex={0}
          onKeyDown={onKeyDown}
        >
          <div className="relative overflow-hidden bg-navy">
            <div
              className="pointer-events-none absolute inset-y-0 left-0 z-20 w-8 bg-gradient-to-r from-navy to-transparent"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute inset-y-0 right-0 z-20 w-8 bg-gradient-to-l from-navy to-transparent"
              aria-hidden
            />

            <div
              ref={trackRef}
              id="history-carousel-panel"
              className="history-carousel-track flex overflow-x-auto overscroll-x-contain"
              aria-live="polite"
              onTouchStart={(e) => {
                touchStartX.current = e.touches[0]?.clientX ?? null;
              }}
              onTouchEnd={(e) => {
                if (touchStartX.current === null) return;
                const endX = e.changedTouches[0]?.clientX;
                if (endX === undefined) return;
                const delta = endX - touchStartX.current;
                touchStartX.current = null;
                if (delta < -48) goNext();
                else if (delta > 48) goPrev();
              }}
            >
              {WORLD_CUP_HISTORY_ERAS.map((era, i) => (
                <EraSlide key={era.year} era={era} index={i} />
              ))}
            </div>

            <button
              type="button"
              onClick={goPrev}
              className="absolute left-3 top-1/2 z-30 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-sm border border-white/10 bg-navy/80 text-foreground backdrop-blur-sm transition-colors hover:border-pitch-bright/40 hover:bg-navy-light/90 sm:left-4"
              aria-label="Previous era"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden />
            </button>
            <button
              type="button"
              onClick={goNext}
              className="absolute right-3 top-1/2 z-30 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-sm border border-white/10 bg-navy/80 text-foreground backdrop-blur-sm transition-colors hover:border-pitch-bright/40 hover:bg-navy-light/90 sm:right-4"
              aria-label="Next era"
            >
              <ChevronRight className="h-4 w-4" aria-hidden />
            </button>
          </div>

          <div
            className="flex flex-col gap-3 border-t border-white/8 bg-background/30 px-4 py-3 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between"
            role="tablist"
            aria-label="Select an era"
          >
            <p className="text-center text-xs font-semibold uppercase tracking-[0.35em] text-muted/70 sm:text-left">
              {index + 1} / {WORLD_CUP_HISTORY_ERAS.length}
              <span className="mx-2 text-white/20" aria-hidden>
                ·
              </span>
              <span className="text-pitch-bright/70">Scroll sideways</span>
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {WORLD_CUP_HISTORY_ERAS.map((item, i) => (
                <button
                  key={item.year}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-controls={`history-slide-${i}`}
                  onClick={() => scrollToIndex(i)}
                  className={`rounded-sm px-3 py-1.5 font-display text-sm tracking-wide transition-colors sm:px-3 sm:py-1.5 sm:text-base ${i === index
                    ? "bg-pitch/20 text-pitch-bright ring-1 ring-pitch-bright/35"
                    : "text-muted hover:bg-white/5 hover:text-foreground"
                    }`}
                >
                  {item.year}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
