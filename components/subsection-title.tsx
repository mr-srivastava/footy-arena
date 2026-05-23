import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

const panelClass =
  "flex items-center gap-2 font-display text-2xl tracking-wide text-foreground";

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
        {Icon ? <Icon className="h-6 w-6 text-pitch-bright" aria-hidden /> : null}
        {children}
      </h2>
    );
  }

  return (
    <h3
      className={`text-xs font-semibold uppercase tracking-widest ${labelToneClass[tone]} ${className}`.trim()}
    >
      {children}
    </h3>
  );
}
