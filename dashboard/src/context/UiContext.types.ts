export type UiPreferencesState = {
  sidebarOpen: boolean;
  colorScheme: 'light' | 'dark';
  sidebarColor: string;
  primaryColor: string;
  compactMode: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  toggleColorScheme: () => void;
  setSidebarColor: (color: string) => void;
  setPrimaryColor: (color: string) => void;
  setCompactMode: (compact: boolean) => void;
};
