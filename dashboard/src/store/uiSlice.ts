import type { StateCreator } from 'zustand';
import type { UiPreferencesState } from './ui.types';

export const createUiSlice: StateCreator<UiPreferencesState, [], [], UiPreferencesState> = (set) => ({
  sidebarOpen: true,
  colorScheme: 'light',
  sidebarColor: '',
  primaryColor: '',
  compactMode: false,
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  toggleColorScheme: () =>
    set((state) => ({
      colorScheme: state.colorScheme === 'light' ? 'dark' : 'light',
    })),
  setSidebarColor: (sidebarColor) => set({ sidebarColor }),
  setPrimaryColor: (primaryColor) => set({ primaryColor }),
  setCompactMode: (compactMode) => set({ compactMode }),
});
