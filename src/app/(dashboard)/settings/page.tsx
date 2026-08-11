// Destination: src/app/(dashboard)/settings/page.tsx

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ResumeManager } from "@/components/settings/ResumeManager";

export default async function SettingsPage() {
  const session = await auth();

  const resumes = await prisma.resume.findMany({
    where: { userId: session!.user.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      label: true,
      fileName: true,
      isDefault: true,
      createdAt: true,
    },
  });

  const serialized = resumes.map((r) => ({
    ...r,
    createdAt: r.createdAt.toISOString(),
  }));

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold">Settings</h1>
      <p className="mb-7 max-w-[60ch] text-sm text-text-soft">
        Upload a resume for each type of role you apply to. When you add an
        application, you pick which one to match against.
      </p>
      <ResumeManager initialResumes={serialized} />
    </div>
  );
}