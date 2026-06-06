import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

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
      <Card
        variant="artifact"
        shape="artifact"
        interactive
        className="surface-sage-glow relative min-h-40 transition-colors duration-200 hover:border-pitch-bright/22"
      >
        <CardContent className="p-5">
          <Icon className="mb-5 size-4 text-pitch-bright/80" aria-hidden />
          <p
            className={cn(
              "font-display text-4xl leading-none md:text-5xl",
              accent,
            )}
          >
            {value}
          </p>
          <p className="type-stat-label mt-2">{label}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="min-w-36 flex-1 border-l border-pitch-bright/35 pl-4">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="size-4 text-pitch-bright/70" aria-hidden />
        <p className="type-stat-label">{label}</p>
      </div>
      <p className={cn("mt-2 font-display text-4xl leading-none", accent)}>
        {value}
      </p>
    </div>
  );
}
