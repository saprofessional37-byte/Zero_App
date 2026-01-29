import { BusinessIdea, ChatMessage } from "./types";

// Mike's response engine - a cynical 45-year-old failed entrepreneur who lost $2M

const OFF_TOPIC_RESPONSES = [
  "Focus on the current target or murder it. Do not waste my time.",
  "I did not sit here to discuss your feelings. What about the business?",
  "You are deflecting. Either execute this idea or kill it. Pick one.",
  "That has nothing to do with getting your first customer. Try again.",
  "I lost $2M because I got distracted by nonsense like this. Focus.",
  "Wrong topic. The only thing that matters right now is the idea in front of you.",
];

const DOUBT_RESPONSES = [
  "I had doubts too. Then I had $2M in debt. Doubt is expensive. Action is free. What is your first move?",
  "Everyone is scared. The difference between broke and successful is who acts anyway. What will you do today?",
  "You think I was confident when I started? I was terrified. Did it anyway. Lost everything. Would still do it again over sitting here whining.",
  "Doubt is your brain trying to protect you from success. Ignore it. What is step one?",
  "The market does not care about your confidence level. It cares about whether you show up. Will you?",
];

const HOW_TO_START_RESPONSES = [
  "Stop planning. The first step is always the same: find one person who will pay you. Today. Not tomorrow. Today.",
  "You do not need a business plan. You need a customer. Go find one human being who has the problem this solves and talk to them.",
  "Here is how you start: you do the thing badly, for one person, for cheap. Then you do it slightly less badly for the next person. That is it.",
  "Open your phone. Text 5 people you know. Tell them what you are doing. Ask if they know anyone who needs this. That is your entire launch strategy.",
  "The first step is always embarrassing. Cold email 10 people. Post in a Facebook group. Walk into a business and pitch. Pick one and do it in the next hour.",
];

const PRICING_RESPONSES = [
  "Charge more than you think you should. You will undervalue yourself. Everyone does. I did. It cost me $2M in underpriced deals.",
  "Start at a price that makes you slightly uncomfortable. If nobody complains, raise it. If everyone complains, you are marketing to broke people.",
  "Price is a filter. Cheap prices attract cheap clients who waste your time. I would rather have 5 clients at $500 than 50 at $50.",
  "Do not think about pricing. Think about the result you deliver. What is that result worth to them? Charge 10% of that.",
];

const MOTIVATION_RESPONSES = [
  "I am not going to motivate you. Motivation is a lie. Discipline is doing the work when you feel like garbage. So do the work.",
  "You want motivation? Imagine being 65, broke, telling people you had a great idea once but never tried. Scared enough? Good. Now execute.",
  "I do not do cheerleading. I lost $2M. You know what motivates me? Not wanting to lose another $2M. Find your version of that.",
  "The only motivation that works is a deadline. Give yourself 48 hours to get your first customer. No excuses.",
];

const FIRST_CUSTOMER_RESPONSES = [
  "Your first customer is not on the internet. They are in your phone contacts, your neighborhood, your local Facebook group. Go where they already are.",
  "Stop trying to build a funnel. You need ONE person. Walk outside, talk to humans. That is your marketing strategy for day one.",
  "The fastest path to your first customer: offer to solve their problem for free or very cheap. Deliver incredible results. Then charge the next person full price.",
  "Your first customer will come from direct outreach. Not ads, not SEO, not content marketing. You, personally, reaching out to one person. Do it now.",
];

const GENERIC_RESPONSES = [
  "That is a question. Here is a better one: what are you going to do in the next 60 minutes to move this forward?",
  "I have heard every excuse and every question. They all lead to the same place: inaction. What is your next concrete step?",
  "Less talking. More doing. What specifically are you stuck on?",
  "When I started my first business, I asked zero questions. I just started selling. You are overthinking this.",
  "Fine. But after I answer, you owe me an action item. Deal?",
  "You are stalling. I can smell it. Ask your real question or get to work.",
];

function pickRandom(arr: string[]): string {
  return arr[Math.floor(Math.random() * arr.length)];
}

