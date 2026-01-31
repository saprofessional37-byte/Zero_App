"use client";

import { useState, useRef, useEffect } from "react";
import { BusinessIdea, ChatMessage, UserProfile } from "@/lib/types";
import { MIKE_INTRO } from "@/lib/mike";

interface WardenChatProps {
  idea: BusinessIdea;
  messages: ChatMessage[];
  userProfile: UserProfile;
  onSendMessage: (messages: ChatMessage[]) => void;
  onBack: () => void;
}

export default function WardenChat({
  idea,
  messages,
  userProfile,
  onSendMessage,
  onBack,
}: WardenChatProps) {
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize with Mike's intro if no messages
  useEffect(() => {
    if (messages.length === 0) {
      const introMessage: ChatMessage = {
        id: "mike-intro",
        role: "mike",
        content: MIKE_INTRO,
      };
      onSendMessage([introMessage]);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  async function handleSend() {
    if (!input.trim() || isTyping) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: input.trim(),
    };

    const updatedMessages = [...messages, userMessage];
    onSendMessage(updatedMessages);
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch('/api/warden', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: updatedMessages,
          userProfile,
          currentIdea: idea,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch Mike\'s response');
      }

      const data = await response.json();
      const mikeMessage: ChatMessage = {
        id: `mike-${Date.now()}`,
        role: "mike",
        content: data.content,
      };
      onSendMessage([...updatedMessages, mikeMessage]);
    } catch (error) {
      console.error("Chat Error:", error);
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        role: "mike",
        content: "My brain just glitched. Probably your fault. Try again.",
      };
      onSendMessage([...updatedMessages, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="border-b border-jailbar-grey p-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="text-text-grey hover:text-text-light transition-colors text-sm"
          >
            &lt; BACK
          </button>
          <div className="w-px h-6 bg-jailbar-grey" />
          <div>
            <h2 className="text-text-white text-sm font-bold tracking-wider">
              THE WARDEN
            </h2>
            <p className="text-text-grey text-xs">
              Mike &middot; Lost $2M &middot; Not your friend
            </p>
          </div>
        </div>
        <div className="text-danger-red text-xs uppercase tracking-wider hidden sm:block">
          RE: {idea.title}
        </div>
      </div>

      {/* Current Idea Context Bar */}
      <div className="border-b border-jailbar-grey px-4 py-2 bg-cell-black shrink-0">
        <p className="text-text-grey text-xs">
          <span className="text-danger-red">LOCKED:</span> {idea.title} &mdash;{" "}
          <span className="text-accent-dim">
            All discussion must be about this idea.
          </span>
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`animate-typewriter ${
              msg.role === "mike" ? "pr-8" : "pl-8"
            }`}
          >
            <div
              className={`${
                msg.role === "mike"
                  ? "border-l-2 border-danger-red pl-4"
                  : "border-l-2 border-jailbar-grey pl-4 ml-auto max-w-[85%]"
              }`}
            >
              <span
                className={`text-xs uppercase tracking-wider block mb-1 ${
                  msg.role === "mike" ? "text-danger-red" : "text-text-grey"
                }`}
              >
                {msg.role === "mike" ? "MIKE" : "YOU"}
              </span>
              <p className="text-text-light text-sm leading-relaxed">
                {msg.content}
              </p>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="animate-typewriter pr-8">
            <div className="border-l-2 border-danger-red pl-4">
              <span className="text-xs uppercase tracking-wider text-danger-red block mb-1">
                MIKE
              </span>
              <p className="text-text-grey text-sm animate-flicker">
                ...
              </p>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-jailbar-grey p-4 shrink-0">
        <div className="flex gap-3">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Mike about this idea..."
            disabled={isTyping}
            className="flex-1 bg-cell-black border border-jailbar-grey text-text-white px-4 py-3 rounded-none focus:outline-none focus:border-danger-red transition-colors placeholder:text-accent-dim text-sm disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={isTyping || !input.trim()}
            className="px-6 py-3 border border-jailbar-grey text-text-grey uppercase tracking-widest text-xs hover:border-text-grey hover:text-text-light transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            SEND
          </button>
        </div>
        <p className="text-accent-dim text-xs mt-2">
          Mike only discusses the current idea. Nothing else.
        </p>
      </div>
    </div>
  );
}
