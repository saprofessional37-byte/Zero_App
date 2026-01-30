import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { answer } = await req.json();

    const systemPrompt = `You are a strict application reviewer. The user was asked to describe their biggest failure or why they want to start a business now.
Analyze the text for quality and authenticity.
REJECT if:
- It is gibberish or random letters (e.g., 'asdf', 'qwerty').
- It is a collection of random, unrelated words that don't form a coherent thought (e.g., 'apple sky run blue').
- It is a low-effort, lazy answer (e.g., 'I dont know', 'nothing', 'test').
- It is clearly a bypass attempt using filler words.

PASS only if:
- It is a coherent sentence or phrase that makes sense in the context of a business failure or motivation.
- It shows at least a minimum level of thought.

Output ONLY the word 'PASS' or 'REJECT'.`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: answer },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.1,
      max_tokens: 10,
    });

    const verdict = chatCompletion.choices[0]?.message?.content?.trim() || "REJECT";

    return NextResponse.json({ verdict });
  } catch (error: any) {
    console.error("JUDGE ERROR:", error);
    return NextResponse.json({ verdict: "PASS" }); // Fallback to pass on error
  }
}
