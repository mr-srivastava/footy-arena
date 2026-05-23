export function PageShell({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative min-h-screen overflow-x-hidden ${className}`}
    >
      <div className="pointer-events-none absolute inset-0 hero-glow" />
      <div
        className="pointer-events-none absolute inset-0 center-stripe"
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0 grain" />
      {children}
    </div>
  );
}
