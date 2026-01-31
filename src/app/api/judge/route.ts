import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { answer, capitalAvailable, ideaTitle, ideaDescription } = await req.json();

    const systemPrompt = `You are a ruthless business logic judge. The user has a specific amount of capital and a business idea. 
Evaluate if the idea is viable given the capital.

CONTEXT:
User Capital: ${capitalAvailable}
Idea: ${ideaTitle} - ${ideaDescription}

RULES:
- REJECT if the capital is wildly insufficient for the idea (e.g., $100 for a hardware factory).
- REJECT if the answer provided is gibberish or low effort.
- PASS only if the idea is realistically executable with the provided capital or is a valid first step.

Output ONLY 'PASS' or 'REJECT' and a very short (1 sentence) explanation separated by a pipe character.
Example: REJECT | $100 isn't enough to build a rocket ship.`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: answer || "Evaluate my situation." },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.1,
      max_tokens: 50,
    });

    const result = chatCompletion.choices[0]?.message?.content?.trim() || "REJECT | Brain glitch.";
    const [verdict, reason] = result.split('|').map(s => s.trim());

    return NextResponse.json({ verdict: verdict === 'PASS' ? 'PASS' : 'REJECT', reason });
  } catch (error: any) {
    console.error("JUDGE ERROR:", error);
    return NextResponse.json({ verdict: "PASS" }); 
  }
}
