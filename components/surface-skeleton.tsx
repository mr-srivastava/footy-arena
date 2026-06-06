import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function PanelSkeleton({
  media = false,
  lines = 3,
}: {
  media?: boolean;
  lines?: number;
}) {
  return (
    <Card variant="elevated" padding="none" shape="artifact" aria-hidden>
      {media ? <Skeleton className="h-28 rounded-none" /> : null}
      <CardContent className="flex flex-col p-5">
        <Skeleton className="h-3 w-24 rounded-full" />
        <Skeleton className="mt-3 h-10 w-3/4 rounded-xl" />
        <div className="mt-4 flex flex-col gap-2">
          {Array.from({ length: lines }, (_, index) => (
            <Skeleton
              key={index}
              className="h-3 rounded-full"
              style={{ width: `${100 - index * 14}%` }}
            />
          ))}
        </div>
        <Skeleton className="mt-5 h-4 w-28 rounded-full" />
      </CardContent>
    </Card>
  );
}
