import { Building2, Globe2, MapPin } from "lucide-react";
import type { Metadata } from "next";
import { CityJournalCard } from "@/components/cities/city-journal-card";
import { ContentContainer } from "@/components/content-container";
import { PageHero } from "@/components/page-hero";
import { PageShell } from "@/components/page-shell";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { StatCard } from "@/components/stat-card";
import { HOST_CITIES } from "@/lib/cities";

export const metadata: Metadata = {
  title: "Host Cities · Footy Arena",
  description:
    "A field guide to the 16 cities hosting the FIFA World Cup 2026.",
};

export default function CitiesPage() {
  return (
    <PageShell>
      <SiteHeader />
      <ContentContainer>
        <PageHero
          variant="list"
          eyebrow="The North American edition"
          title={
            <>
              SIXTEEN CITIES. <span className="text-gold">ONE WORLD.</span>
            </>
          }
          icon={Building2}
          subtitle="A travel-minded field guide to the stadiums, streets, and local rhythms surrounding World Cup 2026."
          stats={
            <>
              <StatCard
                value={HOST_CITIES.length}
                label="Host cities"
                icon={MapPin}
              />
              <StatCard
                value={3}
                label="Host nations"
                icon={Globe2}
                accent="text-gold"
              />
              <StatCard value={16} label="Venues" icon={Building2} />
            </>
          }
        />
        <div className="grid gap-5 py-12 md:grid-cols-2 lg:grid-cols-3">
          {HOST_CITIES.map((city, index) => (
            <CityJournalCard
              key={city.slug}
              city={city}
              featured={index === 0}
            />
          ))}
        </div>
      </ContentContainer>
      <SiteFooter />
    </PageShell>
  );
}
