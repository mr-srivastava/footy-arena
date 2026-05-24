"use client";

import { ExternalLink, Loader2, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { PlayerComparisonTable } from "@/components/lab/bsd/player-comparison-table";
import { BsdSetupBanner } from "@/components/lab/bsd/setup-banner";
import {
  TeamEnrichmentSkeleton,
  TeamHeaderSkeleton,
} from "@/components/lab/bsd/team-detail-skeleton";
import { Button } from "@/components/ui/button";
import type { LabTeamSnapshot } from "@/lib/bsd/convex-snapshots";
import type {
  ConvexCountrySnapshot,
  TeamEnrichmentPayload,
} from "@/lib/bsd/enrichment-types";
import { GROUP_LETTERS } from "@/lib/openfootball/teams";
import { artifactSurface, cn } from "@/lib/utils";

type Slug = string;

function addToSet<T>(set: Set<T>, value: T) {
  const next = new Set(set);
  next.add(value);
  return next;
}

function removeFromSet<T>(set: Set<T>, value: T) {
  const next = new Set(set);
  next.delete(value);
  return next;
}

export function PlayerMetadataExplorer({
  countries,
  hasToken,
}: {
  countries: ConvexCountrySnapshot[];
  hasToken: boolean;
}) {
  const [activeGroup, setActiveGroup] = useState<string>("ALL");
  const [selectedSlug, setSelectedSlug] = useState<Slug | null>(countries[0]?.slug ?? null);

  const [teamCache, setTeamCache] = useState<Record<Slug, LabTeamSnapshot>>({});
  const [enrichmentCache, setEnrichmentCache] = useState<Record<Slug, TeamEnrichmentPayload>>({});
  const [loadingTeams, setLoadingTeams] = useState<Set<Slug>>(() => new Set());
  const [loadingEnrichments, setLoadingEnrichments] = useState<Set<Slug>>(() => new Set());
  const [teamErrors, setTeamErrors] = useState<Record<Slug, string>>({});
  const [enrichmentErrors, setEnrichmentErrors] = useState<Record<Slug, string>>({});

  const filteredCountries = useMemo(() => {
    if (activeGroup === "ALL") return countries;
    return countries.filter((country) => country.groupLetter === activeGroup);
  }, [activeGroup, countries]);

  const selectedCountry = countries.find((country) => country.slug === selectedSlug) ?? null;
  const selectedTeam = selectedSlug ? (teamCache[selectedSlug] ?? null) : null;
  const selectedEnrichment = selectedSlug ? (enrichmentCache[selectedSlug] ?? null) : null;

  const isLoadingTeam =
    selectedSlug != null && loadingTeams.has(selectedSlug) && selectedTeam == null;
  const isLoadingEnrichment =
    selectedSlug != null &&
    loadingEnrichments.has(selectedSlug) &&
    selectedEnrichment == null &&
    selectedTeam != null;
  const isRefreshingEnrichment =
    selectedSlug != null &&
    loadingEnrichments.has(selectedSlug) &&
    selectedEnrichment != null;

  const teamError = selectedSlug ? (teamErrors[selectedSlug] ?? null) : null;
  const enrichmentError = selectedSlug ? (enrichmentErrors[selectedSlug] ?? null) : null;

  useEffect(() => {
    if (!selectedSlug || teamCache[selectedSlug]) return;

    let cancelled = false;

    void (async () => {
      setLoadingTeams((current) => addToSet(current, selectedSlug));
      setTeamErrors((current) => {
        const next = { ...current };
        delete next[selectedSlug];
        return next;
      });

      try {
        const response = await fetch(
          `/api/lab/convex/team?slug=${encodeURIComponent(selectedSlug)}`,
        );
        const data = (await response.json()) as LabTeamSnapshot & { detail?: string };
        if (!response.ok) throw new Error(data.detail ?? "Failed to load team");
        if (cancelled) return;

        setTeamCache((current) => ({ ...current, [selectedSlug]: data }));
      } catch (err) {
        if (!cancelled) {
          setTeamErrors((current) => ({
            ...current,
            [selectedSlug]:
              err instanceof Error ? err.message : "Failed to load team",
          }));
        }
      } finally {
        if (!cancelled) {
          setLoadingTeams((current) => removeFromSet(current, selectedSlug));
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [selectedSlug, teamCache]);

  useEffect(() => {
    if (!hasToken || !selectedSlug || !selectedTeam || enrichmentCache[selectedSlug]) return;

    let cancelled = false;

    void (async () => {
      setLoadingEnrichments((current) => addToSet(current, selectedSlug));
      setEnrichmentErrors((current) => {
        const next = { ...current };
        delete next[selectedSlug];
        return next;
      });

      try {
        const response = await fetch("/api/lab/bsd/players", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            country: selectedTeam.country,
            players: selectedTeam.players,
            includeStats: true,
          }),
        });

        const data = (await response.json()) as TeamEnrichmentPayload & { detail?: string };
        if (!response.ok) throw new Error(data.detail ?? "Failed to enrich players");
        if (cancelled) return;

        setEnrichmentCache((current) => ({ ...current, [selectedSlug]: data }));
      } catch (err) {
        if (!cancelled) {
          setEnrichmentErrors((current) => ({
            ...current,
            [selectedSlug]:
              err instanceof Error ? err.message : "Failed to enrich players",
          }));
        }
      } finally {
        if (!cancelled) {
          setLoadingEnrichments((current) => removeFromSet(current, selectedSlug));
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [hasToken, selectedSlug, selectedTeam, enrichmentCache]);

  const reloadEnrichment = useCallback(async () => {
    if (!selectedSlug || !selectedTeam) return;

    setEnrichmentCache((current) => {
      const next = { ...current };
      delete next[selectedSlug];
      return next;
    });
    setLoadingEnrichments((current) => addToSet(current, selectedSlug));
    setEnrichmentErrors((current) => {
      const next = { ...current };
      delete next[selectedSlug];
      return next;
    });

    try {
      const response = await fetch("/api/lab/bsd/players", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          country: selectedTeam.country,
          players: selectedTeam.players,
          includeStats: true,
        }),
      });

      const data = (await response.json()) as TeamEnrichmentPayload & { detail?: string };
      if (!response.ok) throw new Error(data.detail ?? "Failed to enrich players");

      setEnrichmentCache((current) => ({ ...current, [selectedSlug]: data }));
    } catch (err) {
      setEnrichmentErrors((current) => ({
        ...current,
        [selectedSlug]:
          err instanceof Error ? err.message : "Failed to enrich players",
      }));
    } finally {
      setLoadingEnrichments((current) => removeFromSet(current, selectedSlug));
    }
  }, [selectedSlug, selectedTeam]);

  return (
    <div className="space-y-6">
      {!hasToken ? <BsdSetupBanner /> : null}

      <div className="grid items-start gap-6 xl:grid-cols-[17rem_minmax(0,1fr)]">
        <aside className="space-y-4 xl:sticky xl:top-24">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">
              Convex squads
            </p>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              Select a team to load its Convex squad, then match each player against BSD.
            </p>
          </div>

          <div className="flex flex-wrap gap-1.5">
            <GroupChip active={activeGroup === "ALL"} onClick={() => setActiveGroup("ALL")} label="All" />
            {GROUP_LETTERS.map((group) => (
              <GroupChip
                key={group}
                active={activeGroup === group}
                onClick={() => setActiveGroup(group)}
                label={group}
              />
            ))}
          </div>

          <div className="max-h-[min(70vh,40rem)] space-y-1.5 overflow-y-auto pr-1">
            {filteredCountries.map((country) => {
              const cached = teamCache[country.slug];
              const isSelected = selectedSlug === country.slug;
              const isPending = loadingTeams.has(country.slug) && !cached;

              return (
                <button
                  key={country.slug}
                  type="button"
                  onClick={() => setSelectedSlug(country.slug)}
                  className={cn(
                    "w-full rounded-sm border px-3 py-2.5 text-left transition-colors",
                    isSelected
                      ? "border-pitch-bright/40 bg-pitch/10"
                      : "border-white/8 bg-artifact/70 hover:border-white/15",
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-foreground">{country.displayName}</p>
                    {isPending ? (
                      <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin text-muted-foreground" aria-hidden />
                    ) : null}
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Group {country.groupLetter} · {country.fifaCode}
                    {cached ? ` · ${cached.players.length} players` : ""}
                  </p>
                </button>
              );
            })}
          </div>
        </aside>

        <main className="min-h-128">
          {!selectedCountry ? (
            <EmptyPanel message="Select a team to review BSD enrichment." />
          ) : (
            <div className="space-y-5">
              {isLoadingTeam ? (
                <TeamHeaderSkeleton />
              ) : (
                <TeamHeader
                  country={selectedCountry}
                  team={selectedTeam}
                  enrichment={selectedEnrichment}
                  onReload={() => void reloadEnrichment()}
                  isRefreshing={isRefreshingEnrichment}
                  canReload={hasToken && selectedTeam != null}
                />
              )}

              {teamError ? <ErrorPanel message={teamError} /> : null}
              {enrichmentError ? <ErrorPanel message={enrichmentError} /> : null}

              {isLoadingTeam ? (
                <TeamEnrichmentSkeleton />
              ) : isLoadingEnrichment ? (
                <TeamEnrichmentSkeleton playerCount={selectedTeam?.players.length ?? 8} />
              ) : selectedEnrichment ? (
                <PlayerComparisonTable enrichment={selectedEnrichment} />
              ) : selectedTeam && hasToken && !enrichmentError ? (
                <EmptyPanel message="BSD enrichment has not loaded yet." />
              ) : selectedTeam && !hasToken ? (
                <EmptyPanel message="Add BSD_API_TOKEN to your env file to run player matching." />
              ) : null}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function TeamHeader({
  country,
  team,
  enrichment,
  onReload,
  isRefreshing,
  canReload,
}: {
  country: ConvexCountrySnapshot;
  team: LabTeamSnapshot | null;
  enrichment: TeamEnrichmentPayload | null;
  onReload: () => void;
  isRefreshing: boolean;
  canReload: boolean;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div className="space-y-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">
            Group {country.groupLetter}
          </p>
          <h2 className="mt-1 font-display text-4xl tracking-wide text-foreground">
            {country.displayName.toUpperCase()}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {team
              ? `${team.players.length} Convex players`
              : "Loading squad from Convex…"}
            {team?.managerName ? ` · Manager ${team.managerName}` : ""}
            {enrichment?.bsdNationalTeamName
              ? ` · BSD national team ${enrichment.bsdNationalTeamName}`
              : ""}
          </p>
        </div>

        {enrichment ? (
          <div className={artifactSurface("inline-flex flex-wrap gap-x-5 gap-y-2 px-4 py-3 text-sm")}>
            <SummaryStat label="Matched" value={`${enrichment.summary.matched}/${enrichment.summary.total}`} />
            <SummaryStat label="With stats" value={String(enrichment.summary.withStats)} />
            <SummaryStat
              label="Unmatched"
              value={String(enrichment.summary.total - enrichment.summary.matched)}
              accent="text-red"
            />
          </div>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-2">
        {canReload ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onReload}
            disabled={isRefreshing || !team}
          >
            {isRefreshing ? (
              <Loader2 className="h-4 w-4 animate-spin" data-icon="inline-start" aria-hidden />
            ) : (
              <RefreshCw className="h-4 w-4" data-icon="inline-start" aria-hidden />
            )}
            Re-run BSD enrichment
          </Button>
        ) : null}
        <Button
          render={<Link href={`/teams/${country.slug}`} />}
          nativeButton={false}
          variant="outline"
          size="sm"
        >
          <ExternalLink data-icon="inline-start" aria-hidden />
          App team page
        </Button>
      </div>
    </div>
  );
}

function SummaryStat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: string;
}) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
      <p className={cn("mt-0.5 font-display text-2xl tracking-wide text-foreground", accent)}>
        {value}
      </p>
    </div>
  );
}

function ErrorPanel({ message }: { message: string }) {
  return (
    <p className="rounded-sm border border-red/30 bg-red/10 px-4 py-3 text-sm text-red">
      {message}
    </p>
  );
}

function EmptyPanel({ message }: { message: string }) {
  return (
    <div className={artifactSurface("flex min-h-64 items-center justify-center p-8 text-sm text-muted-foreground")}>
      {message}
    </div>
  );
}

function GroupChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-sm border px-2 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.14em]",
        active
          ? "border-pitch-bright/40 bg-pitch/15 text-pitch-bright"
          : "border-white/10 text-muted-foreground hover:border-white/20 hover:text-foreground",
      )}
    >
      {label}
    </button>
  );
}
