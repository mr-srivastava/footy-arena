"use client";

import { motion, useReducedMotion } from "motion/react";
import {
  Calendar,
  Globe2,
  MapPin,
  Trophy,
  Users,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

const STAT_ICONS = {
  users: Users,
  calendar: Calendar,
  "map-pin": MapPin,
  globe: Globe2,
} as const satisfies Record<string, LucideIcon>;

type TournamentStat = {
  value: number;
  label: string;
  icon: keyof typeof STAT_ICONS;
};

function AnimatedCountUp({ value }: { value: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 900;
    const start = performance.now();
    let frame = 0;

    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      setCount(Math.round(eased * value));
      if (progress < 1) {
        frame = requestAnimationFrame(step);
      }
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [value]);

  return <>{count}</>;
}

function CountUp({ value }: { value: number }) {
  const prefersReducedMotion = useReducedMotion();
  if (prefersReducedMotion) return <>{value}</>;
  return <AnimatedCountUp value={value} />;
}

export function TournamentBoard({ stats }: { stats: TournamentStat[] }) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <Card
      variant="artifact"
      shape="artifact"
      padding="none"
      className="relative border-white/12 bg-black/35 shadow-board backdrop-blur-xl"
    >
      <CardHeader className="type-label flex flex-row items-center justify-between border-b border-line-soft px-4 py-3 tracking-[var(--tracking-board)] text-muted-foreground">
        <span className="flex items-center gap-2 text-gold">
          <Trophy className="h-3.5 w-3.5" aria-hidden />
          Tournament Board
        </span>
        <span>North America</span>
      </CardHeader>
      <CardContent className="grid grid-cols-4 divide-x divide-line-soft p-0">
        {stats.map((stat, index) => {
          const Icon = STAT_ICONS[stat.icon];
          return (
            <motion.div
              key={stat.label}
              className="p-3 md:p-5"
              initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: prefersReducedMotion ? 0 : 0.12 + index * 0.07,
                duration: 0.55,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <Icon
                className="mb-3 h-3.5 w-3.5 text-pitch-bright/75 md:mb-8 md:h-4 md:w-4"
                aria-hidden
              />
              <p className="font-display text-3xl leading-none text-pitch-bright md:text-5xl">
                <CountUp value={stat.value} />
              </p>
              <p className="type-stat-label mt-2">{stat.label}</p>
            </motion.div>
          );
        })}
      </CardContent>
      <CardFooter className="grid grid-cols-[1fr_auto] items-center border-line-soft px-4 py-3 text-xs text-muted-foreground">
        <span>Expanded 48-team format</span>
        <span className="font-display text-xl tracking-wide text-gold">
          2026
        </span>
      </CardFooter>
    </Card>
  );
}
