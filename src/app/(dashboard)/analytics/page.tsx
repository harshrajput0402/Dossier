// Destination: src/app/(dashboard)/analytics/page.tsx

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AnalyticsCharts } from "@/components/analytics/AnalyticsCharts";
import type { ApplicationStatus } from "@/types";

const STATUS_LABELS: Record<ApplicationStatus, string> = {
  WISHLIST: "Wishlist",
  APPLIED: "Applied",
  INTERVIEW: "Interview",
  OFFER: "Offer",
  REJECTED: "Rejected",
};

// these reference the same CSS variables used everywhere else, so the
// charts automatically match light/dark theme
const STATUS_COLOR_VAR: Record<ApplicationStatus, string> = {
  WISHLIST: "var(--manila-deep)",
  APPLIED: "var(--stamp-applied)",
  INTERVIEW: "var(--stamp-interview)",
  OFFER: "var(--stamp-offer)",
  REJECTED: "var(--stamp-rejected)",
};

function startOfWeek(d: Date) {
  const date = new Date(d);
  const day = date.getDay();
  date.setDate(date.getDate() - day);
  date.setHours(0, 0, 0, 0);
  return date;
}

export default async function AnalyticsPage() {
  const session = await auth();
  const applications = await prisma.application.findMany({
    where: { userId: session!.user.id },
    orderBy: { appliedAt: "asc" },
  });

  const total = applications.length;

  // "responded" = moved past Applied — i.e. the company did something
  const responded = applications.filter(
    (a) =>
      a.status === "INTERVIEW" ||
      a.status === "OFFER" ||
      a.status === "REJECTED"
  ).length;
  const responseRate = total > 0 ? Math.round((responded / total) * 100) : 0;

  const scored = applications.filter((a) => a.matchScore !== null);
  const avgMatchScore =
    scored.length > 0
      ? Math.round(
          scored.reduce((sum, a) => sum + (a.matchScore ?? 0), 0) /
            scored.length
        )
      : null;

  const respondedWithTiming = applications.filter(
    (a) => a.status !== "APPLIED" && a.status !== "WISHLIST"
  );
  const avgResponseDays =
    respondedWithTiming.length > 0
      ? Math.round(
          respondedWithTiming.reduce((sum, a) => {
            const days =
              (new Date(a.lastUpdate).getTime() -
                new Date(a.appliedAt).getTime()) /
              (1000 * 60 * 60 * 24);
            return sum + days;
          }, 0) / respondedWithTiming.length
        )
      : null;

  const statusOrder: ApplicationStatus[] = [
    "APPLIED",
    "INTERVIEW",
    "OFFER",
    "REJECTED",
  ];
  const statusBreakdown = statusOrder.map((status) => ({
    status: STATUS_LABELS[status],
    count: applications.filter((a) => a.status === status).length,
    color: STATUS_COLOR_VAR[status],
  }));

  // applications logged per week, last 8 weeks
  const now = new Date();
  const weeks = Array.from({ length: 8 }, (_, idx) => {
    const i = 7 - idx;
    return startOfWeek(new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000));
  });
  const weeklyApplications = weeks.map((start) => {
    const end = new Date(start.getTime() + 7 * 24 * 60 * 60 * 1000);
    const count = applications.filter((a) => {
      const applied = new Date(a.appliedAt);
      return applied >= start && applied < end;
    }).length;
    return {
      week: start.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      count,
    };
  });

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold">Analytics</h1>
      <p className="mb-7 text-sm text-text-soft">
        How your job hunt is trending.
      </p>
      <AnalyticsCharts
        total={total}
        responseRate={responseRate}
        avgMatchScore={avgMatchScore}
        avgResponseDays={avgResponseDays}
        statusBreakdown={statusBreakdown}
        weeklyApplications={weeklyApplications}
      />
    </div>
  );
}