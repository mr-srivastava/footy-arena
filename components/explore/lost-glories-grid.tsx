import Link from "next/link";
import { MediaImage } from "@/components/media-image";
import { getNationImage, LOST_GLORIES } from "@/lib/discovery";
import type { Team } from "@/lib/openfootball/types";
import { resolveTeamByFifaCode } from "@/lib/openfootball/teams";
import { artifactSurface } from "@/lib/utils";

type LostGloriesGridProps = {
  byCode: Map<string, Team>;
};

export function LostGloriesGrid({ byCode }: LostGloriesGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {LOST_GLORIES.map((entry) => {
        const { team, href } = resolveTeamByFifaCode(entry.fifaCode, byCode);

        return (
          <article
            key={entry.nation}
            className={artifactSurface("flex h-full flex-col overflow-hidden")}
          >
            <MediaImage
              src={getNationImage(entry.nation)}
              alt={`${entry.nation} football atmosphere`}
              className="h-28 shrink-0"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
            <div className="flex flex-1 flex-col p-5">
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-gold">
                Lost glory
              </p>
              <h2 className="mt-2 font-display text-4xl leading-none tracking-wide text-foreground">
                {entry.nation.toUpperCase()}
              </h2>
              <dl className="mt-5 flex flex-col divide-y divide-white/8 border-y border-white/8 text-sm">
                <div className="py-3">
                  <dt className="text-xs font-semibold uppercase tracking-widest text-gold">
                    Then
                  </dt>
                  <dd className="mt-1 leading-relaxed text-muted">
                    {entry.then}
                  </dd>
                </div>
                <div className="py-3">
                  <dt className="text-xs font-semibold uppercase tracking-widest text-muted">
                    What changed
                  </dt>
                  <dd className="mt-1 leading-relaxed text-muted">
                    {entry.whatChanged}
                  </dd>
                </div>
                <div className="py-3">
                  <dt className="text-xs font-semibold uppercase tracking-widest text-muted">
                    Now
                  </dt>
                  <dd className="mt-1 leading-relaxed text-muted">
                    {entry.currentStatus}
                  </dd>
                </div>
                <div className="py-3">
                  <dt className="text-xs font-semibold uppercase tracking-widest text-pitch-bright">
                    Hope ahead
                  </dt>
                  <dd className="mt-1 leading-relaxed text-foreground/90">
                    {entry.hopeForTheFuture}
                  </dd>
                </div>
              </dl>
              {href && team ? (
                <Link
                  href={href}
                  className="mt-5 text-sm font-semibold text-gold hover:text-foreground"
                >
                  View {team.displayName} →
                </Link>
              ) : null}
            </div>
          </article>
        );
      })}
    </div>
  );
}
