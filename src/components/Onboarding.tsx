"use client";

import { useState } from "react";
import { UserProfile } from "@/lib/types";

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
  onReject: (message: string) => void;
}

interface SelectOption {
  value: string;
  label: string;
  risk: number;
  reject?: boolean;
}

interface QuestionBase {
  id: string;
  question: string;
  subtext: string;
}

interface SelectQuestion extends QuestionBase {
  type: "select";
  options: SelectOption[];
}

interface TextQuestion extends QuestionBase {
  type: "text";
  placeholder: string;
  minLength: number;
}

type Question = SelectQuestion | TextQuestion;

const QUESTIONS: Question[] = [
  {
    id: "age_bracket",
    question: "AGE BRACKET",
    subtext: "Time is your only non-renewable resource.",
    type: "select",
    options: [
      { value: "18-24", label: "18-24", risk: 0 },
      { value: "25-34", label: "25-34", risk: 0 },
      { value: "35-44", label: "35-44", risk: 0 },
      { value: "45-54", label: "45-54", risk: 1 },
      { value: "55+", label: "55+", risk: 2 },
    ],
  },
  {
    id: "location_type",
    question: "WHERE DO YOU OPERATE?",
    subtext: "Geography determines opportunity cost.",
    type: "select",
    options: [
      { value: "major_city", label: "Major City (1M+ population)", risk: 0 },
      { value: "mid_city", label: "Mid-Size City (100K-1M)", risk: 0 },
      { value: "small_town", label: "Small Town (<100K)", risk: 1 },
      { value: "rural", label: "Rural / Remote", risk: 1 },
      { value: "international", label: "Outside US/EU", risk: 1 },
    ],
  },
  {
    id: "employment_status",
    question: "CURRENT STATUS",
    subtext: "Are you running toward something or away from something?",
    type: "select",
    options: [
      { value: "employed_ft", label: "Employed Full-Time", risk: 0 },
      { value: "employed_pt", label: "Employed Part-Time", risk: 0 },
      {
        value: "unemployed_recent",
        label: "Recently Unemployed (<3 months)",
        risk: 1,
      },
      {
        value: "unemployed_long",
        label: "Unemployed (3+ months)",
        risk: 2,
      },
      { value: "student", label: "Student", risk: 0 },
      {
        value: "already_founder",
        label: "Already Running a Business",
        risk: 0,
      },
    ],
  },
  {
    id: "capital_available",
    question: "CAPITAL YOU CAN BURN",
    subtext:
      "Money you can lose without crying. Not savings. Not rent.",
    type: "select",
    options: [
      { value: "0", label: "$0 - I have nothing", risk: 2 },
      { value: "100", label: "$100 - Coffee money", risk: 1 },
      { value: "500", label: "$500 - One bad weekend", risk: 0 },
      { value: "1000", label: "$1,000 - Serious starter", risk: 0 },
      { value: "5000", label: "$5,000+ - Ready to play", risk: 0 },
    ],
  },
  {
    id: "monthly_runway",
    question: "MONTHS OF RUNWAY",
    subtext:
      "If all income stopped today, how long before you’re homeless?",
    type: "select",
    options: [
      { value: "0", label: "0 - Already drowning", risk: 3, reject: true },
      { value: "1-2", label: "1-2 months", risk: 2 },
      { value: "3-6", label: "3-6 months", risk: 1 },
      { value: "6-12", label: "6-12 months", risk: 0 },
      { value: "12+", label: "12+ months", risk: 0 },
    ],
  },
  {
    id: "weekly_hours",
    question: "HOURS PER WEEK",
    subtext:
      'Real hours. Not "I\'ll find time." Actual blocks you control.',
    type: "select",
    options: [
      { value: "<5", label: "Less than 5 hours", risk: 2 },
      { value: "5-10", label: "5-10 hours", risk: 1 },
      { value: "10-20", label: "10-20 hours", risk: 0 },
      { value: "20-40", label: "20-40 hours", risk: 0 },
      { value: "40+", label: "40+ hours (Full send)", risk: 0 },
    ],
  },
  {
    id: "skill_type",
    question: "PRIMARY SKILL",
    subtext: "What can you sell tomorrow without learning anything new?",
    type: "select",
    options: [
      {
        value: "technical",
        label: "Technical (Code, Design, Engineering)",
        risk: 0,
      },
      { value: "sales", label: "Sales / Persuasion", risk: 0 },
      { value: "operations", label: "Operations / Logistics", risk: 0 },
      {
        value: "creative",
        label: "Creative (Writing, Video, Art)",
        risk: 0,
      },
      {
        value: "trade",
        label: "Trade Skill (Plumbing, Electric, etc.)",
        risk: 0,
      },
      { value: "none", label: "Nothing marketable yet", risk: 2 },
    ],
  },
  {
    id: "past_attempts",
    question: "PREVIOUS ATTEMPTS",
    subtext: "How many businesses have you started (and killed)?",
    type: "select",
    options: [
      { value: "0", label: "0 - Complete virgin", risk: 1 },
      { value: "1", label: "1 - One scar", risk: 0 },
      { value: "2-3", label: "2-3 - Battle-tested", risk: 0 },
      {
        value: "4+",
        label: "4+ - Serial starter (or serial quitter?)",
        risk: 1,
      },
    ],
  },
  {
    id: "biggest_failure",
    question: "DESCRIBE YOUR BIGGEST FAILURE",
    subtext:
      "In one sentence. If you say \"I haven't failed\" you're lying or boring.",
    type: "text",
    placeholder: "I lost $X doing Y because Z...",
    minLength: 20,
  },
  {
    id: "why_now",
    question: "WHY NOW?",
    subtext: "What changed? Why not last year? Why not next year?",
    type: "text",
    placeholder: "The real reason, not the motivational poster version...",
    minLength: 15,
  },
  {
    id: "commitment",
    question: "FINAL QUESTION",
    subtext:
      'If I give you ONE idea, will you execute it this week—or will you "research" it for 3 months?',
    type: "select",
    options: [
      { value: "execute", label: "Execute. No excuses.", risk: 0 },
      {
        value: "probably",
        label: "Probably... if it feels right",
        risk: 2,
      },
      {
        value: "research",
        label: "I need to validate first",
        risk: 3,
        reject: true,
      },
    ],
  },
];

