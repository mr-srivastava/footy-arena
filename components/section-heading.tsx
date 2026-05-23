import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  icon: Icon,
  children,
  subtitle,
  as = "h2",
  titleClassName = "",
}: {
  eyebrow: string;
  title: ReactNode;
  icon?: LucideIcon;
  children?: ReactNode;
  subtitle?: ReactNode;
  as?: "h1" | "h2";
  titleClassName?: string;
}) {
  const Heading = as;
  const baseTitleClass =
    "mt-3 font-display text-5xl tracking-wide text-foreground md:text-6xl";

  return (
    <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="section-eyebrow">
          {Icon ? <Icon className="h-4 w-4" aria-hidden /> : null}
          {eyebrow}
        </p>
        <Heading className={`${baseTitleClass} ${titleClassName}`.trim()}>
          {title}
        </Heading>
        {subtitle ? (
          <p className="mt-4 max-w-2xl leading-relaxed text-muted">{subtitle}</p>
        ) : null}
      </div>
      {children}
    </div>
  );
}
