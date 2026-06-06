import { UserRound } from "lucide-react";
import Image from "next/image";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { BSD_PLAYER_PORTRAIT_OPTIONS, playerImageUrl } from "@/lib/bsd/format";

const portraitVariants = cva("relative shrink-0 overflow-hidden rounded-full", {
  variants: {
    size: {
      sm: "size-9 sm:size-10",
      md: "size-12",
    },
    variant: {
      list: "border border-line-strong bg-navy-light/60",
      pitch: "border-2 border-gold/40 bg-surface-glass shadow-artifact-inset",
    },
  },
  defaultVariants: {
    size: "md",
    variant: "list",
  },
});

const imageFitByVariant = {
  list: "object-contain p-1",
  pitch: "object-cover object-top",
} as const;

type PlayerPortraitProps = {
  playerId?: number | null;
  name: string;
  number?: number | null;
  className?: string;
} & VariantProps<typeof portraitVariants>;

export function PlayerPortrait({
  playerId,
  name,
  number,
  size,
  variant = "list",
  className,
}: PlayerPortraitProps) {
  const resolvedVariant = variant ?? "list";

  if (playerId) {
    return (
      <div className={cn(portraitVariants({ size, variant }), className)}>
        <Image
          src={playerImageUrl(playerId, BSD_PLAYER_PORTRAIT_OPTIONS)}
          alt={name}
          fill
          className={imageFitByVariant[resolvedVariant]}
          sizes="48px"
        />
      </div>
    );
  }

  if (resolvedVariant === "pitch") {
    return (
      <div
        className={cn(
          portraitVariants({ size, variant }),
          "flex items-center justify-center",
          className,
        )}
      >
        <span className="type-broadcast text-sm text-gold">
          {number ?? "—"}
        </span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        portraitVariants({ size, variant }),
        "flex items-center justify-center bg-surface-glass",
        className,
      )}
      aria-hidden={resolvedVariant === "list"}
    >
      <UserRound
        className={cn(
          "text-muted-foreground",
          size === "sm" ? "size-4" : "size-4",
        )}
      />
    </div>
  );
}
