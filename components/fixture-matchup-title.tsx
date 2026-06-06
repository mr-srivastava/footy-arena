import { TeamCrest } from "@/components/team-crest";
import { cn } from "@/lib/utils";

export function FixtureMatchupTitle({
  team1,
  team2,
  team1Id,
  team2Id,
  className,
}: {
  team1: string;
  team2: string;
  team1Id?: number | null;
  team2Id?: number | null;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "flex flex-wrap items-center gap-x-3 gap-y-2 md:gap-x-4",
        className,
      )}
    >
      <span className="inline-flex items-center gap-2 md:gap-3">
        <TeamCrest teamId={team1Id} name={team1} size="lg" />
        <span>{team1.toUpperCase()}</span>
      </span>
      <span className="text-pitch-bright">VS</span>
      <span className="inline-flex items-center gap-2 md:gap-3">
        <TeamCrest teamId={team2Id} name={team2} size="lg" />
        <span>{team2.toUpperCase()}</span>
      </span>
    </span>
  );
}
