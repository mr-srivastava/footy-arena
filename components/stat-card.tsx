import type { LucideIcon } from "lucide-react";

export function StatCard({
  value,
  label,
  icon: Icon,
  accent = "text-pitch-bright",
  layout = "inline",
}: {
  value: string | number;
  label: string;
  icon: LucideIcon;
  accent?: string;
  layout?: "inline" | "stacked";
}) {
  if (layout === "stacked") {
    return (
      <div className="glass-panel glass-panel-interactive rounded-xl px-4 py-5">
        <Icon
          className="mb-2 h-5 w-5 text-pitch-bright/80"
          aria-hidden
        />
        <p className={`font-display text-4xl leading-none md:text-5xl ${accent}`}>
          {value}
        </p>
        <p className="mt-1 text-xs font-medium uppercase tracking-wider text-muted">
          {label}
        </p>
      </div>
    );
  }

  return (
    <div className="glass-panel glass-panel-interactive min-w-[9rem] flex-1 rounded-xl px-5 py-4">
      <div className="flex items-center gap-2 text-muted">
        <Icon className="h-4 w-4 text-pitch-bright/70" aria-hidden />
        <p className="text-xs font-medium uppercase tracking-wider">{label}</p>
      </div>
      <p className={`mt-2 font-display text-4xl leading-none ${accent}`}>
        {value}
      </p>
    </div>
  );
}
