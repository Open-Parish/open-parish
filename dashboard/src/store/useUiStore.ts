import { create } from 'zustand';
import { createUiSlice } from './uiSlice';
import type { UiPreferencesState } from './ui.types';

export const useUiStore = create<UiPreferencesState>()((...args) => ({
  ...createUiSlice(...args),
}));
