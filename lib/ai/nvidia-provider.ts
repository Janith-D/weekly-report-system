import OpenAI from "openai";

const nvidia = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY,
  baseURL: process.env.NVIDIA_BASE_URL || "https://integrate.api.nvidia.com/v1",
});

export async function askNvidia(prompt: string) {
  const response = await nvidia.chat.completions.create({
    model: process.env.NVIDIA_MODEL || "meta/llama-3.1-70b-instruct",
    messages: [
      {
        role: "system",
        content: `
You are an internal AI assistant for a weekly team reporting system.

Answer only using the weekly report data provided.
Do not invent member names, projects, tasks, blockers, hours, dates, or submission statuses.
If the available report data does not contain the answer, say:
"The available report data does not contain that information."

Keep answers clear, professional, and useful for a manager.
        `,
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.2,
    max_tokens: 700,
  });

  return (
    response.choices[0]?.message?.content ||
    "No response generated."
  );
}
