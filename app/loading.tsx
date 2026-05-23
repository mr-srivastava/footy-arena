export default function Loading() {
  return (
    <div className="min-h-screen pitch-grid">
      <div className="pointer-events-none absolute inset-0 hero-glow" aria-hidden />
      <div className="relative z-10 mx-auto max-w-6xl animate-pulse px-6 py-24">
        <div className="mx-auto h-4 w-40 rounded bg-white/10" />
        <div className="mx-auto mt-6 h-24 w-72 rounded bg-white/10" />
        <div className="mx-auto mt-6 h-5 w-full max-w-lg rounded bg-white/5" />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-36 rounded-xl border border-white/8 bg-navy-light/40"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
