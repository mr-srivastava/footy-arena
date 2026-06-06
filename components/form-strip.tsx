import { cn } from "@/lib/utils";

export function FormStrip({
  results,
  compact = false,
}: {
  results: Array<"W" | "D" | "L">;
  compact?: boolean;
}) {
  if (results.length === 0) {
    return (
      <span className="text-xs text-muted-foreground">No recent form yet</span>
    );
  }

  return (
    <div className="flex items-center gap-1.5" aria-label="Recent form">
      {results.map((result, index) => (
        <span
          key={`${result}-${index}`}
          className={cn(
            "type-micro inline-flex items-center justify-center rounded-full border font-semibold uppercase tracking-[var(--tracking-stat)]",
            compact ? "h-6 w-6" : "h-7 w-7",
            result === "W" &&
              "border-pitch-bright/30 bg-pitch-bright/12 text-pitch-bright",
            result === "D" && "border-gold/30 bg-gold/10 text-gold",
            result === "L" && "border-red/30 bg-red/10 text-red",
          )}
        >
          {result}
        </span>
      ))}
    </div>
  );
}
