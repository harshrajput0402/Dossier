// Destination: src/lib/stale.ts

import type { Application } from "@/types";

export const STALE_THRESHOLD_DAYS = 10;

export function daysSince(dateStr: string) {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

// "stale" = still sitting in Applied with no status change or edit in
// STALE_THRESHOLD_DAYS days (lastUpdate covers both, since Prisma's
// @updatedAt bumps it on any field change, including status).
export function isStale(app: Pick<Application, "status" | "lastUpdate">) {
  return (
    app.status === "APPLIED" && daysSince(app.lastUpdate) >= STALE_THRESHOLD_DAYS
  );
}