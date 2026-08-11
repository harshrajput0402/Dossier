// Destination: src/app/api/ai/match/route.ts
// This replaces the earlier version — now resolves resume text from a
// saved Resume via resumeId instead of requiring pasted text.

import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getMatchAnalysis } from "@/lib/ai";

const matchSchema = z.object({
  jobDescription: z.string().min(20, "Paste the full job description"),
  resumeId: z.string().optional(),
});

const DAILY_LIMIT = 20;
const usageMap = new Map<string, { count: number; date: string }>();

function checkAndBumpLimit(userId: string) {
  const today = new Date().toISOString().slice(0, 10);
  const entry = usageMap.get(userId);
  if (!entry || entry.date !== today) {
    usageMap.set(userId, { count: 1, date: today });
    return true;
  }
  if (entry.count >= DAILY_LIMIT) return false;
  entry.count += 1;
  return true;
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!checkAndBumpLimit(session.user.id)) {
    return NextResponse.json(
      { error: "Daily AI match limit reached. Try again tomorrow." },
      { status: 429 }
    );
  }

  const body = await req.json();
  const parsed = matchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  // resolve which resume's text to use: the one explicitly picked, or
  // fall back to whichever is marked default for this user
  let resume = null;
  if (parsed.data.resumeId) {
    resume = await prisma.resume.findUnique({
      where: { id: parsed.data.resumeId },
    });
    if (!resume || resume.userId !== session.user.id) resume = null;
  }
  if (!resume) {
    resume = await prisma.resume.findFirst({
      where: { userId: session.user.id, isDefault: true },
    });
  }

  if (!resume) {
    return NextResponse.json(
      { error: "Upload a resume in Settings first" },
      { status: 400 }
    );
  }

  try {
    const result = await getMatchAnalysis({
      jobDescription: parsed.data.jobDescription,
      resumeText: resume.text,
    });
    return NextResponse.json(result);
  } catch (err) {
    console.error("AI match error:", err);
    return NextResponse.json(
      { error: "AI analysis failed. Try again." },
      { status: 502 }
    );
  }
}