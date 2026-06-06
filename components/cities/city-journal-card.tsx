import { ArrowUpRight, MapPin } from "lucide-react";
import Link from "next/link";
import { MediaImage } from "@/components/media-image";
import type { HostCity } from "@/lib/cities";

export function CityJournalCard({
  city,
  featured = false,
}: {
  city: HostCity;
  featured?: boolean;
}) {
  return (
    <Link
      href={`/cities/${city.slug}`}
      className={`group relative block overflow-hidden rounded-2xl border border-line-strong bg-artifact shadow-card ${
        featured ? "min-h-[32rem] md:col-span-2" : "min-h-96"
      }`}
    >
      <MediaImage
        src={city.image}
        alt={`${city.city} host-city atmosphere`}
        overlay="card"
        className="absolute inset-0 transition-transform duration-700 group-hover:scale-[1.025]"
        sizes={
          featured
            ? "(max-width: 768px) 100vw, 66vw"
            : "(max-width: 768px) 100vw, 33vw"
        }
      />
      <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-8">
        <div className="flex items-center justify-between">
          <span className="broadcast-label rounded-full border border-white/15 bg-black/25 px-3 py-2 text-white/75 backdrop-blur-md">
            {city.countryName}
          </span>
          <ArrowUpRight className="size-5 text-white transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
        </div>
        <div>
          <p className="type-meta flex items-center gap-2 text-white/70">
            <MapPin className="size-4 text-gold" />
            {city.venue}
          </p>
          <h2
            className={`editorial-title mt-3 text-white ${featured ? "type-section-title" : "type-card-title"}`}
          >
            {city.city}
          </h2>
          <p className="type-copy mt-4 max-w-xl text-white/75">{city.dek}</p>
        </div>
      </div>
    </Link>
  );
}
