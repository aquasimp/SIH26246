import type { Metadata, Viewport } from "next";
import { 
  plusJakartaSans, 
  instrumentSerif, 
  instrumentSans, 
  khandFont, 
  notoDevanagariFont, 
  monoFont,
  notoTamilFont,
  notoTeluguFont,
  notoKannadaFont,
  notoBengaliFont
} from "@/fonts/display";
import "./globals.css";
import { Providers } from "./providers";
import { AppProvider } from "@/lib/store";
import { AppShell } from "@/components/layout/AppShell";
import { cookies, headers } from "next/headers";

import { Language } from "@/lib/i18n";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F4F7FB" },
    { media: "(prefers-color-scheme: dark)", color: "#0B132B" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL('https://kaushalyuva.vercel.app'),
  title: "KaushalYuva — AI-Enabled Labour Market Intelligence & Skill Demand-Supply Forecasting Engine | MSDE",
  description: "Executive national intelligence platform predicting skill shortages, training oversupply, and policy interventions for Ministry of Skill Development and Entrepreneurship (MSDE).",
  other: {
    google: 'notranslate',
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "32x32" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const headersList = await headers();
  const rawLang = headersList.get("x-lang") || cookieStore.get("kaushalyuva-lang")?.value;
  const isValidLanguage = (val: unknown): val is Language =>
    typeof val === 'string' && ['en', 'hi', 'mr', 'ta', 'te', 'kn', 'bn'].includes(val);
  const lang: Language = isValidLanguage(rawLang) ? rawLang : "en";

  const skipToContentText: Record<Language, string> = {
    en: 'Skip to main content',
    hi: 'मुख्य सामग्री पर जाएं',
    mr: 'मुख्य मजकुरावर जा',
    ta: 'முக்கிய உள்ளடக்கத்திற்குச் செல்க',
    te: 'ప్రధాన కంటెంట్‌కు వెళ్లండి',
    kn: 'ಮುಖ್ಯ ವಿಷಯಕ್ಕೆ ಹೋಗಿ',
    bn: 'মূল বিষয়বস্তুতে যান'
  };

  return (
    <html 
      lang={lang} 
      translate="no"
      suppressHydrationWarning 
      className={`notranslate ${plusJakartaSans.variable} ${instrumentSerif.variable} ${instrumentSans.variable} ${khandFont.variable} ${notoDevanagariFont.variable} ${monoFont.variable} ${notoTamilFont.variable} ${notoTeluguFont.variable} ${notoKannadaFont.variable} ${notoBengaliFont.variable} scroll-smooth`}
    >
      <head>
        <meta name="google" content="notranslate" />
      </head>
      <body className="notranslate min-h-screen text-[var(--text)] bg-[var(--bg)] antialiased selection:bg-sky-600/20 selection:text-sky-900 dark:selection:bg-sky-400/20 dark:selection:text-sky-100">
        {/* Skip to Content for WCAG AA compliance */}
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-[var(--surface-solid)] focus:text-[var(--brand)] focus:border focus:border-[var(--brand)] focus:rounded-xl focus:shadow-2xl focus:font-bold text-xs"
        >
          {skipToContentText[lang] || skipToContentText.en}
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
