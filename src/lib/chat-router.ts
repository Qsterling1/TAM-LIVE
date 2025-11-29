import {
  AI_ENGINE,
  ANTHROPIC_API_KEY,
  ANTHROPIC_MODEL,
  LMSTUDIO_BASE_URL,
  LMSTUDIO_MODEL,
  OPENAI_API_KEY,
  OPENAI_MODEL,
} from "../config";

type Message = { role: "user" | "assistant" | "system"; content: string };

const extractContent = (content: any): string => {
  if (!content) return "";
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content
      .map((part) => (typeof part === "string" ? part : part?.text || ""))
      .join("\n");
  }
  if (typeof content === "object" && "text" in content) {
    return (content as any).text || "";
  }
  return "";
};

async function callLmStudio(messages: Message[]): Promise<string> {
  const res = await fetch(`${LMSTUDIO_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: LMSTUDIO_MODEL,
      messages,
      temperature: 0.7,
      stream: false,
    }),
  });
  if (!res.ok) {
    throw new Error(`LM Studio error ${res.status}`);
  }
  const json = await res.json();
  return extractContent(json.choices?.[0]?.message?.content) || "";
}

async function callOpenAI(messages: Message[]): Promise<string> {
  if (!OPENAI_API_KEY) {
    throw new Error("Missing REACT_APP_OPENAI_API_KEY");
  }
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      messages,
      temperature: 0.7,
      stream: false,
    }),
  });
  if (!res.ok) {
    throw new Error(`OpenAI error ${res.status}`);
  }
  const json = await res.json();
  return extractContent(json.choices?.[0]?.message?.content) || "";
}

async function callAnthropic(messages: Message[]): Promise<string> {
  if (!ANTHROPIC_API_KEY) {
    throw new Error("Missing REACT_APP_ANTHROPIC_API_KEY");
  }
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: ANTHROPIC_MODEL,
      max_tokens: 1024,
      messages,
    }),
  });
  if (!res.ok) {
    throw new Error(`Anthropic error ${res.status}`);
  }
  const json = await res.json();
  return extractContent(json.content) || "";
}

export async function routeChat(messages: Message[]): Promise<string> {
  switch (AI_ENGINE) {
    case "lmstudio":
      return callLmStudio(messages);
    case "openai":
      return callOpenAI(messages);
    case "anthropic":
      return callAnthropic(messages);
    default:
      throw new Error(
        "routeChat is only for non-Google engines; current engine is Google"
      );
  }
}
