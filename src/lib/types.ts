export interface UserProfile {
  ageBracket: string;
  locationType: string;
  employmentStatus: string;
  capitalAvailable: string;
  monthlyRunway: string;
  weeklyHours: string;
  skillType: string;
  pastAttempts: string;
  biggestFailure: string;
  whyNow: string;
  commitment: string;
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
