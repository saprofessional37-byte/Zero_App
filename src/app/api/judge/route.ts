import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { answer } = await req.json();

    const systemPrompt = `You are an application reviewer. The user was asked to describe their biggest failure or why they want to start a business now.
Analyze the text for quality and authenticity.

REJECT ONLY if:
- It is obvious gibberish or random character spam (e.g., 'asdfasdf', 'qwerty', 'zzzzzzz').
- It is a completely nonsensical string of random words that clearly has no meaning.

PASS if:
- It is a coherent sentence or phrase, even if short.
- It sounds like a real person answering the question.

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
