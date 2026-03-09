import { createContext, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { UiPreferencesState } from './UiContext.types';

const UiContext = createContext<UiPreferencesState | null>(null);

export function UiProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [colorScheme, setColorScheme] = useState<'light' | 'dark'>('light');
  const [sidebarColor, setSidebarColor] = useState('');
  const [primaryColor, setPrimaryColor] = useState('');
  const [compactMode, setCompactMode] = useState(false);

  const value = useMemo<UiPreferencesState>(
    () => ({
      sidebarOpen,
      colorScheme,
      sidebarColor,
      primaryColor,
      compactMode,
      setSidebarOpen,
      toggleSidebar: () => setSidebarOpen((prev) => !prev),
      toggleColorScheme: () => setColorScheme((prev) => (prev === 'light' ? 'dark' : 'light')),
      setSidebarColor,
      setPrimaryColor,
      setCompactMode,
    }),
    [sidebarOpen, colorScheme, sidebarColor, primaryColor, compactMode],
  );

  return <UiContext.Provider value={value}>{children}</UiContext.Provider>;
}

export function useUi() {
  const value = useContext(UiContext);
  if (!value) {
    throw new Error('useUi must be used within UiProvider');
  }
  return value;
}
