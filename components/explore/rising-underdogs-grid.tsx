import {
  CountryCard,
  CountryCardGrid,
  CountryPlayerLinks,
} from "@/components/explore/country-card";
import { HighlightBlock } from "@/components/highlight-block";
import { RISING_UNDERDOG_ENTRIES } from "@/lib/discovery";
import type { Team } from "@/lib/openfootball/types";
import { resolveTeamByFifaCode } from "@/lib/openfootball/teams";

type RisingUnderdogsGridProps = {
  byCode: Map<string, Team>;
};

export function RisingUnderdogsGrid({ byCode }: RisingUnderdogsGridProps) {
  return (
    <CountryCardGrid>
      {RISING_UNDERDOG_ENTRIES.map((entry) => {
        const { breakoutPlayers } = entry;
        const { team, href } = resolveTeamByFifaCode(entry.fifaCode, byCode);

        return (
          <CountryCard
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
            <HighlightBlock className="mt-4">
              <p className="text-sm font-medium leading-relaxed text-pitch-bright">
                {entry.keyIdentity}
              </p>
            </HighlightBlock>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {entry.whyCasualFansShouldWatch}
            </p>
            <CountryPlayerLinks players={breakoutPlayers} />
          </CountryCard>
        );
      })}
    </CountryCardGrid>
  );
}
