"use client";

import Image from "next/image";
import type { BsdPlayerListItem } from "@/lib/bsd/enrichment-types";
import { playerImageUrl } from "@/lib/bsd/format";
import { artifactSurface } from "@/lib/utils";

function formatMoney(value: number | null) {
  if (value == null) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "EUR",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export function BsdPlayerDetailCard({ player }: { player: BsdPlayerListItem }) {
  return (
    <article className={artifactSurface("p-4")}>
      <div className="flex items-start gap-4">
        <div className="relative size-16 shrink-0 overflow-hidden rounded-sm border border-white/10 bg-navy-light/60">
          <Image
            src={playerImageUrl(player.id)}
            alt={player.short_name}
            fill
            className="object-contain p-1.5"
            sizes="64px"
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-display text-xl tracking-wide text-foreground">
            {player.short_name.toUpperCase()}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {player.specific_position} · {player.nationality} · BSD #{player.id}
          </p>
        </div>
      </div>

      <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
        <Detail label="Preferred foot" value={player.preferred_foot ?? "—"} />
        <Detail label="Height" value={player.height_cm ? `${player.height_cm} cm` : "—"} />
        <Detail label="Weight" value={player.weight_kg ? `${player.weight_kg} kg` : "—"} />
        <Detail label="Market value" value={formatMoney(player.market_value_eur)} />
        <Detail label="Availability" value={player.availability} />
        <Detail label="Contract until" value={player.contract_until ?? "—"} />
        <Detail label="Date of birth" value={player.date_of_birth} />
        <Detail label="Club team id" value={String(player.current_team_id ?? "—")} />
      </dl>
    </article>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-sm border border-white/8 bg-background/30 px-3 py-2">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-1 font-medium text-foreground">{value}</dd>
    </div>
  );
}
