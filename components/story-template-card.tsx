import { DetailList, DetailListItem } from "@/components/detail-list";
import { Card, CardContent } from "@/components/ui/card";
import type { MatchStoryTemplate } from "@/lib/discovery/types";

export function StoryTemplateCard({
  template,
}: {
  template: MatchStoryTemplate;
}) {
  return (
    <Card
      variant="artifact"
      shape="artifact"
      interactive
      className="surface-gold-glow relative h-full min-h-80 transition-all duration-500 hover:-translate-y-1 hover:border-gold/30 hover:shadow-card-hover"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-gold/12 to-transparent"
        aria-hidden
      />
      <CardContent className="relative p-5">
        <p className="type-label text-gold">Match lens</p>
        <h3 className="editorial-title type-card-title mt-5 text-foreground">
          {template.title}
        </h3>
        <p className="type-copy mt-4">{template.narrative}</p>
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
