"use client";

import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeading } from "@/components/section-heading";

type Player = {
  name: string;
  country: string;
  flag: string;
  role: string;
  achievement: string;
};

type Era = {
  year: string;
  title: string;
  headline: string;
  narrative: string;
  image: string;
  overlay: string;
  accent: string;
  players: Player[];
};

const ERAS: Era[] = [
  {
    year: "1930-1954",
    title: "The Birth of a Religion",
    headline: "The world didn't know it needed this. Then it did.",
    narrative:
      "Football's first World Cup had 13 teams, no television, and no idea what it was starting. By 1950, it had already broken hearts on a scale nothing else in sport could match. Brazil built the largest stadium on earth for a tournament they were certain to win. Uruguay had other ideas. 200,000 people sat in silence. A nation wept for a generation. This wasn't just a game anymore.",
    image:
      "https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=1920&q=80",
    overlay: "from-navy/20 via-navy/40 to-navy/90",
    accent: "text-gold",
    players: [
      {
        name: "José Nasazzi",
        country: "Uruguay",
        flag: "🇺🇾",
        role: "Captain & Defender",
        achievement:
          "Captained Uruguay to win the very first World Cup in 1930. Known as 'El Terrible' - a wall no opponent could break through.",
      },
      {
        name: "Ademir",
        country: "Brazil",
        flag: "🇧🇷",
        role: "Forward",
        achievement:
          "Top scorer of the 1950 World Cup with 9 goals. Played in the tournament Brazil was supposed to win - and didn't. His goals were not enough to stop the heartbreak.",
      },
      {
        name: "Fritz Walter",
        country: "West Germany",
        flag: "🇩🇪",
        role: "Midfielder",
        achievement:
          "Led West Germany to a stunning upset in the 1954 final against the seemingly invincible Hungary. The 'Miracle of Bern' - one of sport's first great underdog stories.",
      },
    ],
  },
  {
    year: "1958-1970",
    title: "The Age of Pelé",
    headline: "A 17-year-old kid showed up and rewrote what was possible.",
    narrative:
      "Brazil in this era didn't play football. They composed it. Pelé arrived at his first World Cup as a teenager and left as a global phenomenon. By 1970, the team he anchored is still considered the greatest international side ever assembled. They didn't just win - they made you fall in love with how they did it. Yellow shirts. Samba rhythm. A ball that seemed to obey different laws of physics.",
    image:
      "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1920&q=80",
    overlay: "from-pitch/30 via-navy/50 to-navy/95",
    accent: "text-pitch-bright",
    players: [
      {
        name: "Pelé",
        country: "Brazil",
        flag: "🇧🇷",
        role: "Forward",
        achievement:
          "The only player in history to win three World Cups. Scored in his very first final at age 17, wept when it ended, and went on to become the most recognised footballer who ever lived.",
      },
      {
        name: "Garrincha",
        country: "Brazil",
        flag: "🇧🇷",
        role: "Winger",
        achievement:
          "Born with legs of unequal length, walked with a limp, and still made defenders look foolish. Brazil never lost a single match when both Pelé and Garrincha played together. Not one.",
      },
      {
        name: "Eusébio",
        country: "Portugal",
        flag: "🇵🇹",
        role: "Forward",
        achievement:
          "Nine goals at the 1966 World Cup - the tournament's top scorer. Born in Mozambique, adopted by Portugal, adored by everyone. Wept openly when Portugal were eliminated. The cameras never looked away.",
      },
    ],
  },
  {
    year: "1974-1986",
    title: "Gods & Rebels",
    headline:
      "One man punched a ball into a net. Then scored the goal of the century. In the same game.",
    narrative:
      "This era belonged to individuals so extraordinary they changed what we thought one person could do on a football pitch. The Dutch invented an entirely new way of playing - Total Football, where every player did everything. Then Maradona arrived. In a single quarter-final against England, he produced the most controversial goal ever scored and the most beautiful goal ever scored - four minutes apart. The world couldn't decide whether to be furious or amazed.",
    image:
      "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1920&q=80",
    overlay: "from-red/20 via-navy/50 to-navy/95",
    accent: "text-gold",
    players: [
      {
        name: "Diego Maradona",
        country: "Argentina",
        flag: "🇦🇷",
        role: "Attacking Midfielder",
        achievement:
          "Single-handedly carried Argentina to the 1986 title. In that tournament he scored or assisted in every match except one. His 'Goal of the Century' - a 60-yard solo run past five England players - was voted the greatest goal in World Cup history by the public.",
      },
      {
        name: "Johan Cruyff",
        country: "Netherlands",
        flag: "🇳🇱",
        role: "Forward",
        achievement:
          "Led the Netherlands to the 1974 final playing a style of football so revolutionary it has its own name: Total Football. Every player attacked. Every player defended. The world had never seen anything like it. They lost the final - but won football's imagination forever.",
      },
      {
        name: "Paolo Rossi",
        country: "Italy",
        flag: "🇮🇹",
        role: "Forward",
        achievement:
          "Arrived at the 1982 World Cup having just served a match-fixing ban. Scored zero goals in the group stage. Then scored a hat-trick against Brazil, two against Poland, and two in the final. One of the greatest redemption arcs sport has ever produced.",
      },
    ],
  },
  {
    year: "1990-2006",
    title: "Drama at the Edge of the World",
    headline: "Penalty shootouts. Tears. Zidane headbutted a man in a World Cup final.",
    narrative:
      "Football discovered that the most devastating moments don't come from goals - they come from misses. Roberto Baggio stepped up for Italy's decisive penalty in 1994, looked to the sky, and fired it over. The shootout became sport's cruelest theatre. Meanwhile France, a country of immigrants and contradictions, won on home soil in 1998 with a squad that looked like the world. Brazil's Ronaldo came back from a mysterious illness to lead them to glory in 2002. And Zidane - the most elegant player of his generation - ended his career by headbutting a man in a World Cup final. It was completely insane. Nobody looked away.",
    image:
      "https://images.unsplash.com/photo-1543351611-58f69d7c1781?auto=format&fit=crop&w=1920&q=80",
    overlay: "from-teal/20 via-navy/50 to-navy/95",
    accent: "text-teal",
    players: [
      {
        name: "Zinedine Zidane",
        country: "France",
        flag: "🇫🇷",
        role: "Midfielder",
        achievement:
          "Scored twice in the 1998 World Cup final to give France its first title - on home soil, in front of 80,000 people. Eight years later, led France to another final at age 34 and was named the tournament's best player. Then headbutted someone in the 110th minute and was sent off. Still got the award.",
      },
      {
        name: "Ronaldo (R9)",
        country: "Brazil",
        flag: "🇧🇷",
        role: "Forward",
        achievement:
          "Won the 2002 Golden Boot with 8 goals, including two in the final. Had suffered a mysterious seizure the night before the 1998 final and played anyway - then returned four years later to score the winner and reduced an entire country to tears of joy.",
      },
      {
        name: "Roberto Baggio",
        country: "Italy",
        flag: "🇮🇹",
        role: "Attacking Midfielder",
        achievement:
          "Dragged Italy to the 1994 final almost single-handedly. Scored five goals in the knockout rounds. Then missed the decisive penalty in the shootout. The image of him standing with his head bowed as the ball sailed over is one of the most iconic photographs in sporting history.",
      },
    ],
  },
  {
    year: "2010-2022",
    title: "The GOAT Debate",
    headline:
      "For twelve years, the world argued about who was the greatest. In 2022, Messi ended the conversation.",
    narrative:
      "Two players dominated an era like no two before them - Messi and Cristiano Ronaldo. One Argentine, one Portuguese. One quiet and instinctive, one relentless and driven. The debate consumed football for over a decade. Meanwhile, Spain passed their way to a title nobody could stop. Germany scored seven goals in a single semi-final. Morocco became the first African nation to reach a World Cup semi-final. And then, in Qatar, in the greatest final ever played, Messi finally won it - at 35, in his fifth and last World Cup, in a match that went to extra time and penalties and took three and a half hours and ended with grown men crying in stadiums on every continent.",
    image:
      "https://images.unsplash.com/photo-1705593973313-75de7bf95b56?auto=format&fit=crop&w=1920&q=80",
    overlay: "from-gold/15 via-navy/50 to-navy/95",
    accent: "text-gold",
    players: [
      {
        name: "Lionel Messi",
        country: "Argentina",
        flag: "🇦🇷",
        role: "Forward",
        achievement:
          "The only player to win the Golden Ball - best player award - at two different World Cups. Played in a record 26 World Cup matches. Scored 13 goals across five tournaments. In 2022, he won the one trophy that had eluded him, and the world exhaled.",
      },
      {
        name: "Kylian Mbappé",
        country: "France",
        flag: "🇫🇷",
        role: "Forward",
        achievement:
          "Became only the second teenager after Pelé to score in a World Cup final, in 2018 at age 19. In the 2022 final alone, scored a hat-trick - including two goals in the final three minutes of normal time that nearly stole the trophy from Messi. The next era is already his.",
      },
      {
        name: "Andrés Iniesta",
        country: "Spain",
        flag: "🇪🇸",
        role: "Midfielder",
        achievement:
          "Scored the only goal of the 2010 World Cup final - in extra time, against the Netherlands, in a match so tense it felt like it lasted three days. The quietest player on the pitch. The most important one. Spain's entire golden era ran through him.",
      },
    ],
  },
];

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

