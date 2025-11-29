export type AIEngine = "google" | "lmstudio" | "openai" | "anthropic";

const envEngine = (process.env.REACT_APP_AI_ENGINE as AIEngine) || "google";
const storedEngine =
  typeof window !== "undefined"
    ? (window.localStorage.getItem("aiEngineOverride") as AIEngine | null)
    : null;

export const AI_ENGINE: AIEngine = storedEngine || envEngine;

const readLocal = (key: string) =>
  typeof window !== "undefined" ? window.localStorage.getItem(key) : null;

const geminiKey = process.env.REACT_APP_GEMINI_API_KEY;
if (AI_ENGINE === "google" && !geminiKey) {
  throw new Error("set REACT_APP_GEMINI_API_KEY in .env for Google mode");
}
export const GEMINI_API_KEY = geminiKey;

// LM Studio (OpenAI-compatible local endpoint)
export const LMSTUDIO_BASE_URL =
  readLocal("lmstudioBaseUrl") ||
  process.env.REACT_APP_LMSTUDIO_URL ||
  "http://192.168.0.27:1234/v1";
export const LMSTUDIO_MODEL =
  readLocal("lmstudioModel") ||
  process.env.REACT_APP_LMSTUDIO_MODEL ||
  "openai/gpt-oss-20b";

// OpenAI
export const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY || "";
export const OPENAI_MODEL =
  readLocal("openaiModel") ||
  process.env.REACT_APP_OPENAI_MODEL ||
  "gpt-4o-mini";

// Anthropic
export const ANTHROPIC_API_KEY = process.env.REACT_APP_ANTHROPIC_API_KEY || "";
export const ANTHROPIC_MODEL =
  readLocal("anthropicModel") ||
  process.env.REACT_APP_ANTHROPIC_MODEL ||
  "claude-3-5-sonnet-20241022";
