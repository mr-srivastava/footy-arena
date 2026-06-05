import { HighlightBlock } from "@/components/highlight-block";
import { Card, CardContent } from "@/components/ui/card";
import type { MetricTranslation } from "@/lib/discovery/types";

export function MetricTranslationCard({
  metric,
}: {
  metric: MetricTranslation;
}) {
  return (
    <Card
      variant="elevated"
      shape="artifact"
      interactive
      className="h-full hover:border-pitch-bright/30"
    >
      <CardContent className="p-5">
        <div className="flex flex-row items-baseline justify-between gap-3 border-b border-line-soft pb-3">
          <span className="font-mono text-xs uppercase tracking-wider text-pitch-bright">
            {metric.metric}
          </span>
          <span className="text-xs font-semibold uppercase tracking-widest text-gold">
            {metric.friendlyLabel}
          </span>
        </div>
        <div className="pt-4">
          <p className="text-sm leading-relaxed text-muted-foreground">
            {metric.explanation}
          </p>
          <HighlightBlock className="mt-4">
            <p className="text-sm font-medium leading-relaxed text-foreground">
              {metric.casualTranslation}
            </p>
          </HighlightBlock>
        </div>
      </CardContent>
    </Card>
  );
}