function PlayerCard({ player }: { player: Player }) {
  return (
    <Card padding="none">
      <CardContent className="flex flex-col p-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl leading-none" aria-hidden>
            {player.flag}
          </span>
          <div className="min-w-0">
            <h4 className="font-semibold leading-tight text-foreground">
              {player.name}
            </h4>
            <p className="mt-0.5 text-xs text-gold">{player.role}</p>
            <p className="text-xs text-muted-foreground">{player.country}</p>
          </div>
        </div>
        <p className="mt-3 flex-1 text-xs leading-relaxed text-muted-foreground">
          {player.achievement}
        </p>
      </CardContent>
    </Card>
  );
}

function EraSlide({ era, index }: { era: Era; index: number }) {
  return (
    <article
      data-slide={index}
      id={`history-slide-${index}`}
      className="history-carousel-slide-item flex min-h-[min(85vh,780px)] w-full shrink-0 snap-start flex-col lg:min-h-[640px] lg:flex-row"
      aria-labelledby={`history-era-title-${index}`}
    >
      <div className="relative h-52 shrink-0 bg-navy sm:h-64 lg:h-auto lg:min-h-full lg:w-[44%] lg:self-stretch">
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
        <div className="absolute bottom-4 left-4 lg:bottom-8 lg:left-8">
          <p
            className={`font-display text-4xl tracking-wide sm:text-5xl ${era.accent}`}
          >
            {era.year}
          </p>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-navy-light/95 px-6 py-8 sm:px-8 lg:px-10 lg:py-10">
        <p className="section-eyebrow">{era.title}</p>
        <h3
          id={`history-era-title-${index}`}
          className="mt-2 font-display text-3xl leading-tight tracking-wide text-foreground sm:text-4xl"
        >
          {era.headline}
        </h3>
        <p className="mt-4 text-sm leading-relaxed text-muted sm:text-base">
          {era.narrative}
        </p>

        <div className="mt-8">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-pitch-bright/80">
            Legends of the era
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {era.players.map((player) => (
              <PlayerCard key={player.name} player={player} />
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
      const i = (next + ERAS.length) % ERAS.length;
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
      scrollToIndex(ERAS.length - 1);
    }
  };

  return (
    <section
      id="history"
      aria-label="Why the World Cup matters"
      className="relative z-10 border-y border-white/8"
    >
      <div className="relative mx-auto max-w-6xl px-6 py-16 md:py-20">
        <SectionHeading
          align="center"
          className="mb-0"
          eyebrow="Act II - Mythology"
          title="WHY IT MATTERS"
          icon={Clock}
          subtitle="Five eras. Scroll sideways - or use the arrows - through the story of the tournament."
        />
      </div>

      <div className="mx-auto max-w-6xl px-6 pb-16 md:pb-20">
        <div
          className="history-carousel card-border relative rounded-3xl p-px"
          role="region"
          aria-roledescription="carousel"
          aria-label="World Cup history by era"
          tabIndex={0}
          onKeyDown={onKeyDown}
        >
          <div className="relative overflow-hidden rounded-3xl bg-navy">
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
              {ERAS.map((era, i) => (
                <EraSlide key={era.year} era={era} index={i} />
              ))}
            </div>

            <button
              type="button"
              onClick={goPrev}
              className="absolute left-3 top-1/2 z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-navy/80 text-foreground backdrop-blur-sm transition-colors hover:border-pitch-bright/40 hover:bg-navy-light/90 sm:left-4"
              aria-label="Previous era"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden />
            </button>
            <button
              type="button"
              onClick={goNext}
              className="absolute right-3 top-1/2 z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-navy/80 text-foreground backdrop-blur-sm transition-colors hover:border-pitch-bright/40 hover:bg-navy-light/90 sm:right-4"
              aria-label="Next era"
            >
              <ChevronRight className="h-5 w-5" aria-hidden />
            </button>
          </div>

          <div
            className="flex flex-col gap-3 rounded-b-3xl bg-navy-light/40 px-4 py-4 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between"
            role="tablist"
            aria-label="Select an era"
          >
            <p className="text-center text-xs font-semibold uppercase tracking-[0.35em] text-muted/70 sm:text-left">
              {index + 1} / {ERAS.length}
              <span className="mx-2 text-white/20" aria-hidden>
                ·
              </span>
              <span className="text-pitch-bright/70">Scroll sideways</span>
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {ERAS.map((item, i) => (
                <button
                  key={item.year}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-controls={`history-slide-${i}`}
                  onClick={() => scrollToIndex(i)}
                  className={`rounded-full px-3 py-1.5 font-display text-base tracking-wide transition-colors sm:px-4 sm:py-2 sm:text-lg ${i === index
                    ? "bg-pitch/25 text-pitch-bright ring-1 ring-pitch-bright/35"
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
