export type InstallStatus = {
  isCleanInstall: boolean;
  requiresWizard: boolean;
  isInstalled: boolean;
  sampleData: boolean;
  seedSample: boolean;
  usersCount: number;
  settingsCount: number;
};

export type BootstrapPayload = {
  sampleData: boolean;
  seedSample: boolean;
  user: {
    email: string;
    password: string;
    repeatPassword: string;
  };
  settings: {
    parishName: string;
    headerLine1: string;
    headerLine2: string;
    headerLine3: string;
    headerLine4: string;
    headerLine5: string;
    headerLine6: string;
    currentPriest: string;
    currentPriestSignature: string;
    pdfImageLeft: string;
    pdfImageRight: string;
  };
};
