// Destination: src/app/api/resumes/[id]/route.ts

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function assertOwnership(id: string, userId: string) {
  const resume = await prisma.resume.findUnique({ where: { id } });
  return resume && resume.userId === userId ? resume : null;
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const owned = await assertOwnership(params.id, session.user.id);
  if (!owned) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await req.json();

  if (body.setDefault) {
    await prisma.$transaction([
      prisma.resume.updateMany({
        where: { userId: session.user.id },
        data: { isDefault: false },
      }),
      prisma.resume.update({
        where: { id: params.id },
        data: { isDefault: true },
      }),
    ]);
    return NextResponse.json({ success: true });
  }

  if (typeof body.label === "string" && body.label.trim()) {
    const updated = await prisma.resume.update({
      where: { id: params.id },
      data: { label: body.label.trim() },
    });
    return NextResponse.json(updated);
  }

  return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const owned = await assertOwnership(params.id, session.user.id);
  if (!owned) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.resume.delete({ where: { id: params.id } });

  // if the deleted one was the default, promote another so there's always
  // a sensible fallback for the AI matcher
  if (owned.isDefault) {
    const another = await prisma.resume.findFirst({
      where: { userId: session.user.id },
    });
    if (another) {
      await prisma.resume.update({
        where: { id: another.id },
        data: { isDefault: true },
      });
    }
  }

  return NextResponse.json({ success: true });
}