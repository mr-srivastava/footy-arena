"use client";

import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { MatchInsightPanel } from "@/components/match-insight-panel";
import { matchInsightQueryOptions } from "@/lib/query/match-insight";

function MatchInsightPanelSkeleton() {
  return (
    <section className="flex flex-col gap-6">
      <Card variant="artifact" shape="artifact">
        <CardContent className="p-6 md:p-7">
          <Skeleton className="h-3 w-32 rounded-sm" />
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {Array.from({ length: 3 }, (_, index) => (
              <Skeleton key={index} className="h-32 rounded-2xl" />
            ))}
          </div>
          <Skeleton className="mt-6 h-24 w-full rounded-2xl" />
        </CardContent>
      </Card>
      <Card variant="artifact" shape="artifact">
        <CardContent className="p-5 md:p-6">
          <Skeleton className="h-3 w-40 rounded-sm" />
          <Skeleton className="mt-5 h-64 w-full rounded-2xl" />
        </CardContent>
      </Card>
    </section>
  );
}

export function MatchInsightPanelWithQuery({
  fixtureId,
  venueFallback,
}: {
  fixtureId: string;
  venueFallback: string;
}) {
  const { data: insight, isPending } = useQuery(
    matchInsightQueryOptions(fixtureId),
  );

  if (isPending) {
    return <MatchInsightPanelSkeleton />;
  }

  return (
    <MatchInsightPanel
      insight={insight ?? null}
      venueFallback={venueFallback}
    />
  );
}
