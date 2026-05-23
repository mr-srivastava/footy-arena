import type { LucideIcon } from "lucide-react";
import { artifactSurface, cn } from "@/lib/utils";

export function StatCard({
  value,
  label,
  icon: Icon,
  accent = "text-pitch-bright",
  layout = "inline",
}: {
  value: string | number;
  label: string;
  icon: LucideIcon;
  accent?: string;
  layout?: "inline" | "stacked";
}) {
  if (layout === "stacked") {
    return (
      <div
        className={artifactSurface(
          "relative overflow-hidden p-4 transition-colors hover:border-pitch-bright/30",
        )}
      >
        <Icon className="mb-5 h-4 w-4 text-pitch-bright/80" aria-hidden />
        <p className={cn("font-display text-4xl leading-none md:text-5xl", accent)}>
          {value}
        </p>
        <p className="mt-2 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          {label}
        </p>
      </div>
    );
  }

  return (
    <div className="min-w-36 flex-1 border-l border-pitch-bright/35 pl-4">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="h-4 w-4 text-pitch-bright/70" aria-hidden />
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em]">
          {label}
        </p>
      </div>
      <p className={cn("mt-2 font-display text-4xl leading-none", accent)}>
        {value}
      </p>
    </div>
  );
}
