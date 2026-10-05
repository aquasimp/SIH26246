'use client';

import React from 'react';
import { useApp } from '@/lib/store';
import { CommandPalette } from './CommandPalette';

export function CommandPaletteContainer() {
  const { commandPaletteOpen, setCommandPaletteOpen, toggleFocusMode } = useApp();

  return (
    <CommandPalette
      open={commandPaletteOpen}
      onOpenChange={setCommandPaletteOpen}
      onToggleFocusMode={toggleFocusMode}
    />
  );
}
