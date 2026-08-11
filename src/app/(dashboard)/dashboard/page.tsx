// Destination: src/app/(dashboard)/dashboard/page.tsx
// This replaces the earlier version — fetches resumes for the picker
// instead of a single resumeText string.

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { KanbanBoard } from "@/components/dashboard/KanbanBoard";
import { AddApplicationModal } from "@/components/dashboard/AddApplicationModal";

export default async function DashboardPage() {
  const session = await auth();

  const [applications, resumes, user] = await Promise.all([
    prisma.application.findMany({
      where: { userId: session!.user.id },
      orderBy: { appliedAt: "desc" },
    }),
    prisma.resume.findMany({
      where: { userId: session!.user.id },
      orderBy: { createdAt: "desc" },
      select: { id: true, label: true, isDefault: true },
    }),
    prisma.user.findUnique({
      where: { id: session!.user.id },
      select: { lastResumeId: true },
    }),
  ]);

  const serialized = applications.map((a) => ({
    ...a,
    appliedAt: a.appliedAt.toISOString(),
    lastUpdate: a.lastUpdate.toISOString(),
  }));

  return (
    <div>
      <div className="mb-1 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Your Applications</h1>
        <AddApplicationModal
          resumes={resumes}
          initialResumeId={user?.lastResumeId}
        />
      </div>
      <p className="mb-7 mt-1 text-sm text-text-soft">
        Drag a card between columns to update its status.
      </p>
      <KanbanBoard initialApplications={serialized} />
    </div>
  );
}