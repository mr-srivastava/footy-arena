import { ContentContainer } from "@/components/content-container";
import { PageShell } from "@/components/page-shell";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <PageShell>
      <ContentContainer className="py-24">
        <Skeleton className="mx-auto h-4 w-40" />
        <Skeleton className="mx-auto mt-6 h-24 w-72" />
        <Skeleton className="mx-auto mt-6 h-5 w-full max-w-lg" />
        <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-36 rounded-sm" />
          ))}
        </div>
      </ContentContainer>
    </PageShell>
  );
}
