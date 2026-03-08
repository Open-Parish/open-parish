export interface ActionFeedbackState {
  error: string | null;
  success: string | null;
  locationKey: string | null;
  setError: (error: string | null) => void;
  setSuccess: (success: string | null) => void;
  setLocationKey: (locationKey: string) => void;
  clear: () => void;
}
