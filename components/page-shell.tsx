export function PageShell({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative min-h-screen overflow-x-hidden bg-background ${className}`}
    >
      <div className="pointer-events-none absolute inset-0 hero-glow" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[56rem] editorial-grid" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[44rem] dotted-glow opacity-45" />
      <div
        className="pointer-events-none absolute inset-0 center-stripe"
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0 grain" />
      {children}
    </div>
  );
}
