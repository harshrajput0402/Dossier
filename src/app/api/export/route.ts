// Destination: src/app/api/export/route.ts

import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function toCsvValue(v: string | number | null | undefined) {
  if (v === null || v === undefined) return "";
  const s = String(v);
  if (s.includes(",") || s.includes('"') || s.includes("\n")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const format = searchParams.get("format") === "xlsx" ? "xlsx" : "csv";

  const applications = await prisma.application.findMany({
    where: { userId: session.user.id },
    orderBy: { appliedAt: "desc" },
  });

  const rows = applications.map((a) => ({
    Company: a.company,
    Role: a.role,
    Status: a.status,
    "Job Link": a.jobUrl ?? "",
    "Match Score": a.matchScore ?? "",
    "Missing Keywords": a.missingKeywords.join("; "),
    "Applied Date": a.appliedAt.toISOString().slice(0, 10),
    "Last Updated": a.lastUpdate.toISOString().slice(0, 10),
  }));

  const headers = [
    "Company",
    "Role",
    "Status",
    "Job Link",
    "Match Score",
    "Missing Keywords",
    "Applied Date",
    "Last Updated",
  ];

  if (format === "xlsx") {
    const worksheet = XLSX.utils.json_to_sheet(rows, { header: headers });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Applications");
    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    return new NextResponse(buffer, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": 'attachment; filename="dossier-applications.xlsx"',
      },
    });
  }

  const csvLines = [
    headers.join(","),
    ...rows.map((r) =>
      headers.map((h) => toCsvValue((r as Record<string, unknown>)[h] as string)).join(",")
    ),
  ];
  const csv = csvLines.join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": 'attachment; filename="dossier-applications.csv"',
    },
  });
}