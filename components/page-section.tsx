import type { ReactNode } from "react";
import { ContentContainer } from "@/components/content-container";

const variantClass = {
  default: "relative z-10 py-18 md:py-20",
  band: "relative z-10 border-y border-border bg-pitch/5 py-18 md:py-20",
  editorial: "relative z-10 border-y border-white/6 bg-background/55 py-14 md:py-18",
  feature: "relative z-10 py-24 md:py-32",
  dense: "relative z-10 py-12 md:py-14",
  compact: "mb-14",
  stack: "mb-20",
} as const;

export function PageSection({
  variant = "default",
  id,
  className = "",
  containerWidth = "wide",
  children,
}: {
  variant?: keyof typeof variantClass;
  id?: string;
  className?: string;
  containerWidth?: "wide" | "narrow";
  children: ReactNode;
}) {
  if (
    variant === "band" ||
    variant === "editorial" ||
    variant === "feature" ||
    variant === "dense"
  ) {
    return (
      <section id={id} className={`${variantClass[variant]} ${className}`.trim()}>
        <ContentContainer as="div" width={containerWidth} className="pb-0">
          {children}
        </ContentContainer>
      </section>
    );
  }

  if (variant === "default") {
    return (
      <section id={id} className={`${variantClass.default} ${className}`.trim()}>
        <ContentContainer as="div" width={containerWidth} className="pb-0">
          {children}
        </ContentContainer>
      </section>
    );
  }

  return (
    <section id={id} className={`${variantClass[variant]} ${className}`.trim()}>
      {children}
    </section>
  );
}
