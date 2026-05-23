import { ArrowLeft } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { MediaImage } from "@/components/media-image";
import { SectionHeading } from "@/components/section-heading";

type ListHeroProps = {
  variant: "list";
  eyebrow: string;
  title: ReactNode;
  icon?: LucideIcon;
  subtitle?: ReactNode;
  titleClassName?: string;
  children?: ReactNode;
  stats?: ReactNode;
  bannerImage?: string;
  bannerAlt?: string;
  className?: string;
};

type DetailHeroProps = {
  variant: "detail";
  backHref: string;
  backLabel: string;
  /** When set, replaces the default eyebrow/title/meta block (e.g. SectionHeading). */
  children?: ReactNode;
  eyebrow?: string;
  title?: ReactNode;
  meta?: ReactNode;
  actions?: ReactNode;
  leading?: ReactNode;
  bannerImage?: string;
  bannerAlt?: string;
  bannerOverlay?: "card" | "hero" | "portrait" | "none";
  titleClassName?: string;
  className?: string;
};

export type PageHeroProps = ListHeroProps | DetailHeroProps;

export function PageHero(props: PageHeroProps) {
  if (props.variant === "list") {
    const {
      eyebrow,
      title,
      icon,
      subtitle,
      titleClassName,
      children,
      stats,
      bannerImage,
      bannerAlt = "",
      className = "",
    } = props;

    return (
      <div className={className.trim()}>
        <div className="animate-fade-up border-b border-white/8 py-12 md:py-16">
          <SectionHeading
            as="h1"
            eyebrow={eyebrow}
            title={title}
            icon={icon}
            subtitle={subtitle}
            titleClassName={titleClassName}
          >
            {children}
          </SectionHeading>
          {stats ? (
            <div className="animate-fade-up animate-delay-2 mt-8 flex flex-wrap gap-4">
              {stats}
            </div>
          ) : null}
        </div>
        {bannerImage ? (
          <MediaImage
            src={bannerImage}
            alt={bannerAlt}
            overlay="hero"
            priority
            className="animate-fade-up animate-delay-2 h-44 md:h-56"
            sizes="100vw"
          />
        ) : null}
      </div>
    );
  }

  const {
    backHref,
    backLabel,
    children,
    eyebrow,
    title,
    meta,
    actions,
    leading,
    bannerImage,
    bannerAlt = "",
    bannerOverlay = "hero",
    titleClassName = "",
    className = "",
  } = props;

  return (
    <div className={className.trim()}>
      <div className={`animate-fade-up py-10 md:py-14`.trim()}>
        <Link
          href={backHref}
          className="mb-8 inline-flex items-center gap-2 rounded-sm border border-white/10 bg-white/5 px-3 py-2 text-sm text-muted transition-colors hover:border-gold/35 hover:text-gold"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          {backLabel}
        </Link>

        {children ? (
          children
        ) : (
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="flex min-w-0 items-center gap-5">
              {leading}
              <div className="min-w-0 border-l border-pitch-bright/35 pl-5">
                {eyebrow ? <p className="section-eyebrow">{eyebrow}</p> : null}
                {title ? (
                  <h1
                    className={`font-display text-5xl tracking-wide text-foreground md:text-6xl ${titleClassName}`.trim()}
                  >
                    {title}
                  </h1>
                ) : null}
                {meta ? <div className="mt-2">{meta}</div> : null}
              </div>
            </div>
            {actions ? <div className="shrink-0 self-start">{actions}</div> : null}
          </div>
        )}
      </div>
      {bannerImage ? (
        <MediaImage
          src={bannerImage}
          alt={bannerAlt}
          overlay={bannerOverlay}
          className="animate-fade-up animate-delay-2 mb-10 h-44 md:mb-12 md:h-52"
          sizes="100vw"
        />
      ) : null}
    </div>
  );
}
