import type { Metadata, Viewport } from "next";
import { displayFont, khandFont, notoDevanagariFont, monoFont } from "@/fonts/display";
import "./globals.css";
import { Providers } from "./providers";
import { AppProvider } from "@/lib/store";
import { AppShell } from "@/components/layout/AppShell";
import { cookies } from "next/headers";

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
      className={`${displayFont.variable} ${khandFont.variable} ${notoDevanagariFont.variable} ${monoFont.variable} scroll-smooth`}
    >
      <body className="min-h-screen text-[var(--text)] bg-[var(--bg)] antialiased selection:bg-[var(--brand)] selection:text-white">
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
