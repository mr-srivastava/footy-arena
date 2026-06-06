import * as React from "react";
import { cn } from "@/lib/utils";

type InputProps = React.ComponentProps<"input"> & {
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
};

function Input({ className, leading, trailing, ...props }: InputProps) {
  return (
    <label className="focus-gold-glow group/input relative flex h-12 items-center overflow-hidden rounded-xl border border-line-strong bg-artifact/85 px-4 shadow-artifact-inset transition-all focus-within:border-gold/40 focus-within:bg-artifact">
      <span className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-gold/35 to-transparent opacity-0 transition-opacity group-focus-within/input:opacity-100" />
      {leading ? (
        <span className="mr-3 shrink-0 text-gold">{leading}</span>
      ) : null}
      <input
        className={cn(
          "h-full min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/70",
          className,
        )}
        {...props}
      />
      {trailing ? <span className="ml-3 shrink-0">{trailing}</span> : null}
    </label>
  );
}

export { Input };
