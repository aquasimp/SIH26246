import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Noto_Sans_Devanagari } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { AppProvider } from "@/lib/store";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { EvidenceDrawer } from "@/components/modals/EvidenceDrawer";
import { KaushalCopilotModal } from "@/components/modals/KaushalCopilotModal";
import { NotificationDrawer } from "@/components/modals/NotificationDrawer";
import { CommandPaletteContainer } from "@/components/modals/CommandPaletteContainer";
import { Toaster } from "sonner";

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
  title: "KaushalPulse — AI-Enabled Labour Market Intelligence & Skill Demand-Supply Forecasting Engine | MSDE",
  description: "Executive national intelligence platform predicting skill shortages, training oversupply, and policy interventions for Ministry of Skill Development and Entrepreneurship (MSDE).",
  icons: {
    icon: "/favicon.ico",
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
      suppressHydrationWarning 
      className={`${inter.variable} ${jetbrainsMono.variable} ${notoDevanagari.variable} scroll-smooth`}
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
            <div className="flex min-h-screen w-full relative">
              {/* Left Liquid Glass Sidebar */}
              <Sidebar />

              {/* Main Workspace Area */}
              <div className="flex-1 flex flex-col min-w-0 transition-all">
                <Header />
                <main id="main-content" tabIndex={-1} className="flex-1 p-3 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto outline-hidden">
                  {children}
                </main>
              </div>
            </div>

            {/* Global Portals & Drawers */}
            <CommandPaletteContainer />
            <EvidenceDrawer />
            <KaushalCopilotModal />
            <NotificationDrawer />
            <Toaster richColors position="bottom-right" />
          </AppProvider>
        </Providers>
      </body>
    </html>
  );
}
