import type { Metadata } from "next";
import { Archivo, Bebas_Neue } from "next/font/google";
import "./globals.css";

const bebas = Bebas_Neue({
  weight: "400",
  variable: "--font-bebas",
  subsets: ["latin"],
});

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Footy Arena — FIFA World Cup 2026",
  description:
    "Your home for FIFA World Cup 2026. Follow every match across the USA, Canada, and Mexico — 48 nations, one unforgettable tournament.",
  openGraph: {
    title: "Footy Arena — FIFA World Cup 2026",
    description:
      "The biggest World Cup ever. June 11 – July 19, 2026 across North America.",
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
      className={`${bebas.variable} ${archivo.variable} h-full`}
    >
      <body className="min-h-full font-[family-name:var(--font-archivo)] antialiased">
        {children}
      </body>
    </html>
  );
}
