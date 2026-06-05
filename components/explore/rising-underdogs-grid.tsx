import {
  NationStoryCard,
  NationStoryGrid,
  NationStoryPlayerBadges,
} from "@/components/explore/nation-story-card";
import { RISING_UNDERDOG_ENTRIES } from "@/lib/discovery";
import type { Team } from "@/lib/openfootball/types";
import { resolveTeamByFifaCode } from "@/lib/openfootball/teams";

type RisingUnderdogsGridProps = {
  byCode: Map<string, Team>;
};

export function RisingUnderdogsGrid({ byCode }: RisingUnderdogsGridProps) {
  return (
    <NationStoryGrid>
      {RISING_UNDERDOG_ENTRIES.map((entry) => {
        const { breakoutPlayers } = entry;
        const { team, href } = resolveTeamByFifaCode(entry.fifaCode, byCode);

        return (
          <NationStoryCard
            key={entry.nation}
            nation={entry.nation}
            eyebrow="Rising profile"
            accent="pitch"
            team={team}
            href={href}
          >
            <p className="text-sm leading-relaxed text-muted-foreground">
              {entry.whyTheyMatter}
            </p>
            <p className="mt-4 border-l border-pitch-bright/50 pl-4 text-sm font-medium leading-relaxed text-pitch-bright">
              {entry.keyIdentity}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {entry.whyCasualFansShouldWatch}
            </p>
            <NationStoryPlayerBadges players={breakoutPlayers} />
          </NationStoryCard>
        );
      })}
    </NationStoryGrid>
  );
}