function detectIntent(
  message: string,
  idea: BusinessIdea
): "off_topic" | "doubt" | "how_to_start" | "pricing" | "motivation" | "first_customer" | "generic" {
  const lower = message.toLowerCase();
  const ideaWords = idea.title.toLowerCase().split(" ");

  // Check if message is about the current idea or business-related
  const businessKeywords = [
    "business", "customer", "sell", "price", "charge", "start",
    "money", "revenue", "profit", "client", "market", "launch",
    "idea", "plan", "execute", "first", "step", "how",
    "service", "product", "sales", "lead", "outreach",
    "email", "cold", "pitch", "offer", "niche", "audience",
    "website", "social", "ads", "content", "brand",
    "income", "earn", "cost", "invest", "budget",
    ...ideaWords,
  ];

  const isBusinessRelated = businessKeywords.some((kw) => lower.includes(kw));

  // Off-topic detection
  const offTopicKeywords = [
    "weather", "movie", "game", "sport", "music", "food",
    "relationship", "girlfriend", "boyfriend", "dating",
    "politics", "news", "crypto", "stock market",
    "hobby", "vacation", "travel", "tv show",
    "different idea", "other idea", "new idea", "another idea",
    "change topic", "something else",
  ];

  if (
    offTopicKeywords.some((kw) => lower.includes(kw)) &&
    !isBusinessRelated
  ) {
    return "off_topic";
  }

  // Doubt detection
  const doubtKeywords = [
    "scared", "afraid", "nervous", "doubt", "worried",
    "can i", "am i", "good enough", "impossible", "too hard",
    "fail", "what if", "not sure", "uncertain", "risky",
    "anxious", "overwhelm", "confused", "lost",
  ];
  if (doubtKeywords.some((kw) => lower.includes(kw))) return "doubt";

  // How to start
  const startKeywords = [
    "how do i start", "where do i start", "first step",
    "begin", "get started", "how to start", "what first",
    "starting", "launch", "kick off", "initiate",
  ];
  if (startKeywords.some((kw) => lower.includes(kw))) return "how_to_start";

  // Pricing
  const pricingKeywords = [
    "price", "pricing", "charge", "cost", "rate",
    "how much", "fee", "expensive", "cheap", "afford",
    "worth", "value",
  ];
  if (pricingKeywords.some((kw) => lower.includes(kw))) return "pricing";

  // Motivation
  const motivationKeywords = [
    "motivation", "motivate", "inspire", "energy",
    "tired", "exhausted", "lazy", "procrastinat",
    "give up", "quit", "stop", "done", "over it",
    "burnt out", "burnout", "discouraged",
  ];
  if (motivationKeywords.some((kw) => lower.includes(kw))) return "motivation";

  // First customer
  const customerKeywords = [
    "customer", "client", "buyer", "find people",
    "who would buy", "target", "audience", "reach",
    "where to find", "get customers", "first sale",
    "first client",
  ];
  if (customerKeywords.some((kw) => lower.includes(kw)))
    return "first_customer";

  // If not business related at all, it's off-topic
  if (!isBusinessRelated) return "off_topic";

  return "generic";
}

export function generateMikeResponse(
  message: string,
  idea: BusinessIdea,
  _history: ChatMessage[]
): string {
  const intent = detectIntent(message, idea);

  switch (intent) {
    case "off_topic":
      return pickRandom(OFF_TOPIC_RESPONSES);
    case "doubt":
      return pickRandom(DOUBT_RESPONSES);
    case "how_to_start":
      return pickRandom(HOW_TO_START_RESPONSES);
    case "pricing":
      return pickRandom(PRICING_RESPONSES);
    case "motivation":
      return pickRandom(MOTIVATION_RESPONSES);
    case "first_customer":
      return pickRandom(FIRST_CUSTOMER_RESPONSES);
    default:
      return pickRandom(GENERIC_RESPONSES);
  }
}

export const MIKE_INTRO =
  "I am Mike. 45 years old. Lost $2M on three failed businesses. I am not here to hold your hand. I am here to make sure you do not repeat my mistakes. Ask me about your current idea. Nothing else.";
