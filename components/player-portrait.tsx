import Image from "next/image";
import type { PlayerProfile } from "@/lib/discovery/types";
import { cn } from "@/lib/utils";

type PlayerPortraitProps = {
  player: Pick<PlayerProfile, "name">;
  src: string;
  variant?: "card" | "hero";
  className?: string;
  priority?: boolean;
};

const variantStyles = {
  card: {
    frame: "aspect-square max-h-[212px] sm:max-h-[228px]",
    image:
      "w-[min(100%,196px)] scale-[1.22] transition-transform duration-300 group-hover:scale-[1.28]",
    imageSizes: "(max-width: 640px) 46vw, 196px",
    inset: "inset-x-3 bottom-0 top-0",
    fade: "h-12 from-artifact/95 via-artifact/45",
  },
  hero: {
    frame: "aspect-square w-full max-w-xs mx-auto sm:max-w-sm md:mx-0 md:max-w-none",
    image: "w-[min(100%,220px)] scale-[1.28] md:scale-[1.34]",
    imageSizes: "(max-width: 768px) 72vw, 240px",
    inset: "inset-x-4 bottom-0 top-0 md:inset-x-5",
    fade: "h-14 from-background/95 via-background/50 md:from-artifact/95 md:via-artifact/50",
  },
} as const;

export function PlayerPortrait({
  player,
  src,
  variant = "card",
  className,
  priority = false,
}: PlayerPortraitProps) {
  const styles = variantStyles[variant];

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <div
        className={cn(
          "surface-portrait relative",
          styles.frame,
        )}
      >
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-pitch-bright/25 to-transparent"
          aria-hidden
        />

        <div
          className={cn(
            "absolute flex items-end justify-center",
            styles.inset,
          )}
        >
          <Image
            src={src}
            alt={player.name}
            width={192}
            height={192}
            sizes={styles.imageSizes}
            priority={priority}
            className={cn(
              "portrait-shadow-card h-auto origin-bottom object-contain object-bottom",
              styles.image,
            )}
          />
        </div>

        <div
          className={cn(
            "pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t to-transparent",
            styles.fade,
          )}
          aria-hidden
        />
        <div className="grain pointer-events-none absolute inset-0 opacity-15" aria-hidden />
      </div>
    </div>
  );
}
