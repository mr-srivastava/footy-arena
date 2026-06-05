import { ArrowRight, CalendarDays } from "lucide-react";
import Link from "next/link";
import { FixtureList } from "@/components/fixture-list";
import { PageSection } from "@/components/page-section";
import { SectionHeading } from "@/components/section-heading";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { getHomeOpeningFixturesData } from "@/lib/page-data/home";

function FixtureCardSkeleton() {
  return (
    <Card padding="none" className="rounded-sm bg-artifact-strong" aria-hidden>
      <CardContent className="relative overflow-hidden p-0">
        <div className="relative flex items-start justify-between gap-4 border-b border-line-soft px-5 py-4">
          <div className="min-w-0">
            <Skeleton className="h-5 w-24 rounded-sm" />
            <Skeleton className="mt-2 h-3 w-28 rounded-sm" />
          </div>
          <div className="shrink-0">
            <Skeleton className="h-5 w-9 rounded-sm" />
            <Skeleton className="mt-2 h-3 w-16 rounded-sm" />
          </div>
        </div>
        <div className="relative grid grid-cols-[1fr_auto_1fr] items-center gap-3 px-5 py-7">
          <Skeleton className="h-8 w-full rounded-sm" />
          <Skeleton className="size-11 rounded-sm" />
          <Skeleton className="h-8 w-full rounded-sm" />
        </div>
        <div className="relative flex items-start gap-2 border-t border-line-soft bg-background/25 px-5 py-3">
          <Skeleton className="mt-0.5 size-3.5 shrink-0 rounded-sm" />
          <Skeleton className="h-3 w-4/5 rounded-sm" />
        </div>
      </CardContent>
    </Card>
  );
}

export function HomeOpeningFixturesSkeleton() {
  return (
    <PageSection id="schedule" variant="band">
      <div className="mb-8 flex flex-col gap-3">
        <Skeleton className="h-4 w-40 rounded-sm" />
        <Skeleton className="h-10 w-72 rounded-sm" />
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <FixtureCardSkeleton key={i} />
        ))}
      </div>
    </PageSection>
  );
}

export async function HomeOpeningFixtures() {
  const { matchCount, openingFixtures, byName } =
    await getHomeOpeningFixturesData();

  return (
    <PageSection id="schedule" variant="band">
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
        <FixtureList
          fixtures={openingFixtures}
          byName={byName}
          className="md:grid-cols-3"
        />
      ) : (
        <p className="text-muted">
          Opening day fixtures are not available yet.{" "}
          <Link href="/fixtures" className="text-gold hover:text-foreground">
            View the full schedule
          </Link>
          .
        </p>
      )}
    </PageSection>
  );
}
