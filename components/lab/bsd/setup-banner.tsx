"use client";

import { KeyRound } from "lucide-react";
import { artifactSurface } from "@/lib/utils";

export function BsdSetupBanner() {
  return (
    <div className={artifactSurface("border-gold/25 bg-gold/5 p-5")}>
      <div className="flex items-start gap-3">
        <KeyRound className="mt-0.5 h-5 w-5 shrink-0 text-gold" aria-hidden />
        <p className="text-sm leading-relaxed text-muted-foreground">
          Convex data is live. BSD enrichment requires{" "}
          <code className="rounded-sm bg-white/6 px-1.5 py-0.5 text-xs text-gold">
            BSD_API_TOKEN
          </code>{" "}
          in your env file — without it, player matching and stats will not load.
        </p>
      </div>
    </div>
  );
}
