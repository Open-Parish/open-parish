import { useEffect } from 'react';
import { getJson } from '@/api/client';
import { useUiStore } from '@/store/useUiStore';
import type { UserSetting } from './useUserSettings.types';

export function useUserSettings() {
  const setSidebarColor = useUiStore((state) => state.setSidebarColor);
  const setPrimaryColor = useUiStore((state) => state.setPrimaryColor);
  const setCompactMode = useUiStore((state) => state.setCompactMode);

  useEffect(() => {
    getJson<UserSetting[]>('/api/protected/user-settings')
      .then((settings) => {
        for (const setting of settings) {
          if (setting.key === 'sidebar-color') setSidebarColor(setting.value);
          if (setting.key === 'primary-color') setPrimaryColor(setting.value);
          if (setting.key === 'compact-mode') setCompactMode(setting.value === 'true');
        }
      })
      .catch(() => {
        // Silently ignore — settings are optional.
      });
  }, [setSidebarColor, setPrimaryColor, setCompactMode]);
}
