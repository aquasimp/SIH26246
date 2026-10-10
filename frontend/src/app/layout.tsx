import type { Metadata, Viewport } from "next";
import { plusJakartaSans, spaceGrotesk, khandFont, notoDevanagariFont, monoFont } from "@/fonts/display";
import "./globals.css";
import { Providers } from "./providers";
import { AppProvider } from "@/lib/store";
import { AppShell } from "@/components/layout/AppShell";
import { cookies } from "next/headers";

import { Language } from "@/lib/i18n";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F4F8FD" },
    { media: "(prefers-color-scheme: dark)", color: "#050811" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL('https://kaushalyuva.vercel.app'),
  title: "KaushalYuva — AI-Enabled Labour Market Intelligence & Skill Demand-Supply Forecasting Engine | MSDE",
  description: "Executive national intelligence platform predicting skill shortages, training oversupply, and policy interventions for Ministry of Skill Development and Entrepreneurship (MSDE).",
  icons: {
    icon: "/favicon.ico",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const rawLang = cookieStore.get("kaushalyuva-lang")?.value;
  const validLanguages: Language[] = ['en', 'hi', 'mr', 'ta', 'te', 'kn', 'bn'];
  const lang: Language = (validLanguages.includes(rawLang as any) ? rawLang : "en") as Language;

  return (
    <html 
      lang={lang} 
      suppressHydrationWarning 
      className={`${plusJakartaSans.variable} ${spaceGrotesk.variable} ${khandFont.variable} ${notoDevanagariFont.variable} ${monoFont.variable} scroll-smooth`}
    >
      <body className="min-h-screen text-[var(--text)] bg-[var(--bg)] antialiased selection:bg-[#ff6600]/30 selection:text-[#ff9944]">
        {/* Skip to Content for WCAG AA compliance */}
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-[var(--surface-solid)] focus:text-[var(--brand)] focus:border focus:border-[var(--brand)] focus:rounded-xl focus:shadow-2xl focus:font-bold text-xs"
        >
          {lang === 'hi' ? 'मुख्य सामग्री पर जाएं' : 'Skip to main content'}
        </a>

        <Providers>
          <AppProvider initialLanguage={lang}>
            <AppShell>
              {children}
            </AppShell>
          </AppProvider>
        </Providers>
      </body>
    </html>
  );
}
