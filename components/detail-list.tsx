import type React from "react";
import { cn } from "@/lib/utils";

type DetailListProps = {
  children: React.ReactNode;
  className?: string;
  as?: "ul" | "dl";
};

type DetailListItemProps = {
  children: React.ReactNode;
  className?: string;
  as?: "li" | "div";
};

type DetailListRowProps = {
  label: string;
  value: string;
};

export function DetailList({
  children,
  className,
  as: Component = "ul",
}: DetailListProps) {
  return (
    <Component className={cn("divide-y divide-line-soft", className)}>
      {children}
    </Component>
  );
}

export function DetailListItem({
  children,
  className,
  as: Component = "li",
}: DetailListItemProps) {
  return <Component className={cn("py-4", className)}>{children}</Component>;
}

export function DetailListRow({ label, value }: DetailListRowProps) {
  return (
    <DetailListItem className="flex items-baseline justify-between gap-4 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium text-foreground">{value}</span>
    </DetailListItem>
  );
}
