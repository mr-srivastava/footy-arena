import type { BsdPlayerStatRow } from "@/lib/bsd/enrichment-types";
import { artifactSurface } from "@/lib/utils";

export function BsdPlayerStatsTable({ stats }: { stats: BsdPlayerStatRow[] }) {
  if (stats.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No recent match stats returned from{" "}
        <code className="rounded-sm bg-white/6 px-1 py-0.5 text-xs text-gold">
          /players/{"{id}"}/stats/
        </code>
        .
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-sm">
        <thead>
          <tr className="border-b border-white/10 text-xs uppercase tracking-[0.14em] text-muted-foreground">
            <th className="px-3 py-2">Event</th>
            <th className="px-3 py-2">Min</th>
            <th className="px-3 py-2">Rating</th>
            <th className="px-3 py-2">G</th>
            <th className="px-3 py-2">A</th>
            <th className="px-3 py-2">xG</th>
            <th className="px-3 py-2">Shots</th>
            <th className="px-3 py-2">Passes</th>
          </tr>
        </thead>
        <tbody>
          {stats.map((row) => (
            <tr key={row.id} className="border-b border-white/6 hover:bg-white/3">
              <td className="px-3 py-3 font-mono text-xs text-muted-foreground">
                #{row.event_id}
              </td>
              <td className="px-3 py-3">{row.minutes_played}</td>
              <td className="px-3 py-3">{row.rating?.toFixed(1) ?? "—"}</td>
              <td className="px-3 py-3">{row.goals}</td>
              <td className="px-3 py-3">{row.goal_assist}</td>
              <td className="px-3 py-3">{row.expected_goals?.toFixed(2) ?? "—"}</td>
              <td className="px-3 py-3">
                {row.shots_on_target}/{row.total_shots}
              </td>
              <td className="px-3 py-3">
                {row.accurate_pass}/{row.total_pass}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function BsdStatsSummary({
  appearances,
  goals,
  assists,
  avgRating,
}: {
  appearances: number;
  goals: number;
  assists: number;
  avgRating: number | null;
}) {
  return (
    <div className={artifactSurface("grid grid-cols-2 gap-3 p-4 sm:grid-cols-4")}>
      <Stat label="Appearances" value={String(appearances)} />
      <Stat label="Goals" value={String(goals)} />
      <Stat label="Assists" value={String(assists)} />
      <Stat label="Avg rating" value={avgRating?.toFixed(2) ?? "—"} />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-2xl tracking-wide text-foreground">{value}</p>
    </div>
  );
}
