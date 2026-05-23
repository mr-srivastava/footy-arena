import type { ReactNode } from "react";

const widthClass = {
  wide: "max-w-6xl",
  narrow: "max-w-3xl",
} as const;

export function ContentContainer({
  as: Tag = "main",
  width = "wide",
  id,
  className = "",
  children,
}: {
  as?: "main" | "div" | "section";
  width?: keyof typeof widthClass;
  id?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Tag
      id={id}
      className={`relative z-10 mx-auto px-6 pb-8 ${widthClass[width]} ${className}`.trim()}
    >
      {children}
    </Tag>
  );
}
