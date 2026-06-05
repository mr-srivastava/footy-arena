import { DetailList, DetailListItem } from "@/components/detail-list";
import { Card, CardContent } from "@/components/ui/card";
import type { MatchStoryTemplate } from "@/lib/discovery/types";

export function StoryTemplateCard({ template }: { template: MatchStoryTemplate }) {
  return (
    <Card
      variant="artifact"
      shape="artifact"
      interactive
      className="relative h-full hover:border-gold/35"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-gold/12 to-transparent"
        aria-hidden
      />
      <CardContent className="relative p-5">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-gold">
          Match lens
        </p>
        <h3 className="mt-3 font-display text-3xl leading-none tracking-wide text-foreground">
          {template.title.toUpperCase()}
        </h3>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          {template.narrative}
        </p>
        <DetailList className="mt-5">
          {template.watchFor.map((item) => (
            <DetailListItem
              key={item}
              className="grid grid-cols-[auto_1fr] gap-3 text-xs leading-relaxed text-pitch-bright"
            >
              <span className="mt-1 h-px w-5 bg-pitch-bright/50" aria-hidden />
              <span>{item}</span>
            </DetailListItem>
          ))}
        </DetailList>
      </CardContent>
    </Card>
  );
}
