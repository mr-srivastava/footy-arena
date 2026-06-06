import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

const panelClass =
  "editorial-title type-panel-title flex items-center gap-3 text-foreground";

const labelToneClass = {
  muted: "text-muted",
  accent: "text-pitch-bright",
  gold: "text-gold",
} as const;

export function SubsectionTitle({
  level,
  children,
  icon: Icon,
  tone = "muted",
  className = "",
}: {
  level: "panel" | "label";
  children: ReactNode;
  icon?: LucideIcon;
  tone?: keyof typeof labelToneClass;
  className?: string;
}) {
  if (level === "panel") {
    return (
      <h2 className={`${panelClass} ${className}`.trim()}>
        {Icon ? (
          <Icon className="h-6 w-6 text-pitch-bright" aria-hidden />
        ) : null}
        {children}
      </h2>
    );
  }

  return (
    <h3 className={`type-label ${labelToneClass[tone]} ${className}`.trim()}>
      {children}
    </h3>
  );
}
