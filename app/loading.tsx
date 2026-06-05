import { ContentContainer } from "@/components/content-container";
import { PageShell } from "@/components/page-shell";
import { Skeleton } from "@/components/ui/skeleton";
import { artifactSurface } from "@/lib/utils";

function PageCardSkeleton() {
  return (
    <article
      className={artifactSurface(
        "relative flex h-full flex-col overflow-hidden bg-artifact-muted/80",
      )}
      aria-hidden
    >
      <Skeleton className="h-28 rounded-none" />
      <div className="flex flex-1 flex-col p-5">
        <Skeleton className="h-3 w-24 rounded-sm" />
        <Skeleton className="mt-3 h-8 w-3/4 rounded-sm" />
        <div className="mt-4 flex flex-col gap-2">
          <Skeleton className="h-3 w-full rounded-sm" />
          <Skeleton className="h-3 w-5/6 rounded-sm" />
          <Skeleton className="h-3 w-2/3 rounded-sm" />
        </div>
        <Skeleton className="mt-5 h-4 w-28 rounded-sm" />
      </div>
    </article>
  );
}

export default function Loading() {
  return (
    <PageShell>
      <ContentContainer className="py-10 md:py-14">
        <div className="border-b border-white/8 py-12 md:py-16">
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
