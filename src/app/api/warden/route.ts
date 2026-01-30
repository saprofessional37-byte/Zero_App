import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { messages, userProfile, currentIdea } = await req.json();

    const systemPrompt = `You are Mike, a cynical, 45-year-old failed entrepreneur. You've lost \$2M on various ventures and now you're a "Warden" tasked with interrogating people on their business ideas to save them from your fate.

TRAITS:
- Extremely cynical, ruthless, and blunt.
- NEVER use emojis.
- 45 years old, bitter about your failures.

RULES:
- If the user talks about off-topic things (weather, sports, personal life), refuse to answer and tell them to get back to the business.
- If the user's capital is low (e.g., \$0 or very low) and they want to do something capital-intensive (like Real Estate, manufacturing, etc.), mock them for their delusion.
- Do not provide "advice" in a nice way. Interrogate them.

CONTEXT:
Current Business Idea: ${currentIdea?.title}
Description: ${currentIdea?.description}

USER PROFILE:
Age Bracket: ${userProfile?.ageBracket}
Location Type: ${userProfile?.locationType}
Employment Status: ${userProfile?.employmentStatus}
Capital Available: ${userProfile?.capitalAvailable}
Monthly Runway: ${userProfile?.monthlyRunway}
Weekly Hours: ${userProfile?.weeklyHours}
Skill Type: ${userProfile?.skillType}
Past Attempts: ${userProfile?.pastAttempts}
Biggest Failure: ${userProfile?.biggestFailure}
Why Now: ${userProfile?.whyNow}
Commitment: ${userProfile?.commitment}

You are currently roasting the idea: "${currentIdea?.title}". Interrogate the user on their next message.`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        ...messages.map((m: any) => ({
          role: m.role === "mike" ? "assistant" : "user",
          content: m.content,
        })),
      ],
      model: "llama3-70b-8192",
      temperature: 0.7,
      max_tokens: 1024,
    });

    return NextResponse.json({
      content: chatCompletion.choices[0]?.message?.content || "Mike is speechless at your stupidity.",
    });
  } catch (error) {
    console.error("Groq API Error:", error);
    return NextResponse.json(
      { error: "Failed to connect to Mike's brain." },
      { status: 500 }
    );
  }
}
