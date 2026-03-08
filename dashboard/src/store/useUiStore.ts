import { create } from 'zustand';
import { createUiSlice } from './uiSlice';
import type { UiState } from './ui.types';

export const useUiStore = create<UiState>()((...args) => ({
  ...createUiSlice(...args),
}));
