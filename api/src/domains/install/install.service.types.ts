export type CountRow = { total?: unknown };

export type SystemSettingRow = { value?: unknown };

export type InstallStatus = {
  isCleanInstall: boolean;
  requiresWizard: boolean;
  isInstalled: boolean;
  sampleData: boolean;
  seedSample: boolean;
  usersCount: number;
  settingsCount: number;
};

export type InstallBootstrapInput = {
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
    currentPriestSignature?: string;
    pdfImageLeft?: string;
    pdfImageRight?: string;
  };
};

export type SeedBirthRecord = {
  firstName: string;
  lastName: string;
  address: string;
  parent1FirstName: string;
  parent1LastName: string;
  parent2FirstName?: string;
  parent2LastName?: string;
  sponsor1FirstName: string;
  sponsor1LastName: string;
  sponsor2FirstName?: string;
  sponsor2LastName?: string;
  celebrant: {
    firstName: string;
    lastName: string;
  };
  birthDate: string;
  occasionDate: string;
  bookNumber: number;
  pageNumber: number;
};

export type SeedConfirmationRecord = {
  firstName: string;
  lastName: string;
  address: string;
  parent1FirstName: string;
  parent1LastName: string;
  parent2FirstName?: string;
  parent2LastName?: string;
  celebrant: {
    firstName: string;
    lastName: string;
  };
  sponsor1FirstName: string;
  sponsor1LastName: string;
  sponsor2FirstName?: string;
  sponsor2LastName?: string;
  birthDate: string;
  occasionDate: string;
  bookNumber: number;
  pageNumber: number;
};

export type SeedDeathRecord = {
  firstName: string;
  lastName: string;
  address: string;
  age: string;
  spouseName: string;
  burialDate: string;
  deathDate: string;
  burialPlace: string;
  sacraments: string;
  celebrant: {
    firstName: string;
    lastName: string;
  };
  bookNumber: number;
  pageNumber: number;
};

export type SeedMarriageRecord = {
  brideFirstName: string;
  brideLastName: string;
  groomFirstName: string;
  groomLastName: string;
  sponsor1FirstName: string;
  sponsor1LastName: string;
  sponsor2FirstName: string;
  sponsor2LastName: string;
  licenseNumber: string;
  registryNumber: string;
  remarks: string;
  occasionDate: string;
  celebrant: {
    firstName: string;
    lastName: string;
  };
  bookNumber: number;
  pageNumber: number;
};

export type InstallSeedSampleData = {
  baptismal: SeedBirthRecord[];
  confirmation: SeedConfirmationRecord[];
  deaths: SeedDeathRecord[];
  marriages: SeedMarriageRecord[];
};
