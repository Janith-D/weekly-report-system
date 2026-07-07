import type { AIReportContext } from "../ai";
import { askNvidia } from "./nvidia-provider";
// import { askGemini } from "./gemini-provider";
// import { askGroq } from "./groq-provider";
// import { askClaude } from "./claude-provider";

export async function askAI(query: string, context: AIReportContext) {
  const provider = process.env.AI_PROVIDER;

  if (provider === "nvidia") {
    return askNvidia(query, context);
  }

  throw new Error("Invalid AI provider selected.");
}