type AnswerMap = Record<string, SelectOption | string>;

function getRejectReason(questionId: string): string {
  const reasons: Record<string, string> = {
    monthly_runway:
      "You have 0 months of runway. You don't need a business idea—you need a job. Come back when you're not one paycheck from disaster.",
    commitment:
      'You want to "validate" and "research." Translation: you want permission to procrastinate. This app is for executors, not researchers. Goodbye.',
  };
  return reasons[questionId] || "You are not ready. Come back when you are.";
}

function buildProfile(answers: AnswerMap): UserProfile {
  const val = (id: string): string => {
    const a = answers[id];
    if (typeof a === "string") return a;
    return a?.value ?? "";
  };
  return {
    ageBracket: val("age_bracket"),
    locationType: val("location_type"),
    employmentStatus: val("employment_status"),
    capitalAvailable: val("capital_available"),
    monthlyRunway: val("monthly_runway"),
    weeklyHours: val("weekly_hours"),
    skillType: val("skill_type"),
    pastAttempts: val("past_attempts"),
    biggestFailure: val("biggest_failure"),
    whyNow: val("why_now"),
    commitment: val("commitment"),
  };
}

export default function Onboarding({ onComplete, onReject }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [textInput, setTextInput] = useState("");
  const [admitted, setAdmitted] = useState(false);
  const [isJudging, setIsJudging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function evaluateAnswers(finalAnswers: AnswerMap) {
    let totalRisk = 0;

    Object.values(finalAnswers).forEach((answer) => {
      if (typeof answer === "object" && answer.risk) {
        totalRisk += answer.risk;
      }
    });

    const capital =
      typeof finalAnswers.capital_available === "object"
        ? finalAnswers.capital_available.value
        : "";
    const hours =
      typeof finalAnswers.weekly_hours === "object"
        ? finalAnswers.weekly_hours.value
        : "";
    const skill =
      typeof finalAnswers.skill_type === "object"
        ? finalAnswers.skill_type.value
        : "";

    if (capital === "0" && hours === "<5") {
      onReject(
        "$0 capital AND less than 5 hours per week? You're not starting a business—you're daydreaming. Come back with either money or time."
      );
      return;
    }

    if (skill === "none" && capital === "0") {
      onReject(
        "No money and no marketable skill. Start by learning something valuable. Try: copywriting, basic web dev, or sales. Return in 90 days."
      );
      return;
    }

    if (totalRisk > 8) {
      onReject(
        "Your risk profile is too high. Too many red flags in your answers. Stabilize your situation first, then come back."
      );
      return;
    }

    setAdmitted(true);
  }

  function handleSelect(option: SelectOption) {
    const question = QUESTIONS[currentStep];

    if (option.reject) {
      onReject(getRejectReason(question.id));
      return;
    }

    const updated = { ...answers, [question.id]: option };
    setAnswers(updated);

    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      evaluateAnswers(updated);
    }
  }

  async function handleTextSubmit() {
    const question = QUESTIONS[currentStep] as TextQuestion;
    if (textInput.length < question.minLength) return;

    if (question.id === "biggest_failure" || question.id === "why_now") {
      setIsJudging(true);
      setError(null);
      try {
        const response = await fetch('/api/judge', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ answer: textInput }),
        });
        const data = await response.json();
        
        if (data.verdict === 'REJECT') {
          setError("That is not a real answer. Try again.");
          setIsJudging(false);
          return;
        }
      } catch (err) {
        console.error("Judging failed:", err);
      } finally {
        setIsJudging(false);
      }
    }

    const updated = { ...answers, [question.id]: textInput };
    setAnswers(updated);
    setTextInput("");

    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      evaluateAnswers(updated);
    }
  }

  // ADMITTED screen
  if (admitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-lg w-full border-2 border-jailbar-grey p-8 animate-fade-in">
          <div className="text-execute-green text-xs mb-4 tracking-widest">
            // ACCESS GRANTED
          </div>
          <h1 className="text-2xl text-execute-green font-bold mb-6 tracking-wider">
            ADMITTED
          </h1>
          <p className="text-text-light leading-relaxed mb-4">
            You passed. Barely.
          </p>
          <p className="text-text-grey text-sm mb-8">
            Remember: You asked for this. No complaining. No pivoting every
            week. One idea. Execute or murder. Those are your only options.
          </p>
          <div className="border-t border-jailbar-grey pt-6">
            <button
              onClick={() => onComplete(buildProfile(answers))}
              className="w-full p-4 border border-jailbar-grey bg-cell-black text-text-white uppercase tracking-widest text-sm font-bold hover:border-text-grey hover:bg-jailbar-grey/20 transition-all"
            >
              ENTER THE CELL &rarr;
            </button>
          </div>
        </div>
      </div>
    );
  }

  const question = QUESTIONS[currentStep];

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-2xl mx-auto pt-8">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-xs text-text-grey mb-2">
            <span>
              SCREENING{" "}
              {String(currentStep + 1).padStart(2, "0")}/
              {String(QUESTIONS.length).padStart(2, "0")}
            </span>
            <span>
              {Math.round(((currentStep + 1) / QUESTIONS.length) * 100)}%
              COMPLETE
            </span>
          </div>
          <div className="h-1 bg-cell-black rounded">
            <div
              className="h-full bg-jailbar-grey rounded transition-all duration-300"
              style={{
                width: `${((currentStep + 1) / QUESTIONS.length) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="border border-jailbar-grey p-6 mb-6 animate-fade-in" key={currentStep}>
          <div className="text-text-grey text-xs mb-4 tracking-widest">
            // INTERROGATION
          </div>
          <h2 className="text-xl font-bold text-text-white mb-2">
            {question.question}
          </h2>
          <p className="text-text-grey text-sm mb-8">{question.subtext}</p>

          {question.type === "select" && (
            <div className="space-y-3">
              {question.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelect(option)}
                  className="w-full text-left p-4 border border-jailbar-grey hover:border-text-grey hover:bg-cell-black transition-all group"
                >
                  <span className="text-text-grey mr-3">
                    [{String.fromCharCode(65 + idx)}]
                  </span>
                  <span className="text-text-light group-hover:text-text-white">
                    {option.label}
                  </span>
                </button>
              ))}
            </div>
          )}

          {question.type === "text" && (
            <div>
              <textarea
                value={textInput}
                onChange={(e) => {
                  setTextInput(e.target.value);
                  setError(null);
                }}
                placeholder={question.placeholder}
                disabled={isJudging}
                className="w-full bg-void-black border border-jailbar-grey p-4 text-text-light focus:border-text-grey focus:outline-none resize-none h-32 placeholder:text-accent-dim disabled:opacity-50"
              />
              <div className="flex justify-between items-center mt-4">
                <div className="flex flex-col">
                  <span className="text-xs text-text-grey">
                    {textInput.length < question.minLength
                      ? `Min ${question.minLength} characters required`
                      : "Ready"}
                  </span>
                  {error && <span className="text-xs text-danger-red mt-1">{error}</span>}
                </div>
                <button
                  onClick={handleTextSubmit}
                  disabled={textInput.length < question.minLength || isJudging}
                  className="px-6 py-2 border border-jailbar-grey text-text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-cell-black transition-all uppercase tracking-wider text-sm min-w-[120px]"
                >
                  {isJudging ? "JUDGING..." : "SUBMIT \u2192"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center text-accent-dim text-xs tracking-wide">
          ZERO does not store your data. We don&apos;t care about your data.
          <br />
          We care about whether you execute.
        </div>
      </div>
    </div>
  );
}
