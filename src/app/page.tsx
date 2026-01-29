"use client";

import { useState, useEffect } from "react";
import { AppState, BusinessIdea, ChatMessage, UserProfile } from "@/lib/types";
import { loadState, saveState, resetState } from "@/lib/store";
import Onboarding from "@/components/Onboarding";
import RejectionScreen from "@/components/RejectionScreen";
import PrisonCell from "@/components/PrisonCell";
import WardenChat from "@/components/WardenChat";

export default function Home() {
  const [state, setState] = useState<AppState | null>(null);

  // Load state from localStorage on mount
  useEffect(() => {
    setState(loadState());
  }, []);

  // Persist state changes
  useEffect(() => {
    if (state) {
      saveState(state);
    }
  }, [state]);

  // Loading state (before hydration)
  if (!state) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-text-grey text-sm tracking-widest animate-flicker">
          LOADING...
        </p>
      </div>
    );
  }

  // Handle onboarding completion
  function handleOnboardingComplete(profile: UserProfile) {
    setState((prev) =>
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
    setState((prev) =>
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
    resetState();
    setState(loadState());
  }

  // Handle idea generation
  function handleGenerateIdea(idea: BusinessIdea) {
    setState((prev) =>
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
    setState((prev) =>
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
    setState((prev) =>
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
    setState((prev) => (prev ? { ...prev, screen: "warden" } : prev));
  }

  // Navigate back from warden chat
  function handleBackFromWarden() {
    setState((prev) => (prev ? { ...prev, screen: "prison" } : prev));
  }

  // Update chat messages
  function handleChatMessages(messages: ChatMessage[]) {
    setState((prev) => (prev ? { ...prev, chatMessages: messages } : prev));
  }

  // Rejection screen
  if (state.rejected) {
    return (
      <RejectionScreen
        message={state.rejectionMessage}
        onReset={handleReset}
      />
    );
  }

  // Onboarding
  if (!state.onboardingComplete) {
    return (
      <Onboarding
        onComplete={handleOnboardingComplete}
        onReject={handleRejection}
      />
    );
  }

  // Warden Chat
  if (state.screen === "warden" && state.currentIdea) {
    return (
      <WardenChat
        idea={state.currentIdea}
        messages={state.chatMessages}
        onSendMessage={handleChatMessages}
        onBack={handleBackFromWarden}
      />
    );
  }

  // Prison Cell (main dashboard)
  return (
    <PrisonCell
      userProfile={state.userProfile!}
      currentIdea={state.currentIdea}
      onGenerateIdea={handleGenerateIdea}
      onExecute={handleExecute}
      onMurder={handleMurder}
      onTalkToWarden={handleTalkToWarden}
    />
  );
}
