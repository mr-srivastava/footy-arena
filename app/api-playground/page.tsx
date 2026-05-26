import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ApiPlaygroundSwagger } from "@/components/api-playground/swagger-ui";

export const metadata: Metadata = {
  title: "API Playground - Footy Arena",
  description: "Development-only Swagger UI for Footy Arena API routes.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ApiPlaygroundPage() {
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white">
      <header className="border-b border-zinc-200 px-6 py-4">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-500">
          Development only
        </p>
        <h1 className="mt-1 text-2xl font-semibold text-zinc-900">API Playground</h1>
        <p className="mt-1 text-sm text-zinc-600">
          Explore and test Footy Arena route handlers with Swagger UI.
        </p>
      </header>

      <div className="api-playground">
        <ApiPlaygroundSwagger specUrl="/api-playground/openapi" />
      </div>
    </main>
  );
}
