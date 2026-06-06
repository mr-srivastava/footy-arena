import { TeamCrest } from "@/components/team-crest";
import { TeamFlag } from "@/components/team-flag";

type TeamEmblemSize = "xs" | "sm" | "md" | "lg" | "xl";

export function TeamEmblem({
  bsdTeamId,
  flag,
  name,
  size = "md",
  className,
}: {
  bsdTeamId?: number | null;
  flag: string;
  name: string;
  size?: TeamEmblemSize;
  className?: string;
}) {
  if (bsdTeamId) {
    return (
      <TeamCrest
        teamId={bsdTeamId}
        name={name}
        size={size}
        className={className}
      />
    );
  }

  return <TeamFlag flag={flag} name={name} size={size} />;
}
