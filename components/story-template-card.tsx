import type { MatchStoryTemplate } from "@/lib/discovery/types";
import { artifactSurface } from "@/lib/utils";

export function StoryTemplateCard({ template }: { template: MatchStoryTemplate }) {
  return (
    <article
      className={artifactSurface(
        "relative h-full overflow-hidden p-5 transition-colors hover:border-gold/35",
      )}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-gold/12 to-transparent"
        aria-hidden
      />
      <div className="relative">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-gold">
          Match lens
        </p>
        <h3 className="mt-3 font-display text-3xl leading-none tracking-wide text-foreground">
          {template.title.toUpperCase()}
        </h3>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          {template.narrative}
        </p>
        <ul className="mt-5 divide-y divide-white/8 border-y border-white/8">
          {template.watchFor.map((item) => (
            <li
              key={item}
              className="grid grid-cols-[auto_1fr] gap-3 py-3 text-xs leading-relaxed text-pitch-bright"
            >
              <span className="mt-1 h-px w-5 bg-pitch-bright/50" aria-hidden />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
