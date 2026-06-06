import type { Metadata } from "next";
import { Montserrat, Racing_Sans_One } from "next/font/google";
import { QueryProvider } from "@/components/providers/query-provider";
import "./globals.css";
import { cn } from "@/lib/utils";

const racingSansOne = Racing_Sans_One({
  weight: "400",
  variable: "--font-racing",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Footy Arena - FIFA World Cup 2026",
  description:
    "Your home for FIFA World Cup 2026. Follow every match across the USA, Canada, and Mexico - 48 nations, one unforgettable tournament.",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
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
      className={cn("h-full", racingSansOne.variable, montserrat.variable)}
    >
      <body className="min-h-full font-body antialiased">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
