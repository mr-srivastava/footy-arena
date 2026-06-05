import Link from "next/link";
import { MediaImage } from "@/components/media-image";
import { SurfaceLink } from "@/components/surface-link";
import { Card, CardContent } from "@/components/ui/card";

export function DiscoveryCard({
  title,
  description,
  href,
  image,
}: {
  title: string;
  description: string;
  href: string;
  image?: string;
}) {
  return (
    <Link href={href} className="group block h-full">
      <article
        className="h-full"
      >
        <Card
          variant="elevated"
          shape="artifact"
          padding="none"
          interactive
          className="h-full group-hover:border-gold/35"
        >
          {image ? (
            <MediaImage
              src={image}
              alt=""
              className="h-28 shrink-0"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : null}
          <CardContent className="relative flex flex-1 flex-col p-5">
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-gold/70 via-pitch-bright/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100"
              aria-hidden
            />
            <h3 className="font-display text-3xl leading-none tracking-wide text-foreground transition-colors group-hover:text-gold">
              {title.toUpperCase()}
            </h3>
            <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
              {description}
            </p>
            <SurfaceLink className="mt-5">
              Explore
            </SurfaceLink>
          </CardContent>
        </Card>
      </article>
    </Link>
  );
}
