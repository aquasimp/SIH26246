'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { MarketingTopbar, MarketingFooter } from '@/components/marketing/MarketingShell';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { EvidenceDrawer } from '@/components/modals/EvidenceDrawer';
import { KaushalCopilotModal } from '@/components/modals/KaushalCopilotModal';
import { NotificationDrawer } from '@/components/modals/NotificationDrawer';
import { CommandPaletteContainer } from '@/components/modals/CommandPaletteContainer';
import { Toaster } from 'sonner';

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const isMarketing = pathname === '/';

  if (isMarketing) {
    return (
      <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)]">
        <MarketingTopbar />
        <main id="main-content" tabIndex={-1} className="flex-1 outline-hidden">
          {children}
        </main>
        <MarketingFooter />

        {/* Global Portals & Drawers */}
        <CommandPaletteContainer />
        <EvidenceDrawer />
        <KaushalCopilotModal />
        <NotificationDrawer />
        <Toaster richColors position="bottom-right" />
      </div>
    );
  }

  return (
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

      {/* Global Portals & Drawers */}
      <CommandPaletteContainer />
      <EvidenceDrawer />
      <KaushalCopilotModal />
      <NotificationDrawer />
      <Toaster richColors position="bottom-right" />
    </div>
  );
};
