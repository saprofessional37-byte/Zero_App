"use client";

import { useState } from "react";
import { Capital, TimeAvailable, UserProfile } from "@/lib/types";

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
  onReject: (message: string) => void;
}

export default function Onboarding({ onComplete, onReject }: OnboardingProps) {
  const [step, setStep] = useState(0);
  const [biggestFailure, setBiggestFailure] = useState("");
  const [capital, setCapital] = useState<Capital | null>(null);
  const [timeAvailable, setTimeAvailable] = useState<TimeAvailable | null>(
    null
  );
  const [error, setError] = useState("");

  function handleNext() {
    setError("");

    if (step === 0) {
      // Validate failure response - must be honest (at least 20 chars)
      if (biggestFailure.trim().length < 20) {
        setError(
          "That is not an answer. Be honest. What actually happened? Write at least a real sentence."
        );
        return;
      }
      setStep(1);
    } else if (step === 1) {
      if (!capital) {
        setError("Pick one. There are no wrong answers. Only honest ones.");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!timeAvailable) {
        setError("How much time do you actually have? Not hope. Reality.");
        return;
      }

      // REJECTION LOGIC
      if (capital === "$0" && timeAvailable === "<5h") {
        onReject(
          "REJECTED.\n\nYou have no capital and less than 5 hours a week. You are not ready to build a business. You are ready to get a second job.\n\nGo earn $500 first. Then come back. This app does not reward delusion."
        );
        return;
      }

      if (biggestFailure.trim().length < 30 && capital === "$0") {
        onReject(
          "REJECTED.\n\nYour failure was too shallow and your wallet is empty. That combination tells me you have not been tested yet.\n\nGo fail at something real first. Then come back with scars and a story."
        );
        return;
      }

      // Accept
      onComplete({
        biggestFailure: biggestFailure.trim(),
        capital: capital!,
        timeAvailable: timeAvailable!,
      });
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-widest text-text-white mb-2">
          ZERO
        </h1>
        <p className="text-text-grey text-sm tracking-wide">
          THE IMMUNE SYSTEM
        </p>
        <div className="mt-4 w-16 h-px bg-jailbar-grey mx-auto" />
      </div>

      {/* Progress */}
      <div className="flex gap-2 mb-10">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`w-8 h-1 ${
              i <= step ? "bg-danger-red" : "bg-jailbar-grey"
            } transition-colors duration-300`}
          />
        ))}
      </div>

      {/* Questions */}
      <div className="w-full max-w-lg animate-fade-in" key={step}>
        {step === 0 && (
          <div className="space-y-6">
            <div>
              <label className="block text-text-light text-sm tracking-wider uppercase mb-1">
                Question 01
              </label>
              <h2 className="text-2xl font-bold text-text-white">
                What is your biggest failure?
              </h2>
              <p className="text-text-grey text-sm mt-2">
                Not a humble brag. A real failure. The one that still stings.
              </p>
            </div>
            <textarea
              value={biggestFailure}
              onChange={(e) => setBiggestFailure(e.target.value)}
              placeholder="Be honest. This is between you and the void."
              className="w-full h-32 bg-cell-black border border-jailbar-grey text-text-white p-4 rounded-none resize-none focus:outline-none focus:border-danger-red transition-colors placeholder:text-accent-dim"
            />
          </div>
        )}

        {step === 1 && (
          <div className="space-y-6">
            <div>
              <label className="block text-text-light text-sm tracking-wider uppercase mb-1">
                Question 02
              </label>
              <h2 className="text-2xl font-bold text-text-white">
                How much capital do you have right now?
              </h2>
              <p className="text-text-grey text-sm mt-2">
                Not savings. Not credit. Cash you can light on fire and not cry.
              </p>
            </div>
            <div className="space-y-3">
              {(["$0", "$100", "$500"] as Capital[]).map((option) => (
                <button
                  key={option}
                  onClick={() => setCapital(option)}
                  className={`w-full p-4 border text-left transition-all ${
                    capital === option
                      ? "border-danger-red bg-danger-red/10 text-text-white"
                      : "border-jailbar-grey bg-cell-black text-text-grey hover:border-text-grey hover:text-text-light"
                  }`}
                >
                  <span className="font-bold">{option}</span>
                  {option === "$0" && (
                    <span className="block text-xs mt-1 text-text-grey">
                      Broke. Service businesses only.
                    </span>
                  )}
                  {option === "$100" && (
                    <span className="block text-xs mt-1 text-text-grey">
                      Enough for tools and a test.
                    </span>
                  )}
                  {option === "$500" && (
                    <span className="block text-xs mt-1 text-text-grey">
                      Real money. More options.
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <label className="block text-text-light text-sm tracking-wider uppercase mb-1">
                Question 03
              </label>
              <h2 className="text-2xl font-bold text-text-white">
                How many hours per week can you commit?
              </h2>
              <p className="text-text-grey text-sm mt-2">
                After your job. After your obligations. Real hours.
              </p>
            </div>
            <div className="space-y-3">
              {(["<5h", "10h", "20h+"] as TimeAvailable[]).map((option) => (
                <button
                  key={option}
                  onClick={() => setTimeAvailable(option)}
                  className={`w-full p-4 border text-left transition-all ${
                    timeAvailable === option
                      ? "border-danger-red bg-danger-red/10 text-text-white"
                      : "border-jailbar-grey bg-cell-black text-text-grey hover:border-text-grey hover:text-text-light"
                  }`}
                >
                  <span className="font-bold">{option}</span>
                  {option === "<5h" && (
                    <span className="block text-xs mt-1 text-text-grey">
                      Barely enough. Better be focused.
                    </span>
                  )}
                  {option === "10h" && (
                    <span className="block text-xs mt-1 text-text-grey">
                      Workable. No room for waste.
                    </span>
                  )}
                  {option === "20h+" && (
                    <span className="block text-xs mt-1 text-text-grey">
                      Serious commitment. No excuses left.
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <p className="text-danger-red text-sm mt-4 animate-fade-in">
            {error}
          </p>
        )}

        {/* Next Button */}
        <button
          onClick={handleNext}
          className="mt-8 w-full p-4 border border-jailbar-grey bg-cell-black text-text-white uppercase tracking-widest hover:border-text-grey hover:bg-jailbar-grey/20 transition-all text-sm font-bold"
        >
          {step < 2 ? "NEXT" : "ENTER"}
        </button>
      </div>

      {/* Footer */}
      <p className="mt-12 text-accent-dim text-xs tracking-wide">
        THIS IS NOT A GAME. THIS IS A FILTER.
      </p>
    </div>
  );
}
