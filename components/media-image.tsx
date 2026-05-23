import Image from "next/image";
import { cn } from "@/lib/utils";

type MediaImageProps = {
  src: string;
  alt: string;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  sizes?: string;
  overlay?: "card" | "hero" | "portrait" | "none";
};

export function MediaImage({
  src,
  alt,
  className,
  imageClassName,
  priority = false,
  sizes = "(max-width: 768px) 100vw, 50vw",
  overlay = "card",
}: MediaImageProps) {
  return (
    <div className={cn("relative overflow-hidden bg-navy", className)}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={cn(
          "object-cover",
          overlay === "portrait" && "object-top",
          imageClassName,
        )}
      />
      {overlay === "card" ? (
        <>
          <div
            className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/20 to-transparent"
            aria-hidden
          />
          <div className="grain absolute inset-0 opacity-40" aria-hidden />
        </>
      ) : null}
      {overlay === "hero" ? (
        <>
          <div
            className="absolute inset-0 bg-gradient-to-r from-navy via-navy/55 to-navy/20"
            aria-hidden
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-transparent"
            aria-hidden
          />
          <div className="grain absolute inset-0 opacity-35" aria-hidden />
        </>
      ) : null}
      {overlay === "portrait" ? (
        <>
          <div
            className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(255,255,255,0.08),transparent_55%)]"
            aria-hidden
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-navy via-navy/35 to-navy/10"
            aria-hidden
          />
        </>
      ) : null}
    </div>
  );
}
