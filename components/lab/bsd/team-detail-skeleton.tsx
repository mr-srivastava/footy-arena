import { Skeleton } from "@/components/ui/skeleton";
import { artifactSurface } from "@/lib/utils";

export function TeamHeaderSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-3 w-16" />
      <Skeleton className="h-10 w-56" />
      <Skeleton className="h-4 w-72" />
    </div>
  );
}

export function TeamEnrichmentSkeleton({ playerCount = 8 }: { playerCount?: number }) {
  return (
    <div className="space-y-4">
      <div className={artifactSurface("grid grid-cols-2 gap-3 p-4 sm:grid-cols-4")}>
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="space-y-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-8 w-12" />
          </div>
        ))}
      </div>

      <div className={artifactSurface("overflow-hidden")}>
        <div className="grid grid-cols-[minmax(0,1.4fr)_3rem_minmax(0,1fr)_5rem_minmax(0,1fr)_4rem] gap-3 border-b border-white/8 px-4 py-3">
          {["Player", "#", "Position", "Match", "BSD", "Apps"].map((label) => (
            <Skeleton key={label} className="h-3 w-full max-w-16" />
          ))}
        </div>
        {Array.from({ length: Math.min(playerCount, 12) }).map((_, index) => (
          <div
            key={index}
            className="grid grid-cols-[minmax(0,1.4fr)_3rem_minmax(0,1fr)_5rem_minmax(0,1fr)_4rem] gap-3 border-b border-white/6 px-4 py-4 last:border-b-0"
          >
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-4 w-6" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-5 w-14 rounded-sm" />
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-8" />
          </div>
        ))}
      </div>
    </div>
  );
}
