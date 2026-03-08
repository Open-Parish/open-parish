import { create } from 'zustand';
import type { ActionFeedbackState } from './useActionFeedback.types';

export const useActionFeedback = create<ActionFeedbackState>((set) => ({
  error: null,
  success: null,
  locationKey: null,
  setError: (error) => set({ error, success: null }),
  setSuccess: (success) => set({ success, error: null }),
  setLocationKey: (locationKey) => set({ locationKey }),
  clear: () => set({ error: null, success: null }),
}));
