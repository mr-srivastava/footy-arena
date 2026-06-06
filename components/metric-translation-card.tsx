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
      className="surface-sage-glow h-full min-h-64 transition-all duration-500 hover:-translate-y-1 hover:border-pitch-bright/30 hover:shadow-card-hover"
    >
      <CardContent className="p-5">
        <div className="flex flex-row items-baseline justify-between gap-3 border-b border-line-soft pb-3">
          <span className="font-mono text-xs uppercase tracking-wider text-pitch-bright">
            {metric.metric}
          </span>
          <span className="text-xs font-semibold uppercase tracking-widest text-gold">
            In plain English
          </span>
        </div>
        <div className="pt-6">
          <h3 className="editorial-title type-card-title text-foreground">
            {metric.friendlyLabel}
          </h3>
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
