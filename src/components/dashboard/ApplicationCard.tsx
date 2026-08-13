// Destination: src/components/dashboard/ApplicationCard.tsx
// This replaces the earlier version — adds a stale-application indicator.
"use client";

import { useDraggable } from "@dnd-kit/core";
import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { daysSince, isStale } from "@/lib/stale";
import type { Application } from "@/types";

function daysAgoLabel(dateStr: string) {
  const days = daysSince(dateStr);
  if (days <= 0) return "Today";
  if (days === 1) return "1 day ago";
  return `${days} days ago`;
}

export function ApplicationCard({
  application,
  dragging = false,
  onClick,
}: {
  application: Application;
  dragging?: boolean;
  onClick?: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: application.id });

  const style = transform
    ? { transform: `translate(${transform.x}px, ${transform.y}px)` }
    : undefined;

  const score = application.matchScore ?? null;
  const stale = isStale(application);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={onClick}
      className={cn(
        "cursor-grab touch-none rounded-lg border border-border bg-surface p-3.5 shadow-card transition-shadow hover:shadow-card-hover active:cursor-grabbing",
        stale && "border-l-[3px] border-l-stamp-rejected",
        (isDragging || dragging) && "opacity-40"
      )}
    >
      <div className="mb-0.5 text-[14.5px] font-semibold">
        {application.company}
      </div>
      <div className="mb-2.5 font-mono text-xs text-text-soft">
        {application.role}
      </div>

      {stale && (
        <div className="mb-2 flex items-center gap-1 rounded bg-stamp-rejected/10 px-1.5 py-1 font-mono text-[10.5px] text-stamp-rejected">
          <AlertTriangle className="h-3 w-3 shrink-0" />
          No update in {daysSince(application.lastUpdate)}d — follow up?
        </div>
      )}

      <div className="flex items-center justify-between">
        <span className="text-[11px] text-text-soft">
          {daysAgoLabel(application.appliedAt)}
        </span>
        {score !== null && (
          <span
            className={cn(
              "rounded-full px-1.5 py-0.5 font-mono text-[10.5px] font-bold",
              score >= 75
                ? "bg-stamp-offer/15 text-stamp-offer"
                : "bg-stamp-applied/15 text-stamp-applied"
            )}
          >
            {score}%
          </span>
        )}
      </div>
    </div>
  );
}