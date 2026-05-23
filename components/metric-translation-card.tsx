import type { MetricTranslation } from "@/lib/discovery/types";

export function MetricTranslationCard({
  metric,
}: {
  metric: MetricTranslation;
}) {
  return (
    <article className="glass-panel rounded-2xl p-5">
      <div className="flex items-baseline justify-between gap-3">
        <span className="font-mono text-xs uppercase tracking-wider text-pitch-bright">
          {metric.metric}
        </span>
        <span className="text-xs font-semibold uppercase tracking-widest text-gold">
          {metric.friendlyLabel}
        </span>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-muted">
        {metric.explanation}
      </p>
      <p className="mt-3 rounded-xl bg-pitch/10 px-4 py-3 text-sm font-medium text-foreground">
        {metric.casualTranslation}
      </p>
    </article>
  );
}
