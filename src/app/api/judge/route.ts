import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { answer } = await req.json();

    const systemPrompt = `You are a strict application reviewer. The user was asked to describe their biggest failure. Analyze the text.
If the text is gibberish, random keys, or clearly low-effort lazy typing (e.g. 'asdf' or 'I dont know'), return 'REJECT'.
If it is a coherent sentence, return 'PASS'.
Output ONLY the word 'PASS' or 'REJECT'.`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: answer },
      ],
      model: "llama3-70b-8192",
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
