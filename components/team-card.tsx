import { EntityIconFrame, EntityRow } from "@/components/entity-row";
import { TeamEmblem } from "@/components/team-emblem";
import type { Team } from "@/lib/openfootball/types";

export function TeamCard({ team }: { team: Team }) {
  return (
    <EntityRow
      href={`/teams/${team.slug}`}
      leading={
        <EntityIconFrame>
          <TeamEmblem
            bsdTeamId={team.bsdTeamId}
            flag={team.flag_icon}
            name={team.displayName}
            size="md"
          />
        </EntityIconFrame>
      }
      title={team.displayName}
      meta={
        <>
          <span className="text-pitch-bright/80">{team.fifa_code}</span>
          <span aria-hidden>·</span>
          <span>{team.groupLabel}</span>
          <span aria-hidden>·</span>
          <span>{team.confed}</span>
        </>
      }
      className="border border-line-soft bg-artifact-muted/55 px-4 shadow-card transition-colors duration-200 hover:border-gold/25 hover:bg-artifact"
      titleClassName="editorial-title truncate text-3xl normal-case tracking-normal"
    />
  );
}
