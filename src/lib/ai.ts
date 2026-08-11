// Destination: src/lib/ai.ts

import type { MatchResult } from "@/types";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

export async function getMatchAnalysis({
  jobDescription,
  resumeText,
}: {
  jobDescription: string;
  resumeText: string;
}): Promise<MatchResult> {
  const prompt = `Compare this resume against this job description. Return ONLY valid JSON, no other text, in this exact shape:
{
  "matchScore": <integer 0-100>,
  "missingKeywords": ["keyword1", "keyword2"],
  "presentKeywords": ["keyword1", "keyword2"],
  "suggestions": ["short actionable tip 1", "short actionable tip 2", "short actionable tip 3"]
}

Resume:
${resumeText}

Job description:
${jobDescription}`;

  const res = await fetch(GROQ_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.3,
    }),
  });

  if (!res.ok) {
    throw new Error(`Groq API error: ${res.status}`);
  }

  const data = await res.json();
  const raw = data.choices?.[0]?.message?.content;
  if (!raw) throw new Error("No content returned from AI");

  let parsed: Partial<MatchResult>;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("AI returned invalid JSON");
  }

  return {
    matchScore: Math.max(0, Math.min(100, Math.round(parsed.matchScore ?? 0))),
    missingKeywords: parsed.missingKeywords ?? [],
    presentKeywords: parsed.presentKeywords ?? [],
    suggestions: parsed.suggestions ?? [],
  };
}