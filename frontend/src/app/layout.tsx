import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Noto_Sans_Devanagari } from "next/font/google";
import { displayFont } from "@/fonts/display";
import "./globals.css";
import { Providers } from "./providers";
import { AppProvider } from "@/lib/store";
import { AppShell } from "@/components/layout/AppShell";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const notoDevanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  variable: "--font-hi",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F7F6F2" },
    { media: "(prefers-color-scheme: dark)", color: "#090A0C" },
  ],
};

export const metadata: Metadata = {
  title: "KaushalYuva — AI-Enabled Labour Market Intelligence & Skill Demand-Supply Forecasting Engine | MSDE",
  description: "Executive national intelligence platform predicting skill shortages, training oversupply, and policy interventions for Ministry of Skill Development and Entrepreneurship (MSDE).",
  icons: {
    icon: "/favicon.ico",
  },
};

import { cookies } from "next/headers";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const lang = cookieStore.get("kaushalyuva-lang")?.value === "hi" ? "hi" : "en";

  return (
    <html 
      lang={lang} 
      suppressHydrationWarning 
      className={`${inter.variable} ${jetbrainsMono.variable} ${notoDevanagari.variable} ${displayFont.variable} scroll-smooth`}
    >
      <body className="min-h-screen text-[var(--text)] bg-[var(--bg)] antialiased selection:bg-[var(--brand)] selection:text-white">
        {/* Skip to Content for WCAG AA compliance */}
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-[var(--surface-solid)] focus:text-[var(--brand)] focus:border focus:border-[var(--brand)] focus:rounded-xl focus:shadow-2xl focus:font-bold text-xs"
        >
          Skip to main content
        </a>

        <Providers>
          <AppProvider>
            <AppShell>
              {children}
            </AppShell>
          </AppProvider>
        </Providers>
      </body>
    </html>
  );
}
