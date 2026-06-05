import { EntityIconFrame, EntityRow } from "@/components/entity-row";
import { TeamFlag } from "@/components/team-flag";
import type { Team } from "@/lib/openfootball/types";

export function TeamCard({ team }: { team: Team }) {
  return (
    <EntityRow
      href={`/teams/${team.slug}`}
      leading={
        <EntityIconFrame>
          <TeamFlag flag={team.flag_icon} name={team.displayName} size="md" />
        </EntityIconFrame>
      }
      title={team.displayName.toUpperCase()}
      meta={
        <>
          <span className="text-pitch-bright/80">{team.fifa_code}</span>
          <span aria-hidden>·</span>
          <span>{team.groupLabel}</span>
          <span aria-hidden>·</span>
          <span>{team.confed}</span>
        </>
      }
    />
  );
}
