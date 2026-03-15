import { getJson, postFormData } from '@/api/client';
import type { SettingsPayload } from './settingsApi.types';

export function getSettings() {
  return getJson<SettingsPayload>('/settings');
}

export function updateSettings(values: SettingsPayload) {
  const formData = new FormData();
  formData.append('parishName', values.parishName);
  formData.append('headerLine1', values.headerLine1);
  formData.append('headerLine2', values.headerLine2);
  formData.append('headerLine3', values.headerLine3);
  formData.append('headerLine4', values.headerLine4);
  formData.append('headerLine5', values.headerLine5);
  formData.append('headerLine6', values.headerLine6);
  formData.append('currentPriest', values.currentPriest);
  formData.append('currentPriestSignature', values.currentPriestSignature);
  formData.append('pdfImageLeft', values.pdfImageLeft);
  formData.append('pdfImageRight', values.pdfImageRight);
  formData.append('showParishSeal', String(values.showParishSeal));
  formData.append('showPdfImageLeft', String(values.showPdfImageLeft));
  formData.append('showPdfImageRight', String(values.showPdfImageRight));
  return postFormData<SettingsPayload>('/settings', formData);
}
