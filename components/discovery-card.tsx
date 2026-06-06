import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { MediaImage } from "@/components/media-image";
import { SurfaceLink } from "@/components/surface-link";

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
    <Link
      href={href}
      className="group relative block h-full min-h-80 overflow-hidden rounded-2xl border border-line-strong bg-artifact shadow-card transition-all duration-500 hover:-translate-y-1 hover:border-gold/30 hover:shadow-card-hover"
    >
      {image ? (
        <MediaImage
          src={image}
          alt=""
          className="absolute inset-0 transition-transform duration-700 group-hover:scale-[1.035]"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      ) : (
        <div className="surface-editorial-fallback absolute inset-0" />
      )}
      <div className="absolute inset-0 flex flex-col justify-between p-6">
        <div className="flex items-center justify-between">
          <span className="broadcast-label rounded-full border border-white/15 bg-black/25 px-3 py-2 text-white/70 backdrop-blur-md">
            Field notes
          </span>
          <ArrowUpRight className="size-5 text-white transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
        </div>
        <div>
          <h3 className="editorial-title type-card-title text-white transition-colors group-hover:text-gold">
            {title}
          </h3>
          <p className="type-copy mt-4 line-clamp-3 max-w-md text-white/70">
            {description}
          </p>
          <SurfaceLink className="mt-5 text-gold">Explore</SurfaceLink>
        </div>
      </div>
    </Link>
  );
}
