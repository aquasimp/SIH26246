import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/lib/store";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { EvidenceDrawer } from "@/components/modals/EvidenceDrawer";
import { KaushalCopilotModal } from "@/components/modals/KaushalCopilotModal";
import { NotificationDrawer } from "@/components/modals/NotificationDrawer";

export const metadata: Metadata = {
  title: "KaushalPulse — AI-Enabled Labour Market Intelligence & Skill Forecasting Engine | MSDE",
  description: "Decision-support platform predicting skill shortages, training oversupply, and policy interventions for Ministry of Skill Development and Entrepreneurship (MSDE).",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen text-slate-900 bg-slate-50 antialiased selection:bg-blue-600 selection:text-white">
        <AppProvider>
          <div className="flex min-h-screen w-full relative">
            {/* Left Liquid Glass Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
              <Header />
              <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
                {children}
              </main>
            </div>
          </div>

          {/* Global Slideout & Modal Portals */}
          <EvidenceDrawer />
          <KaushalCopilotModal />
          <NotificationDrawer />
        </AppProvider>
      </body>
    </html>
  );
}
