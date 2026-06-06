import type { Metadata } from "next";
import { Archivo, Bebas_Neue, Cormorant_Garamond } from "next/font/google";
import { QueryProvider } from "@/components/providers/query-provider";
import "./globals.css";
import { cn } from "@/lib/utils";

const bebas = Bebas_Neue({
  weight: "400",
  variable: "--font-bebas",
  subsets: ["latin"],
});

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
});

const editorial = Cormorant_Garamond({
  variable: "--font-editorial",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Footy Arena - FIFA World Cup 2026",
  description:
    "Your home for FIFA World Cup 2026. Follow every match across the USA, Canada, and Mexico - 48 nations, one unforgettable tournament.",
  openGraph: {
    title: "Footy Arena - FIFA World Cup 2026",
    description:
      "The biggest World Cup ever. June 11 - July 19, 2026 across North America.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={cn("h-full", bebas.variable, archivo.variable, editorial.variable)}
    >
      <body className="min-h-full font-[family-name:var(--font-archivo)] antialiased">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
