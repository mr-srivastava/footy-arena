import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

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
      <h2
        className={cn(
          "editorial-title type-panel-title inline-icon-row items-start gap-3 text-foreground",
          className,
        )}
      >
        {Icon ? (
          <Icon
            className="mt-1 size-6 shrink-0 text-pitch-bright"
            aria-hidden
          />
        ) : null}
        <span className="min-w-0 text-balance">{children}</span>
      </h2>
    );
  }

  return (
    <h3 className={cn("type-label", labelToneClass[tone], className)}>
      {children}
    </h3>
  );
}
