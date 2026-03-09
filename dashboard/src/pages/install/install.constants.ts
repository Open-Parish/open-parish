import type { SettingsValues, WizardStep } from './InstallWizard.types';

export const INSTALL_STEPS: WizardStep[] = [
  { title: 'Welcome', subtitle: 'Set up Open Parish in a few steps.' },
  { title: 'Admin Account', subtitle: 'Create the administrator login credentials.' },
  { title: 'Parish Information', subtitle: 'These details appear on every printed certificate.' },
  { title: 'Sample Data', subtitle: 'Optionally seed sample records to explore the system.' },
];

export const SAMPLE_SETTINGS: SettingsValues = {
  parishName: 'Our Lady of the Sacred Heart',
  headerLine1: 'Basilica Minore del Santo Niño de Cebu',
  headerLine2: 'Our Lady of the Sacred Heart Parish',
  headerLine3: 'Cebu City, Philippines',
  headerLine4: 'Tel No: (032) 341-8820',
  headerLine5: 'Parish Canonical Erection: March 19, 1954 - January 25, 1984',
  headerLine6: 'Parish Feast Day: October 11',
  currentPriest: 'Fr. Robert Francis Prevost',
};
