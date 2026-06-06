"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import type { TeamEditorialInsight } from "@/lib/bsd/insights";
import { MESSAGES } from "@/lib/copy/messages";
import {
  TeamCompetitionBreakdown,
  TeamFormBrief,
  TeamRecentResults,
} from "@/components/team-insight-panel";
import { teamInsightQueryOptions } from "@/lib/query/team-insight";

function TeamFormBriefSkeleton({ hasEditorial }: { hasEditorial: boolean }) {
  return (
    <section className="mb-10 flex flex-col gap-6" aria-busy="true">
      <span className="sr-only">{MESSAGES.loading}</span>
      <Card variant="artifact" shape="artifact" className="surface-sage-glow">
        <CardContent className="p-6 md:p-7">
          <Skeleton className="h-3 w-36 rounded-sm" />
          <div className="space-after-panel-title mt-6 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="rounded-2xl border border-line-strong bg-black/15 p-5">
              <Skeleton className="h-3 w-24 rounded-sm" />
              <Skeleton className="mt-4 h-8 w-40 rounded-sm" />
            </div>
            {hasEditorial ? (
              <div className="grid gap-3 sm:grid-cols-2">
                <Skeleton className="h-24 rounded-2xl" />
                <Skeleton className="h-24 rounded-2xl" />
              </div>
            ) : null}
          </div>
          <div className="mt-5 flex flex-wrap gap-4">
            {Array.from({ length: 4 }, (_, index) => (
              <Skeleton key={index} className="h-16 w-28 rounded-xl" />
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

function TeamFormTabSkeleton() {
  return (
    <>
      <span className="sr-only">{MESSAGES.loading}</span>
      <section className="mt-0">
        <Skeleton className="mb-6 h-6 w-40 rounded-sm" />
        <div className="flex flex-col gap-3">
          {Array.from({ length: 5 }, (_, index) => (
            <Skeleton key={index} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      </section>
      <Skeleton className="mt-8 h-20 w-full rounded-2xl" />
    </>
  );
}

export function TeamFormBriefWithQuery({
  slug,
  editorial,
}: {
  slug: string;
  editorial: TeamEditorialInsight | null;
}) {
  const { data: analytics, isPending } = useQuery(
    teamInsightQueryOptions(slug),
  );

  if (isPending) {
    return <TeamFormBriefSkeleton hasEditorial={editorial != null} />;
  }

  return <TeamFormBrief editorial={editorial} analytics={analytics ?? null} />;
}

export function TeamFormTabWithQuery({
  slug,
  teamId,
}: {
  slug: string;
  teamId: number;
}) {
  const pathname = usePathname();
  const {
    data: analytics,
    isPending,
    isError,
  } = useQuery(teamInsightQueryOptions(slug));

  if (isPending) {
    return <TeamFormTabSkeleton />;
  }

  if (isError) {
    return (
      <p className="text-sm text-muted-foreground">
        {MESSAGES.formDataError}{" "}
        <Link href={pathname} className="text-gold hover:text-foreground">
          Open Overview
        </Link>
        .
      </p>
    );
  }

  return (
    <>
      <TeamRecentResults
        analytics={analytics ?? null}
        teamId={teamId}
        className="mt-0"
      />
      <TeamCompetitionBreakdown analytics={analytics ?? null} />
    </>
  );
}

export function useTeamInsightManager(slug: string) {
  const { data: analytics } = useQuery(teamInsightQueryOptions(slug));
  return analytics?.manager ?? null;
}
