import type React from "react";
import { cn } from "@/lib/utils";

const toneClasses = {
  pitch: "border-pitch-bright/45",
  gold: "border-gold/35",
} as const;

type HighlightBlockProps = {
  children: React.ReactNode;
  tone?: keyof typeof toneClasses;
  className?: string;
};

export function HighlightBlock({
  children,
  tone = "pitch",
  className,
}: HighlightBlockProps) {
  return (
    <section
      className={cn(
        "rounded-r-xl border-l-2 bg-white/[0.025] px-5 py-4",
        toneClasses[tone],
        className,
      )}
    >
      {children}
    </section>
  );
}
