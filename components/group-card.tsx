import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { EntityIconFrame, EntityRow } from "@/components/entity-row";
import { TeamFlag } from "@/components/team-flag";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import type { TournamentGroup } from "@/lib/openfootball/types";

export function GroupCard({ group }: { group: TournamentGroup }) {
  const confeds = group.teams
    .map((team) => team.confed)
    .filter((value, index, array) => array.indexOf(value) === index);

  return (
    <Link
      href={`/groups/${group.letter.toLowerCase()}`}
      className="group block h-full"
    >
      <Card
        variant="artifact"
        shape="artifact"
        padding="none"
        interactive
        className="h-full bg-artifact/85 group-hover:border-gold/35"
      >
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-gold/18 to-transparent"
          aria-hidden
        />
        <div
          className="surface-watermark pointer-events-none absolute -right-3 top-5 font-display text-[8rem] leading-none transition-colors group-hover:text-gold/[0.06]"
          aria-hidden
        >
          {group.letter}
        </div>
        <CardHeader className="relative flex flex-row items-start justify-between gap-4 border-b border-line-soft px-5 py-4">
          <div>
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              Draw board
            </p>
            <h3 className="mt-1 font-display text-4xl leading-none tracking-wide text-gold">
              {group.label.toUpperCase()}
            </h3>
          </div>
          <ChevronRight
            className="mt-1 size-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-gold"
            aria-hidden
          />
        </CardHeader>
        <CardContent className="relative px-5 py-2">
          {group.teams.map((team) => (
            <EntityRow
              key={team.fifa_code}
              leading={
                <EntityIconFrame className="size-9">
                  <TeamFlag flag={team.flag_icon} name={team.displayName} size="sm" />
                </EntityIconFrame>
              }
              title={team.displayName}
              titleClassName="font-body text-sm font-medium normal-case tracking-normal"
              trailing={<Badge variant="code">{team.fifa_code}</Badge>}
              showChevron={false}
              className="grid-cols-[auto_1fr_auto] gap-3 py-3 text-sm last:border-b-0"
            />
          ))}
        </CardContent>
        <CardFooter className="relative flex-col items-stretch border-line-soft px-5 py-3">
          <div className="mb-3 flex items-center justify-between text-xs text-muted-foreground">
            <span>{group.teams.length} nations</span>
            <span>{confeds.length} confederations</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {confeds.map((confed) => (
              <Badge key={confed} variant="code">
                {confed}
              </Badge>
            ))}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
