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
        className="relative hover:border-pitch-bright/30"
      >
        <CardContent className="p-4">
          <Icon className="mb-5 size-4 text-pitch-bright/80" aria-hidden />
          <p className={cn("font-display text-4xl leading-none md:text-5xl", accent)}>
            {value}
          </p>
          <p className="mt-2 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            {label}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="min-w-36 flex-1 border-l border-pitch-bright/35 pl-4">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="size-4 text-pitch-bright/70" aria-hidden />
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
