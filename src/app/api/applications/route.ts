// Destination: src/app/api/applications/route.ts
// This replaces the earlier version — POST now accepts resumeId and
// updates User.lastResumeId so the modal can default to it next time.

import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const createSchema = z.object({
  company: z.string().min(1),
  role: z.string().min(1),
  jobUrl: z.string().url().optional().or(z.literal("")),
  jobText: z.string().optional(),
  matchScore: z.number().min(0).max(100).optional(),
  missingKeywords: z.array(z.string()).optional(),
  resumeId: z.string().optional(),
});

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const applications = await prisma.application.findMany({
    where: { userId: session.user.id },
    orderBy: { appliedAt: "desc" },
  });

  return NextResponse.json(applications);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const application = await prisma.application.create({
    data: {
      ...parsed.data,
      userId: session.user.id,
    },
  });

  if (parsed.data.resumeId) {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { lastResumeId: parsed.data.resumeId },
    });
  }

  return NextResponse.json(application, { status: 201 });
}