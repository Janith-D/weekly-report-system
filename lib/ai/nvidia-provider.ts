import OpenAI from "openai";
import type { AIReportContext } from "../ai";

const nvidia = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY,
  baseURL: process.env.NVIDIA_BASE_URL || "https://integrate.api.nvidia.com/v1",
});

export async function askNvidia(query: string, context: AIReportContext) {
  const hasReports = context.reports.length > 0;

  const systemPrompt = `You are an internal AI assistant for a weekly team reporting system.

Your ONLY source of truth is the weekly report data provided below under "WEEKLY REPORT DATA". 
You MUST answer strictly using that data. 
If the data does not contain the answer, say exactly:
"The available report data does not contain that information."

Do not invent member names, projects, tasks, blockers, hours, dates, or submission statuses.
Keep answers clear, professional, and useful for a manager.`;

  const reportDataSection = hasReports
    ? `WEEKLY REPORT DATA (${context.selectedWeek}):
${JSON.stringify(context.reports, null, 2)}`
    : `WEEKLY REPORT DATA (${context.selectedWeek}):
No reports have been submitted for this week.`;

  const response = await nvidia.chat.completions.create({
    model: process.env.NVIDIA_MODEL || "meta/llama-3.1-70b-instruct",
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: `${reportDataSection}\n\nManager question: "${query}"`,
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
