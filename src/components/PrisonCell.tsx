"use client";

import { useState } from "react";
import { BusinessIdea, UserProfile } from "@/lib/types";
import { generateIdea } from "@/lib/ideas";

interface PrisonCellProps {
  userProfile: UserProfile;
  currentIdea: BusinessIdea | null;
  onGenerateIdea: (idea: BusinessIdea) => void;
  onExecute: (plan: string) => void;
  onMurder: (reason: string) => void;
  onTalkToWarden: () => void;
}

type CellAction = null | "execute" | "murder";

export default function PrisonCell({
  userProfile,
  currentIdea,
  onGenerateIdea,
  onExecute,
  onMurder,
  onTalkToWarden,
}: PrisonCellProps) {
  const [activeAction, setActiveAction] = useState<CellAction>(null);
  const [inputText, setInputText] = useState("");
  const [error, setError] = useState("");

  function handleGenerate() {
    const idea = generateIdea(userProfile);
    onGenerateIdea(idea);
    setActiveAction(null);
    setInputText("");
    setError("");
  }

  function handleSubmitAction() {
    setError("");

    if (activeAction === "execute") {
      // Must be at least 3 sentences (rough check: at least 2 periods/exclamation/question marks)
      const sentences = inputText
        .split(/[.!?]+/)
        .filter((s) => s.trim().length > 5);
      if (sentences.length < 3) {
        setError(
          "That is not a plan. Write at least 3 real sentences. What will you do? When? How?"
        );
        return;
      }
      onExecute(inputText.trim());
    } else if (activeAction === "murder") {
      if (inputText.trim().length < 10) {
        setError(
          "If you cannot even articulate why this idea should die, you are not thinking hard enough."
        );
        return;
      }
      onMurder(inputText.trim());
    }

    setActiveAction(null);
    setInputText("");
  }

  // STATE A: Empty Cell
  if (!currentIdea) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <div className="text-center animate-fade-in">
          {/* Title */}
          <h1 className="text-4xl font-bold tracking-widest text-text-white mb-2">
            ZERO
          </h1>
          <div className="w-16 h-px bg-jailbar-grey mx-auto mb-12" />

          {/* Empty cell visual */}
          <div className="border border-jailbar-grey p-16 mb-8 relative">
            <div className="absolute top-0 left-0 right-0 h-px bg-jailbar-grey" />
            <p className="text-text-grey text-sm tracking-wider uppercase mb-8">
              THE CELL IS EMPTY
            </p>
            <p className="text-accent-dim text-xs mb-8">
              One idea. No escape. No alternatives.
            </p>
            <button
              onClick={handleGenerate}
              className="px-8 py-4 border-2 border-jailbar-grey text-text-white uppercase tracking-widest text-sm font-bold hover:border-text-white hover:bg-jailbar-grey/20 transition-all animate-flicker"
            >
              ENTER THE CELL
            </button>
          </div>

          <p className="text-accent-dim text-xs">
            YOU WILL BE LOCKED IN UNTIL YOU ACT.
          </p>
        </div>
      </div>
    );
  }

  // STATE B: Jailed
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-2xl animate-fade-in">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold tracking-widest text-text-white mb-1">
            ZERO
          </h1>
          <p className="text-danger-red text-xs uppercase tracking-widest animate-pulse-red">
            LOCKED IN
          </p>
        </div>

        {/* The Cell - Idea Card */}
        <div className="border-2 border-jailbar-grey p-8 mb-6 animate-lock-in relative">
          {/* Jail bars visual accent */}
          <div className="absolute top-0 left-0 right-0 flex justify-between px-4">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="w-px h-3 bg-jailbar-grey" />
            ))}
          </div>

          <div className="mt-2">
            <span className="text-danger-red text-xs uppercase tracking-widest">
              YOUR SENTENCE
            </span>
            <h2 className="text-xl font-bold text-text-white mt-3 mb-4">
              {currentIdea.title}
            </h2>
            <p className="text-text-light text-sm leading-relaxed mb-4">
              {currentIdea.description}
            </p>
            <div className="border-t border-jailbar-grey pt-4">
              <span className="text-text-grey text-xs uppercase tracking-wider">
                First Step
              </span>
              <p className="text-text-light text-sm mt-2 leading-relaxed">
                {currentIdea.firstStep}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        {activeAction === null && (
          <div className="space-y-3 animate-fade-in">
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setActiveAction("execute")}
                className="p-4 border border-execute-green bg-execute-green/10 text-execute-green uppercase tracking-widest text-xs font-bold hover:bg-execute-green/20 transition-all"
              >
                EXECUTE
              </button>
              <button
                onClick={() => setActiveAction("murder")}
                className="p-4 border border-danger-red bg-danger-red/10 text-danger-red uppercase tracking-widest text-xs font-bold hover:bg-danger-red/20 transition-all animate-pulse-red"
              >
                MURDER
              </button>
            </div>
            <button
              onClick={onTalkToWarden}
              className="w-full p-3 border border-jailbar-grey text-text-grey uppercase tracking-widest text-xs hover:border-text-grey hover:text-text-light transition-all"
            >
              TALK TO THE WARDEN
            </button>
          </div>
        )}

        {/* Execute Form */}
        {activeAction === "execute" && (
          <div className="border border-execute-green p-6 animate-fade-in">
            <h3 className="text-execute-green text-xs uppercase tracking-widest mb-4">
              EXECUTION PLAN
            </h3>
            <p className="text-text-grey text-xs mb-4">
              Write your 3-sentence action plan. What will you do? When will you
              do it? How will you measure success?
            </p>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Sentence 1: What I will do today. Sentence 2: How I will do it. Sentence 3: How I will know it worked."
              className="w-full h-32 bg-void-black border border-jailbar-grey text-text-white p-4 rounded-none resize-none focus:outline-none focus:border-execute-green transition-colors placeholder:text-accent-dim text-sm"
            />
            {error && (
              <p className="text-danger-red text-xs mt-2 animate-fade-in">
                {error}
              </p>
            )}
            <div className="flex gap-3 mt-4">
              <button
                onClick={handleSubmitAction}
                className="flex-1 p-3 border border-execute-green bg-execute-green/10 text-execute-green uppercase tracking-widest text-xs font-bold hover:bg-execute-green/20 transition-all"
              >
                SUBMIT PLAN
              </button>
              <button
                onClick={() => {
                  setActiveAction(null);
                  setInputText("");
                  setError("");
                }}
                className="p-3 border border-jailbar-grey text-text-grey uppercase tracking-widest text-xs hover:text-text-light transition-all"
              >
                BACK
              </button>
            </div>
          </div>
        )}

        {/* Murder Form */}
        {activeAction === "murder" && (
          <div className="border border-danger-red p-6 animate-fade-in">
            <h3 className="text-danger-red text-xs uppercase tracking-widest mb-4">
              REASON FOR DEATH
            </h3>
            <p className="text-text-grey text-xs mb-4">
              Why does this idea deserve to die? Be specific. Lazy kills do not
              count.
            </p>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="This idea must die because..."
              className="w-full h-24 bg-void-black border border-jailbar-grey text-text-white p-4 rounded-none resize-none focus:outline-none focus:border-danger-red transition-colors placeholder:text-accent-dim text-sm"
            />
            {error && (
              <p className="text-danger-red text-xs mt-2 animate-fade-in">
                {error}
              </p>
            )}
            <div className="flex gap-3 mt-4">
              <button
                onClick={handleSubmitAction}
                className="flex-1 p-3 border border-danger-red bg-danger-red/10 text-danger-red uppercase tracking-widest text-xs font-bold hover:bg-danger-red/20 transition-all"
              >
                CONFIRM KILL
              </button>
              <button
                onClick={() => {
                  setActiveAction(null);
                  setInputText("");
                  setError("");
                }}
                className="p-3 border border-jailbar-grey text-text-grey uppercase tracking-widest text-xs hover:text-text-light transition-all"
              >
                BACK
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <p className="text-center text-accent-dim text-xs mt-8">
          NO NEW IDEAS UNTIL YOU DEAL WITH THIS ONE.
        </p>
      </div>
    </div>
  );
}
