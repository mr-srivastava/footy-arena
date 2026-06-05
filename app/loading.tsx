import { ContentContainer } from "@/components/content-container";
import { PageShell } from "@/components/page-shell";
import { PanelSkeleton } from "@/components/surface-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

function PageCardSkeleton() {
  return <PanelSkeleton media />;
}

export default function Loading() {
  return (
    <PageShell>
      <ContentContainer className="py-10 md:py-14">
        <div className="border-b border-line-soft py-12 md:py-16">
          <Skeleton className="h-4 w-40 rounded-sm" />
          <Skeleton className="mt-5 h-14 w-full max-w-xl rounded-sm md:h-16" />
          <div className="mt-5 flex max-w-2xl flex-col gap-2">
            <Skeleton className="h-4 w-full rounded-sm" />
            <Skeleton className="h-4 w-4/5 rounded-sm" />
          </div>
        </div>

        <Skeleton className="mt-10 h-44 rounded-sm md:h-52" />

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <PageCardSkeleton key={i} />
          ))}
        </div>
      </ContentContainer>
    </PageShell>
  );
}
