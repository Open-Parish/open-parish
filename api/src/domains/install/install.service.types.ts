export type CountRow = { total?: unknown };

export type SystemSettingRow = { value?: unknown };

export type InstallStatus = {
  isCleanInstall: boolean;
  requiresWizard: boolean;
  isInstalled: boolean;
  usersCount: number;
  settingsCount: number;
};
