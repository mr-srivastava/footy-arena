"use client";

import { useQuery } from "@tanstack/react-query";
import { SquadPanel } from "@/components/squad-panel";
import { DetailList, DetailListItem } from "@/components/detail-list";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { teamSquadQueryOptions } from "@/lib/query/team-squad";
import type { TeamSquad } from "@/lib/tournament/types";

function SquadPanelSkeleton() {
  return (
    <section className="flex flex-col gap-6">
      <Card variant="elevated" shape="artifact">
        <CardContent className="p-5">
        <Skeleton className="h-3 w-24 rounded-sm" />
        <div className="mt-3 flex items-center gap-4">
          <Skeleton className="size-12 rounded-sm" />
          <div className="min-w-0 flex-1">
            <Skeleton className="h-7 w-48 rounded-sm" />
            <Skeleton className="mt-2 h-3 w-28 rounded-sm" />
          </div>
        </div>
        </CardContent>
      </Card>

      <Card variant="elevated" shape="artifact">
        <CardContent className="p-5">
        <div className="flex items-center gap-2">
          <Skeleton className="size-5 rounded-sm" />
          <Skeleton className="h-6 w-24 rounded-sm" />
        </div>

        <div className="mt-6 flex flex-col gap-7">
          {["Goalkeepers", "Defenders", "Midfielders"].map((label) => (
            <div key={label}>
              <Skeleton className="h-3 w-28 rounded-sm" />
              <DetailList className="mt-3">
                {Array.from({ length: 3 }, (_, index) => (
                  <DetailListItem key={index} className="py-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <Skeleton className="size-10 shrink-0 rounded-sm" />
                        <div className="min-w-0">
                          <Skeleton className="h-4 w-36 rounded-sm" />
                          <Skeleton className="mt-2 h-3 w-52 rounded-sm" />
                        </div>
                      </div>
                      <Skeleton className="h-6 w-8 rounded-sm" />
                    </div>
                  </DetailListItem>
                ))}
              </DetailList>
            </div>
          ))}
        </div>
        </CardContent>
      </Card>
    </section>
  );
}

export function SquadPanelWithQuery({
  slug,
  initialSquad,
}: {
  slug: string;
  initialSquad: TeamSquad;
}) {
  const { data: squad = initialSquad, isPending, isFetching } = useQuery(
    teamSquadQueryOptions(slug, initialSquad),
  );

  if (isPending && squad.players.length === 0) {
    return <SquadPanelSkeleton />;
  }

  return (
    <div className={isFetching ? "opacity-80 transition-opacity" : undefined}>
      <SquadPanel squad={squad} />
    </div>
  );
}
