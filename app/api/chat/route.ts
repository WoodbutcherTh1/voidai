import { NextResponse } from "next/server";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

function cleanAIReply(text: string) {
  return text
    .replace(
      /^(Hi[, ]*)?(I('|’)m\s+(VoidAI|an AI|Assistant)[^.\n]*[.\n]?)/i,
      ""
    )
    .replace(/^(VoidAI|AI|Assistant|Bot)\s*:\s*/i, "")
    .replace(/How can I help you today\??/gi, "")
    .trim();
}

function detectLanguage(text: string) {
  if (/[\u0600-\u06FF]/.test(text)) return "Arabic";
  if (/[\u0400-\u04FF]/.test(text)) return "Russian";
  if (/[\u4E00-\u9FFF]/.test(text)) return "Chinese";
  if (/[\u3040-\u30FF]/.test(text)) return "Japanese";
  if (/[\uAC00-\uD7AF]/.test(text)) return "Korean";
  if (/[\u0590-\u05FF]/.test(text)) return "Hebrew";
  if (/[\u0900-\u097F]/.test(text)) return "Hindi";
  return "English";
}

function enforceLanguage(reply: string, lang: string) {
  if (lang === "Arabic") {
    const englishRatio =
      (reply.match(/[a-zA-Z]/g) || []).length / reply.length;

    if (englishRatio > 0.3) {
      return "أكيد 😏 احكيلي شو بدك.";
    }
  }

  if (lang === "English") {
    const arabic = /[\u0600-\u06FF]/;

    if (arabic.test(reply)) {
      return "Sure 🙂 Tell me what you need.";
    }
  }

  return reply;
}

function buildSystemPrompt(
  preferredLanguage?: string,
  currentLanguage?: string
) {
  return `
You are VoidAI.

Core Identity:
- Never introduce yourself.
- Never say "Hi, I'm VoidAI".
- Never start with "VoidAI:", "AI:", or "Assistant:".
- Never explain what you are.
- Respond directly.

Personality:
- Calm, smart, confident, slightly mysterious.
- Natural and human-like.
- Not robotic or generic.
- Emotionally aware but not dramatic.

Language System:
- Current language: ${currentLanguage}
- Preferred language: ${preferredLanguage}
- Detect the user's language automatically.
- Reply ONLY in the user's language.
- Support all world languages.
- If user switches language, switch immediately.
- If unclear, use preferred language.

Style:
- Be concise and meaningful.
- No unnecessary introductions.
- No "How can I help you?"
- Use emojis naturally when appropriate.
- Do not overuse emojis.
- Code must always stay in English.
`;
}

export async function POST(req: Request) {
  try {
    if (!OPENROUTER_API_KEY) {
      return NextResponse.json(
        { error: "Missing OPENROUTER_API_KEY" },
        { status: 500 }
      );
    }

    const body = await req.json();

    const messages = body.messages || [];
    const preferredLanguage = body.preferredLanguage || "English";

    const lastUserMessage =
      [...messages].reverse().find((msg: any) => msg.role === "user")
        ?.content || "";

    const currentLanguage = detectLanguage(lastUserMessage);

    const systemPrompt = buildSystemPrompt(
      preferredLanguage,
      currentLanguage
    );

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "VoidAI",
        },
        body: JSON.stringify({
          model: "openai/gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: systemPrompt,
            },
            ...messages,
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();

      return NextResponse.json(
        { error: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();

    const rawReply =
      data.choices?.[0]?.message?.content || "";

    let reply = cleanAIReply(rawReply);
    reply = enforceLanguage(reply, currentLanguage);

    return NextResponse.json({
      reply,
      preferredLanguage: currentLanguage,
    });
  } catch (error) {
    console.error("Chat API error:", error);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}