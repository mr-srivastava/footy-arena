"use client";

import { CalendarDays, Layers3, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SelectField } from "@/components/ui/select";

export function FixtureFilters({
  dates,
}: {
  dates: { value: string; label: string }[];
}) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const date = searchParams.get("date") ?? "all";
  const stage = searchParams.get("stage") ?? "all";

  function update(key: "date" | "stage", value: string) {
    const params = new URLSearchParams(searchParams);
    if (value === "all") params.delete(key);
    else params.set(key, value);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  const filtered = date !== "all" || stage !== "all";
  const dateOptions = [{ value: "all", label: "Every match day" }, ...dates];
  const stageOptions = [
    { value: "all", label: "Every stage" },
    { value: "group", label: "Group stage" },
    { value: "knockout", label: "Knockout rounds" },
    { value: "final", label: "Final" },
  ];

  return (
    <div className="sticky top-20 z-30 mb-10 flex flex-col gap-3 rounded-2xl border border-line-strong bg-background/90 p-3 shadow-card backdrop-blur-xl sm:flex-row">
      <SelectField
        ariaLabel="Filter fixtures by date"
        value={date}
        options={dateOptions}
        icon={<CalendarDays className="size-4" />}
        className="flex-1"
        onValueChange={(value) => update("date", value)}
      />
      <SelectField
        ariaLabel="Filter fixtures by stage"
        value={stage}
        options={stageOptions}
        icon={<Layers3 className="size-4" />}
        className="flex-1"
        onValueChange={(value) => update("stage", value)}
      />
      {filtered ? (
        <button
          type="button"
          onClick={() => router.replace(pathname, { scroll: false })}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-line-soft px-4 text-sm text-muted hover:text-foreground"
        >
          <X className="size-4" /> Clear
        </button>
      ) : null}
    </div>
  );
}
