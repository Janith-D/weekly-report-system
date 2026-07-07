import { askNvidia } from "./nvidia-provider";
// import { askGemini } from "./gemini-provider";
// import { askGroq } from "./groq-provider";
// import { askClaude } from "./claude-provider";

export async function askAI(prompt: string) {
  const provider = process.env.AI_PROVIDER;

  if (provider === "nvidia") {
    return askNvidia(prompt);
  }

  // if (provider === "gemini") return askGemini(prompt);
  // if (provider === "groq") return askGroq(prompt);
  // if (provider === "claude") return askClaude(prompt);

  throw new Error("Invalid AI provider selected.");
}
