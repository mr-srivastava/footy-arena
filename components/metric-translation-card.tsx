import type { MetricTranslation } from "@/lib/discovery/types";
import { artifactSurface } from "@/lib/utils";

export function MetricTranslationCard({
  metric,
}: {
  metric: MetricTranslation;
}) {
  return (
    <article
      className={artifactSurface(
        "h-full bg-artifact-muted p-5 transition-colors hover:border-pitch-bright/30",
      )}
    >
      <div className="flex flex-row items-baseline justify-between gap-3 border-b border-white/8 pb-3">
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
        <p className="mt-4 border-l border-pitch-bright/50 pl-4 text-sm font-medium leading-relaxed text-foreground">
          {metric.casualTranslation}
        </p>
      </div>
    </article>
  );
}
