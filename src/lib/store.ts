import { AppState } from "./types";

const STORAGE_KEY = "zero-app-state";

const defaultState: AppState = {
  screen: "onboarding",
  onboardingComplete: false,
  rejected: false,
  rejectionMessage: "",
  userProfile: null,
  currentIdea: null,
  executionPlan: null,
  chatMessages: [],
};

export function loadState(): AppState {
  if (typeof window === "undefined") return defaultState;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as AppState;
    }
  } catch {
    // Corrupted state, reset
  }
  return defaultState;
}

export function saveState(state: AppState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage full or unavailable
  }
}

export function resetState(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}
