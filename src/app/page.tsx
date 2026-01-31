"use client";

import { useState, useEffect } from "react";
import { AppState, BusinessIdea, ChatMessage, UserProfile, KilledIdea } from "@/lib/types";
import { usePrisonState } from "@/lib/store";
import Onboarding from "@/components/Onboarding";
import RejectionScreen from "@/components/RejectionScreen";
import PrisonCell from "@/components/PrisonCell";
import WardenChat from "@/components/WardenChat";
import { UserButton, SignedIn } from "@clerk/nextjs";

export default function Home() {
  const { state: cloudState, loading, saveToCloud } = usePrisonState();
  const [localState, setLocalState] = useState<AppState | null>(null);

  useEffect(() => {
    if (!loading && cloudState) {
      setLocalState(cloudState);
    }
  }, [cloudState, loading]);

  if (loading || !localState) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-text-grey text-sm tracking-widest animate-flicker">
          LOADING...
        </p>
      </div>
    );
  }

  async function handleOnboardingComplete(profile: UserProfile) {
    setLocalState((prev) => {
      if (!prev) return null;
      return { ...prev, screen: "prison", onboardingComplete: true, userProfile: profile };
    });
    await saveToCloud(profile);
  }

  function handleRejection(message: string) {
    setLocalState((prev) => {
      if (!prev) return null;
      return { ...prev, rejected: true, rejectionMessage: message };
    });
  }


  function handleGenerateIdea(idea: BusinessIdea) {
    setLocalState((prev) => {
      if (!prev) return null;
      return { ...prev, currentIdea: idea, chatMessages: [], executionPlan: null };
    });
  }

  function handleExecute(plan: string) {
    setLocalState((prev) => {
      if (!prev) return null;
      return { ...prev, currentIdea: null, executionPlan: plan, chatMessages: [] };
    });
  }

  async function handleMurder(reason: string) {
    if (!localState || !localState.currentIdea) return;

    const killed: KilledIdea = {
      id: localState.currentIdea.id,
      title: localState.currentIdea.title,
      category: localState.currentIdea.category,
    };

    const newKilledIdeas = [killed, ...localState.killedIdeas];

    setLocalState((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        currentIdea: null,
        executionPlan: null,
        chatMessages: [],
        killedIdeas: newKilledIdeas,
      };
    });

    if (localState.userProfile) {
      await saveToCloud(localState.userProfile, newKilledIdeas);
    }
  }

  if (localState.screen === "settings") {
    return (
      <div className="min-h-screen p-8 max-w-2xl mx-auto">
        <header className="flex justify-between items-center mb-8 border-b border-jailbar-grey pb-4">
          <h1 className="text-2xl font-bold tracking-widest text-text-white">SETTINGS</h1>
          <button onClick={() => setLocalState(p => p ? { ...p, screen: "prison" } : p)} className="text-text-grey hover:text-white text-sm">BACK</button>
        </header>
        <div className="space-y-8">
          <section>
            <h2 className="text-xs text-text-grey uppercase tracking-widest mb-4">Account</h2>
            <div className="flex items-center gap-4 border border-jailbar-grey p-4">
              <SignedIn><UserButton /></SignedIn>
              <div>
                <p className="text-text-white text-sm">Active Session</p>
                <p className="text-text-grey text-xs">Identity verified via Clerk</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }

  if (localState.rejected) {
    return <RejectionScreen message={localState.rejectionMessage} />;
  }

  if (!localState.onboardingComplete) {
    return <Onboarding onComplete={handleOnboardingComplete} onReject={handleRejection} />;
  }

  if (localState.screen === "warden" && localState.currentIdea) {
    return (
      <WardenChat
        idea={localState.currentIdea}
        messages={localState.chatMessages}
        userProfile={localState.userProfile!}
        onSendMessage={(msgs) => setLocalState(p => p ? { ...p, chatMessages: msgs } : p)}
        onBack={() => setLocalState(p => p ? { ...p, screen: "prison" } : p)}
      />
    );
  }

  return (
    <div className="relative">
      <nav className="absolute top-4 left-4 z-10">
        <button onClick={() => setLocalState(p => p ? { ...p, screen: "settings" } : p)} className="text-[10px] text-text-grey hover:text-white tracking-widest uppercase border border-jailbar-grey px-2 py-1">Settings</button>
      </nav>
      <PrisonCell
        userProfile={localState.userProfile!}
        currentIdea={localState.currentIdea}
        killedIdeas={localState.killedIdeas}
        onGenerateIdea={handleGenerateIdea}
        onExecute={handleExecute}
        onMurder={handleMurder}
        onTalkToWarden={() => setLocalState(p => p ? { ...p, screen: "warden" } : p)}
      />
    </div>
  );
}
