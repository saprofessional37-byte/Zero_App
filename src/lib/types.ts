export type Capital = "$0" | "$100" | "$500";
export type TimeAvailable = "<5h" | "10h" | "20h+";

export interface UserProfile {
  biggestFailure: string;
  capital: Capital;
  timeAvailable: TimeAvailable;
}

export interface BusinessIdea {
  id: string;
  title: string;
  description: string;
  firstStep: string;
  category: "service" | "low-cost" | "medium";
}

export type Screen = "onboarding" | "prison" | "warden";

export interface AppState {
  screen: Screen;
  onboardingComplete: boolean;
  rejected: boolean;
  rejectionMessage: string;
  userProfile: UserProfile | null;
  currentIdea: BusinessIdea | null;
  executionPlan: string | null;
  chatMessages: ChatMessage[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "mike";
  content: string;
}
