import { ArrowRight, CalendarDays } from "lucide-react";
import Link from "next/link";
import { FixtureList } from "@/components/fixture-list";
import { PageSection } from "@/components/page-section";
import { SectionHeading } from "@/components/section-heading";
import { Skeleton } from "@/components/ui/skeleton";
import { getHomeOpeningFixturesData } from "@/lib/page-data/home";

export function HomeOpeningFixturesSkeleton() {
  return (
    <PageSection id="schedule" variant="band">
      <div className="mb-8 space-y-3">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-10 w-72" />
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-36 rounded-xl" />
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
