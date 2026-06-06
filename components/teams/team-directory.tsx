"use client";

import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDeferredValue, useMemo, useState } from "react";
import { TeamCard } from "@/components/team-card";
import { Input } from "@/components/ui/input";
import { SelectField } from "@/components/ui/select";
import type { Team } from "@/lib/openfootball/types";

export function TeamDirectory({ teams }: { teams: Team[] }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [query, setQuery] = useState(searchParams.get("query") ?? "");
  const [group, setGroup] = useState(searchParams.get("group") ?? "all");
  const [confed, setConfed] = useState(searchParams.get("confed") ?? "all");
  const deferredQuery = useDeferredValue(query);
  const confeds = useMemo(
    () => [...new Set(teams.map((team) => team.confed))].toSorted(),
    [teams],
  );
  const groupOptions = useMemo(
    () => [
      { value: "all", label: "All groups" },
      ..."ABCDEFGHIJKL".split("").map((letter) => ({
        value: letter,
        label: `Group ${letter}`,
      })),
    ],
    [],
  );
  const confedOptions = useMemo(
    () => [
      { value: "all", label: "All confederations" },
      ...confeds.map((value) => ({ value, label: value })),
    ],
    [confeds],
  );

  function update(next: { query?: string; group?: string; confed?: string }) {
    const params = new URLSearchParams(searchParams);
    const values = { query, group, confed, ...next };
    for (const [key, value] of Object.entries(values)) {
      if (!value || value === "all") params.delete(key);
      else params.set(key, value);
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  const filtered = teams.filter((team) => {
    const matchesQuery = team.displayName
      .toLowerCase()
      .includes(deferredQuery.toLowerCase());
    return (
      matchesQuery &&
      (group === "all" || team.group === group) &&
      (confed === "all" || team.confed === confed)
    );
  });

  return (
    <section>
      <div className="sticky top-20 z-30 mb-8 grid gap-3 rounded-2xl border border-line-strong bg-background/90 p-3 shadow-card backdrop-blur-xl md:grid-cols-[1fr_10rem_12rem]">
        <Input
          aria-label="Search teams"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            update({ query: event.target.value });
          }}
          placeholder="Search nations"
          leading={<Search className="size-4" />}
        />
        <SelectField
          ariaLabel="Filter teams by group"
          value={group}
          options={groupOptions}
          onValueChange={(value) => {
            setGroup(value);
            update({ group: value });
          }}
        />
        <SelectField
          ariaLabel="Filter teams by confederation"
          value={confed}
          options={confedOptions}
          onValueChange={(value) => {
            setConfed(value);
            update({ confed: value });
          }}
        />
      </div>
      <p className="mb-5 text-sm text-muted">{filtered.length} nations</p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((team) => (
          <TeamCard key={team.fifa_code} team={team} />
        ))}
      </div>
    </section>
  );
}
