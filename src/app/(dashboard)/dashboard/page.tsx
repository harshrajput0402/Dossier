// Destination: src/app/(dashboard)/dashboard/page.tsx
// This replaces the earlier version — delegates topbar+search+board to
// DashboardContent so search state can be shared client-side.

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DashboardContent } from "@/components/dashboard/DashboardContent";

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
    <DashboardContent
      initialApplications={serialized}
      resumes={resumes}
      initialResumeId={user?.lastResumeId}
    />
  );
}