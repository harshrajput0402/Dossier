// Destination: src/app/api/resumes/route.ts

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { extractResumeText } from "@/lib/parse-resume";

// pdf-parse needs Node APIs, not the Edge runtime
export const runtime = "nodejs";

export async function GET() {
    const session = await auth();
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resumes = await prisma.resume.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
        select: {
            id: true,
            label: true,
            fileName: true,
            isDefault: true,
            createdAt: true,
        },
    });

    return NextResponse.json(resumes);
}

export async function POST(req: Request) {
    const session = await auth();
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const label = ((formData.get("label") as string) || "").trim();

    if (!file) {
        return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }
    if (!label) {
        return NextResponse.json(
            { error: 'Give this resume a label, e.g. "Frontend"' },
            { status: 400 }
        );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    let text: string;
    try {
        text = await extractResumeText(buffer, file.type, file.name);
    } catch (err) {
        return NextResponse.json(
            { error: err instanceof Error ? err.message : "Couldn't read that file" },
            { status: 400 }
        );
    }

    if (text.length < 20) {
        return NextResponse.json(
            { error: "Couldn't extract readable text from that file" },
            { status: 400 }
        );
    }

    const existingCount = await prisma.resume.count({
        where: { userId: session.user.id },
    });

    const resume = await prisma.resume.create({
        data: {
            userId: session.user.id,
            label,
            fileName: file.name,
            text,
            isDefault: existingCount === 0, // first upload becomes default automatically
        },
    });

    return NextResponse.json(resume, { status: 201 });
}