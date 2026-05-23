import { Sparkles } from "lucide-react";
import Link from "next/link";
import type { PlayerProfile, TeamNarrative } from "@/lib/discovery/types";

export function TeamNarrativePanel({
  narrative,
  keyPlayers,
}: {
  narrative: TeamNarrative;
  keyPlayers: PlayerProfile[];
}) {
  return (
    <section className="glass-panel rounded-2xl p-6 md:p-8">
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-gold" aria-hidden />
        <h2 className="font-display text-2xl tracking-wide text-foreground">
          THE STORY
        </h2>
      </div>

      <p className="mt-4 text-base leading-relaxed text-foreground/90">
        {narrative.narrative}
      </p>

      <p className="mt-2 text-sm italic text-gold">{narrative.vibe}</p>

      <div className="mt-6">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-muted">
          Why watch
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          {narrative.whyCasualFansShouldCare}
        </p>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {narrative.identityTags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-pitch/30 bg-pitch/10 px-3 py-1 text-xs font-medium text-pitch-bright"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-6">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-muted">
          Current themes
        </h3>
        <ul className="mt-2 space-y-1.5">
          {narrative.currentThemes.map((theme) => (
            <li key={theme} className="text-sm text-muted">
              · {theme}
            </li>
          ))}
        </ul>
      </div>

      {keyPlayers.length > 0 ? (
        <div className="mt-6">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-muted">
            Key players
          </h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {keyPlayers.map((player) => (
              <Link
                key={player.slug}
                href={`/players/${player.slug}`}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:border-gold/40 hover:text-gold"
              >
                {player.name}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
