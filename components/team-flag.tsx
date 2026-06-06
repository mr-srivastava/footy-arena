export function TeamFlag({
  flag,
  name,
  size = "md",
}: {
  flag: string;
  name: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}) {
  const sizeClass = {
    xs: "text-base",
    sm: "text-xl",
    md: "text-3xl",
    lg: "text-4xl",
    xl: "text-5xl",
  }[size];

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center leading-none ${sizeClass}`}
      role="img"
      aria-label={`${name} flag`}
    >
      {flag}
    </span>
  );
}
