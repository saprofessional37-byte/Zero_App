"use client";

import { useState, useEffect } from "react";
import { AppState, BusinessIdea, ChatMessage, UserProfile } from "@/lib/types";
import { usePrisonState } from "@/lib/store";
import Onboarding from "@/components/Onboarding";
import RejectionScreen from "@/components/RejectionScreen";
import PrisonCell from "@/components/PrisonCell";
import WardenChat from "@/components/WardenChat";

export default function Home() {
  const { state: cloudState, loading, saveToCloud, refresh } = usePrisonState();
  const [localState, setLocalState] = useState<AppState | null>({
    screen: "warden",
    onboardingComplete: true,
    rejected: false,
    rejectionMessage: "",
    userProfile: {
      ageBracket: "35-44",
      locationType: "Urban",
      employmentStatus: "Full-time",
      capitalAvailable: "$10,000",
      monthlyRunway: "6 months",
      weeklyHours: "20 hours",
      skillType: "Technical",
      pastAttempts: "2",
      biggestFailure: "Previous startup failed",
      whyNow: "Ready to go again",
      commitment: "High",
    },
    currentIdea: {
      id: "test-idea",
      title: "Test Business Idea",
      description: "A revolutionary way to sell air to people who already have air.",
      firstStep: "Find air",
      category: "service",
    },
    executionPlan: null,
    chatMessages: [],
  });

  // Sync cloud state to local state
  useEffect(() => {
    if (!loading && cloudState) {
      setLocalState(cloudState);
    }
  }, [cloudState, loading]);

  // Loading state (before hydration or while cloud fetching)
  if (loading || !localState) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-text-grey text-sm tracking-widest animate-flicker">
          LOADING...
        </p>
      </div>
    );
  }

  // Handle onboarding completion
  async function handleOnboardingComplete(profile: UserProfile) {
    await saveToCloud(profile);
    // State will be updated by cloud sync, but for immediate UI feedback:
    setLocalState((prev) =>
      prev
        ? {
            ...prev,
            screen: "prison",
            onboardingComplete: true,
            userProfile: profile,
          }
        : prev
    );
  }

  // Handle rejection
  function handleRejection(message: string) {
    setLocalState((prev) =>
      prev
        ? {
            ...prev,
            rejected: true,
            rejectionMessage: message,
          }
        : prev
    );
  }

  // Handle reset (try again after rejection)
  function handleReset() {
    // For now, since we only store userProfile in cloud, 
    // a reset just reloads the current cloud state
    refresh();
  }

  // Handle idea generation
  function handleGenerateIdea(idea: BusinessIdea) {
    setLocalState((prev) =>
      prev
        ? {
            ...prev,
            currentIdea: idea,
            chatMessages: [],
            executionPlan: null,
          }
        : prev
    );
  }

  // Handle execute
  function handleExecute(plan: string) {
    setLocalState((prev) =>
      prev
        ? {
            ...prev,
            currentIdea: null,
            executionPlan: plan,
            chatMessages: [],
          }
        : prev
    );
  }

  // Handle murder
  function handleMurder(_reason: string) {
    setLocalState((prev) =>
      prev
        ? {
            ...prev,
            currentIdea: null,
            executionPlan: null,
            chatMessages: [],
          }
        : prev
    );
  }

  // Navigate to warden chat
  function handleTalkToWarden() {
    setLocalState((prev) => (prev ? { ...prev, screen: "warden" } : prev));
  }

  // Navigate back from warden chat
  function handleBackFromWarden() {
    setLocalState((prev) => (prev ? { ...prev, screen: "prison" } : prev));
  }

  // Update chat messages
  function handleChatMessages(messages: ChatMessage[]) {
    setLocalState((prev) => (prev ? { ...prev, chatMessages: messages } : prev));
  }

  // Rejection screen
  if (localState.rejected) {
    return (
      <RejectionScreen
        message={localState.rejectionMessage}
        onReset={handleReset}
      />
    );
  }

  // Onboarding
  if (!localState.onboardingComplete) {
    return (
      <Onboarding
        onComplete={handleOnboardingComplete}
        onReject={handleRejection}
      />
    );
  }

  // Warden Chat
  if (localState.screen === "warden" && localState.currentIdea) {
    return (
      <WardenChat
        idea={localState.currentIdea}
        messages={localState.chatMessages}
        userProfile={localState.userProfile!}
        onSendMessage={handleChatMessages}
        onBack={handleBackFromWarden}
      />
    );
  }

  // Prison Cell (main dashboard)
  return (
    <PrisonCell
      userProfile={localState.userProfile!}
      currentIdea={localState.currentIdea}
      onGenerateIdea={handleGenerateIdea}
      onExecute={handleExecute}
      onMurder={handleMurder}
      onTalkToWarden={handleTalkToWarden}
    />
  );
}
