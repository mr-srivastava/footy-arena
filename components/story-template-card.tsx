import type { MatchStoryTemplate } from "@/lib/discovery/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function StoryTemplateCard({ template }: { template: MatchStoryTemplate }) {
  return (
    <Card interactive>
      <CardHeader>
        <CardTitle className="font-display text-xl tracking-wide text-foreground">
          {template.title.toUpperCase()}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {template.narrative}
        </p>
        <ul className="mt-4 flex flex-col gap-1.5">
          {template.watchFor.map((item) => (
            <li key={item} className="text-xs text-pitch-bright">
              · {item}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
