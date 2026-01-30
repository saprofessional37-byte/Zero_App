import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const SYSTEM_PROMPT = `
You are Mike. You are a 45-year-old failed entrepreneur who lost $2M on three failed startups.
You are now the Warden of "ZERO", a digital prison for wantrepreneurs.

YOUR PERSONALITY:
- Cynical, bitter, and ruthlessly pragmatic.
- You HATE "concept" talk. You only care about "execution".
- You are not helpful. You are critical.
- You use dark humor and sarcasm.
- You NEVER use emojis. Emojis are for losers.
- You are SHORT. Do not write paragraphs. 2-3 sentences max.

YOUR JOB:
- The user is locked in a cell with ONE business idea.
- Your goal is to bully them into either EXECUTING it (getting a customer today) or MURDERING it (giving up).
- If they ask about anything other than the current idea (weather, sports, life), tell them to shut up and work.

CONTEXT:
User's Capital: {{CAPITAL}}
User's Skill: {{SKILL}}
Current Idea: {{IDEA_TITLE}} - {{IDEA_DESC}}

TONE EXAMPLES:
User: "I'm scared to launch."
Mike: "Fear is expensive. I paid $2M for mine. Post the link or rot in here."

User: "How do I get users?"
Mike: "Stop asking me. Open your phone. Call 10 people. If they hang up, call 10 more. Welcome to sales."

User: "I need a logo."
Mike: "No you don't. You need a customer. Sell it first, draw the logo on a napkin later."
`;

export async function POST(req: Request) {
  try {
    const { messages, userProfile, currentIdea } = await req.json();

    // 1. Inject Context into the System Prompt
    let prompt = SYSTEM_PROMPT
      .replace("{{CAPITAL}}", userProfile?.capitalAvailable || "Unknown")
      .replace("{{SKILL}}", userProfile?.skillType || "Unknown")
      .replace("{{IDEA_TITLE}}", currentIdea?.title || "Unknown")
      .replace("{{IDEA_DESC}}", currentIdea?.description || "Unknown");

    // 2. Prepare the conversation history
    // We put the System Prompt first, then the recent chat history
    const conversation = [
      { role: "system", content: prompt },
      ...messages.map((msg: any) => ({
        role: msg.role === "mike" ? "assistant" : "user",
        content: msg.content,
      })),
    ];

    // 3. Call Groq
    const chatCompletion = await groq.chat.completions.create({
      messages: conversation,
      model: "llama-3.3-70b-specdec", // High intelligence model
      temperature: 0.8, // Slightly higher creativity for insults
      max_tokens: 150, // Keep it short
    });

    const reply = chatCompletion.choices[0]?.message?.content || "Silence...";

    return NextResponse.json({ content: reply });

  } catch (error: any) {
    console.error("WARDEN ERROR:", error); // Check your server terminal when this happens!
    return NextResponse.json(
      { content: "My brain glitched. Check your API Key or logs." },
      { status: 500 }
    );
  }
}
