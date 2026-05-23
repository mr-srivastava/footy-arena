import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { TeamFlag } from "@/components/team-flag";
import type { Team } from "@/lib/openfootball/types";

export function TeamCard({ team }: { team: Team }) {
  return (
    <Link href={`/teams/${team.slug}`} className="group block">
      <Card accent="pitch" interactive padding="none">
        <CardContent className="flex items-center gap-4 p-4 pl-5">
          <TeamFlag flag={team.flag_icon} name={team.displayName} size="md" />
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold text-foreground group-hover:text-gold">
              {team.displayName}
            </p>
            <p className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground">
              <span className="font-mono uppercase tracking-wider">{team.fifa_code}</span>
              <span aria-hidden>·</span>
              <span>{team.groupLabel}</span>
              <span aria-hidden>·</span>
              <span>{team.confed}</span>
            </p>
          </div>
          <ChevronRight
            className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-gold"
            aria-hidden
          />
        </CardContent>
      </Card>
    </Link>
  );
}
