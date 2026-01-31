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
  const { state: cloudState, loading, saveToCloud, refresh } = usePrisonState();
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

  function handleReset() {
    refresh();
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
      ...localState.currentIdea,
      killedAt: new Date().toISOString(),
      reason,
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

  if (localState.screen === "history") {
    return (
      <div className="min-h-screen p-8 max-w-2xl mx-auto">
        <header className="flex justify-between items-center mb-8 border-b border-jailbar-grey pb-4">
          <h1 className="text-2xl font-bold tracking-widest text-text-white">HISTORY</h1>
          <button onClick={() => setLocalState(p => p ? { ...p, screen: "prison" } : p)} className="text-text-grey hover:text-white text-sm">BACK</button>
        </header>
        <div className="space-y-6">
          {localState.killedIdeas.length === 0 ? (
            <p className="text-text-grey text-center">No ideas killed yet. Get to work.</p>
          ) : (
            localState.killedIdeas.map((idea, i) => (
              <div key={i} className="border border-danger-red/30 p-4 bg-danger-red/5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-text-white font-bold">{idea.title}</h3>
                  <span className="text-[10px] text-text-grey uppercase">{new Date(idea.killedAt).toLocaleDateString()}</span>
                </div>
                <p className="text-text-grey text-xs mb-3 italic">"{idea.reason}"</p>
                <p className="text-text-light text-xs">{idea.description}</p>
              </div>
            ))
          )}
        </div>
      </div>
    );
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
          <section>
            <h2 className="text-xs text-text-grey uppercase tracking-widest mb-4">Reset</h2>
            <button onClick={() => { if(confirm("This will erase your progress. Continue?")) handleReset(); }} className="px-6 py-2 border border-danger-red text-danger-red hover:bg-danger-red hover:text-white transition-all text-xs uppercase tracking-widest">Wipe Data</button>
          </section>
        </div>
      </div>
    );
  }

  if (localState.rejected) {
    return <RejectionScreen message={localState.rejectionMessage} onReset={handleReset} />;
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
      <nav className="absolute top-4 left-4 flex gap-4 z-10">
        <button onClick={() => setLocalState(p => p ? { ...p, screen: "history" } : p)} className="text-[10px] text-text-grey hover:text-white tracking-widest uppercase border border-jailbar-grey px-2 py-1">History</button>
        <button onClick={() => setLocalState(p => p ? { ...p, screen: "settings" } : p)} className="text-[10px] text-text-grey hover:text-white tracking-widest uppercase border border-jailbar-grey px-2 py-1">Settings</button>
      </nav>
      <PrisonCell
        userProfile={localState.userProfile!}
        currentIdea={localState.currentIdea}
        onGenerateIdea={handleGenerateIdea}
        onExecute={handleExecute}
        onMurder={handleMurder}
        onTalkToWarden={() => setLocalState(p => p ? { ...p, screen: "warden" } : p)}
      />
    </div>
  );
}
