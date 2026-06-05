import {
  NationStoryCard,
  NationStoryGrid,
  NationStoryTimeline,
} from "@/components/explore/nation-story-card";
import { LOST_GLORIES } from "@/lib/discovery";
import type { Team } from "@/lib/openfootball/types";
import { resolveTeamByFifaCode } from "@/lib/openfootball/teams";

type LostGloriesGridProps = {
  byCode: Map<string, Team>;
};

export function LostGloriesGrid({ byCode }: LostGloriesGridProps) {
  return (
    <NationStoryGrid>
      {LOST_GLORIES.map((entry) => {
        const { team, href } = resolveTeamByFifaCode(entry.fifaCode, byCode);

        return (
          <NationStoryCard
            key={entry.nation}
            nation={entry.nation}
            eyebrow="Lost glory"
            accent="gold"
            team={team}
            href={href}
          >
            <NationStoryTimeline
              items={[
                { label: "Then", value: entry.then, tone: "accent" },
                { label: "What changed", value: entry.whatChanged },
                { label: "Now", value: entry.currentStatus },
                {
                  label: "Hope ahead",
                  value: entry.hopeForTheFuture,
                  tone: "bright",
                },
              ]}
            />
          </NationStoryCard>
        );
      })}
    </NationStoryGrid>
  );
}
