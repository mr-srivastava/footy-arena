import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

/**
 * Title accents: emphasize words with `text-pitch-bright` on the span.
 * Navigation and CTAs use `text-gold`, not title accent colors.
 */
export function SectionHeading({
  eyebrow,
  title,
  icon: Icon,
  children,
  subtitle,
  as = "h2",
  align = "start",
  titleClassName = "",
  className = "",
}: {
  eyebrow: string;
  title: ReactNode;
  icon?: LucideIcon;
  children?: ReactNode;
  subtitle?: ReactNode;
  as?: "h1" | "h2";
  /** Centered layout for band intros (e.g. History). */
  align?: "start" | "center";
  titleClassName?: string;
  className?: string;
}) {
  const Heading = as;
  const baseTitleClass =
    "editorial-title type-section-title mt-3 text-foreground";
  const centered = align === "center";

  return (
    <div
      className={`mb-10 flex flex-col gap-4 md:mb-12 ${
        centered
          ? "items-center text-center"
          : "md:flex-row md:items-end md:justify-between"
      } ${className}`.trim()}
    >
      <div className={centered ? "flex flex-col items-center" : undefined}>
        <p
          className={`section-eyebrow ${centered ? "justify-center" : ""}`.trim()}
        >
          {Icon ? <Icon className="h-4 w-4" aria-hidden /> : null}
          {eyebrow}
        </p>
        <Heading className={`${baseTitleClass} ${titleClassName}`.trim()}>
          {title}
        </Heading>
        {subtitle ? (
          <p
            className={`type-lead mt-5 ${
              centered ? "mx-auto" : ""
            }`.trim()}
          >
            {subtitle}
          </p>
        ) : null}
      </div>
      {children}
    </div>
  );
}
