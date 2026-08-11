// Destination: src/components/dashboard/ApplicationCard.tsx
// This replaces the earlier version — adds an onClick prop to open the
// detail modal. Click still works alongside drag since dnd-kit only
// activates a drag after 6px of pointer movement (see KanbanBoard's
// PointerSensor activationConstraint) — a plain click/tap passes through.
"use client";

import { useDraggable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";
import type { Application } from "@/types";

function daysAgo(dateStr: string) {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
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

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={onClick}
      className={cn(
        "cursor-grab touch-none rounded-lg border border-border bg-surface p-3.5 shadow-card transition-shadow hover:shadow-card-hover active:cursor-grabbing",
        (isDragging || dragging) && "opacity-40"
      )}
    >
      <div className="mb-0.5 text-[14.5px] font-semibold">
        {application.company}
      </div>
      <div className="mb-2.5 font-mono text-xs text-text-soft">
        {application.role}
      </div>
      <div className="flex items-center justify-between">
        <span className="text-[11px] text-text-soft">
          {daysAgo(application.appliedAt)}
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