"use client";

import { Select as SelectPrimitive } from "@base-ui/react/select";
import { Check, ChevronDown } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type SelectOption = {
  value: string;
  label: string;
  description?: string;
};

export function SelectField({
  value,
  onValueChange,
  options,
  icon,
  ariaLabel,
  className,
}: {
  value: string;
  onValueChange: (value: string) => void;
  options: SelectOption[];
  icon?: ReactNode;
  ariaLabel: string;
  className?: string;
}) {
  return (
    <SelectPrimitive.Root
      value={value}
      onValueChange={(next) => {
        if (next) onValueChange(next);
      }}
      items={options}
    >
      <SelectPrimitive.Trigger
        aria-label={ariaLabel}
        className={cn(
          "group/select flex h-12 min-w-0 items-center gap-3 rounded-xl border border-line-strong bg-artifact/85 px-4 text-left text-sm text-foreground shadow-artifact-inset outline-none transition-all hover:border-gold/25 data-[popup-open]:border-gold/40 data-[popup-open]:bg-artifact focus-visible:border-gold/40 focus-visible:ring-3 focus-visible:ring-gold/10",
          className,
        )}
      >
        {icon ? <span className="shrink-0 text-gold">{icon}</span> : null}
        <SelectPrimitive.Value className="min-w-0 flex-1 truncate" />
        <SelectPrimitive.Icon className="text-muted-foreground transition-transform group-data-[popup-open]/select:rotate-180">
          <ChevronDown className="size-4" />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
      <SelectPrimitive.Portal>
        <SelectPrimitive.Positioner sideOffset={8} alignItemWithTrigger={false} className="z-[80] outline-none">
          <SelectPrimitive.Popup className="w-[var(--anchor-width)] min-w-56 origin-[var(--transform-origin)] overflow-hidden rounded-2xl border border-line-strong bg-artifact-deep p-1.5 text-foreground shadow-board backdrop-blur-2xl transition-[transform,scale,opacity] data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0">
            <SelectPrimitive.List className="max-h-80 overflow-y-auto py-1">
              {options.map((option) => (
                <SelectPrimitive.Item
                  key={option.value}
                  value={option.value}
                  className="group/item grid cursor-default grid-cols-[1fr_auto] items-center gap-4 rounded-xl px-3 py-2.5 text-sm outline-none transition-colors data-[highlighted]:bg-white/[0.055] data-[selected]:text-gold"
                >
                  <div>
                    <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
                    {option.description ? (
                      <p className="mt-0.5 text-xs text-muted-foreground">{option.description}</p>
                    ) : null}
                  </div>
                  <SelectPrimitive.ItemIndicator className="text-gold">
                    <Check className="size-4" />
                  </SelectPrimitive.ItemIndicator>
                </SelectPrimitive.Item>
              ))}
            </SelectPrimitive.List>
          </SelectPrimitive.Popup>
        </SelectPrimitive.Positioner>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
}
