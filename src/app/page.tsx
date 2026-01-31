"use client";

import { useState } from "react";
import { AppState, BusinessIdea, ChatMessage, UserProfile } from "@/lib/types";
import { usePrisonState } from "@/lib/store";
import Onboarding from "@/components/Onboarding";
import RejectionScreen from "@/components/RejectionScreen";
import PrisonCell from "@/components/PrisonCell";
import WardenChat from "@/components/WardenChat";

export default function Home() {
  const { state: cloudState, loading, saveToCloud } = usePrisonState();
  const [localState, setLocalState] = useState<AppState | null>(null);
  const [seenIdeaIds, setSeenIdeaIds] = useState<string[]>([]);

  // Initialize local state from cloud (once, without useEffect)
  if (!localState && !loading && cloudState) {
    setLocalState(cloudState);
  }

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
    // Optimistically update local state to prevent refresh/loss
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
    
    // Save to cloud in background
    await saveToCloud(profile);
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
    // Reset local state directly to fresh onboarding.
    // Cannot rely on refresh() because rejected users have no DB record,
    // so cloudState wouldn't change and the rejected flag would persist.
    setLocalState({
      screen: "onboarding",
      onboardingComplete: false,
      rejected: false,
      rejectionMessage: "",
      userProfile: null,
      currentIdea: null,
      executionPlan: null,
      chatMessages: [],
    });
  }

  // Handle idea generation
  function handleGenerateIdea(idea: BusinessIdea) {
    setSeenIdeaIds((prev) => [...prev, idea.id]);
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

  // Handle execute — keep the idea visible so success screen can reference it
  function handleExecute(plan: string) {
    setLocalState((prev) =>
      prev
        ? {
            ...prev,
            executionPlan: plan,
            chatMessages: [],
          }
        : prev
    );
  }

  // Dismiss execution success and return to empty cell
  function handleDismissExecution() {
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

  // Handle murder
  function handleMurder() {
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

  // Guard: userProfile must exist after onboarding
  if (!localState.userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-text-grey text-sm tracking-widest animate-flicker">
          LOADING...
        </p>
      </div>
    );
  }

  // Execution success screen — show after user submits a plan
  if (localState.executionPlan && localState.currentIdea) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <div className="max-w-2xl w-full animate-fade-in">
          <div className="text-center mb-8">
            <div className="text-execute-green text-xs mb-4 tracking-widest">
              {"// EXECUTION CONFIRMED"}
            </div>
            <h1 className="text-3xl font-bold text-execute-green tracking-wider mb-2">
              PLAN LOCKED
            </h1>
            <p className="text-text-grey text-sm">
              No more thinking. Only doing.
            </p>
          </div>

          <div className="border-2 border-execute-green p-8 mb-6">
            <span className="text-execute-green text-xs uppercase tracking-widest">
              TARGET
            </span>
            <h2 className="text-xl font-bold text-text-white mt-2 mb-4">
              {localState.currentIdea.title}
            </h2>

            <span className="text-execute-green text-xs uppercase tracking-widest">
              YOUR PLAN
            </span>
            <p className="text-text-light text-sm leading-relaxed mt-2 whitespace-pre-line">
              {localState.executionPlan}
            </p>
          </div>

          <div className="text-center">
            <p className="text-text-grey text-xs mb-6">
              Screenshot this. Tattoo it on your arm. No excuses.
            </p>
            <button
              onClick={handleDismissExecution}
              className="px-8 py-4 border border-jailbar-grey text-text-grey uppercase tracking-widest text-xs hover:border-text-grey hover:text-text-light transition-all"
            >
              BACK TO THE CELL
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Warden Chat
  if (localState.screen === "warden" && localState.currentIdea) {
    return (
      <WardenChat
        idea={localState.currentIdea}
        messages={localState.chatMessages}
        userProfile={localState.userProfile}
        onSendMessage={handleChatMessages}
        onBack={handleBackFromWarden}
      />
    );
  }

  // Prison Cell (main dashboard)
  return (
    <PrisonCell
      userProfile={localState.userProfile}
      currentIdea={localState.currentIdea}
      seenIdeaIds={seenIdeaIds}
      onGenerateIdea={handleGenerateIdea}
      onExecute={handleExecute}
      onMurder={handleMurder}
      onTalkToWarden={handleTalkToWarden}
    />
  );
}
