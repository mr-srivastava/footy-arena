import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import type { MetricTranslation } from "@/lib/discovery/types";

export function MetricTranslationCard({
  metric,
}: {
  metric: MetricTranslation;
}) {
  return (
    <Card interactive>
      <CardHeader className="flex flex-row items-baseline justify-between gap-3 pb-0">
        <span className="font-mono text-xs uppercase tracking-wider text-pitch-bright">
          {metric.metric}
        </span>
        <span className="text-xs font-semibold uppercase tracking-widest text-gold">
          {metric.friendlyLabel}
        </span>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {metric.explanation}
        </p>
        <p className="mt-3 rounded-xl bg-pitch/10 px-4 py-3 text-sm font-medium text-foreground">
          {metric.casualTranslation}
        </p>
      </CardContent>
    </Card>
  );
}
