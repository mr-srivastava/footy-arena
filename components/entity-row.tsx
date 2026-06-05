import { ChevronRight } from "lucide-react";
import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

type EntityRowProps = {
  href?: string;
  leading?: ReactNode;
  title: ReactNode;
  meta?: ReactNode;
  trailing?: ReactNode;
  showChevron?: boolean;
  className?: string;
  titleClassName?: string;
  metaClassName?: string;
};

export function EntityRow({
  href,
  leading,
  title,
  meta,
  trailing,
  showChevron = true,
  className,
  titleClassName,
  metaClassName,
}: EntityRowProps) {
  const content = (
    <>
      {leading ? <div className="shrink-0">{leading}</div> : null}
      <div className="min-w-0">
        <div
          className={cn(
            "truncate font-display text-2xl leading-none tracking-wide text-foreground transition-colors group-hover/entity-row:text-gold",
            titleClassName,
          )}
        >
          {title}
        </div>
        {meta ? (
          <div
            className={cn(
              "mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground",
              metaClassName,
            )}
          >
            {meta}
          </div>
        ) : null}
      </div>
      {trailing ? <div className="shrink-0">{trailing}</div> : null}
      {showChevron ? (
        <ChevronRight
          className="size-4 shrink-0 text-muted-foreground transition-transform group-hover/entity-row:translate-x-1 group-hover/entity-row:text-gold"
          aria-hidden
        />
      ) : null}
    </>
  );

  const classes = cn(
    "group/entity-row grid grid-cols-[auto_1fr_auto] items-center gap-4 border-b border-line-soft px-1 py-4 transition-colors hover:border-gold/40",
    trailing && showChevron && "grid-cols-[auto_1fr_auto_auto]",
    !leading && "grid-cols-[1fr_auto]",
    !leading && trailing && showChevron && "grid-cols-[1fr_auto_auto]",
    className,
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }

  return <div className={classes}>{content}</div>;
}

export function EntityIconFrame({
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex size-12 items-center justify-center rounded-sm border border-line-strong bg-surface-glass shadow-artifact-inset",
        className,
      )}
      {...props}
    />
  );
}
