// Destination: src/components/dashboard/KanbanColumn.tsx
// This replaces the earlier version — adds onCardClick pass-through.
"use client";

import { useDroppable } from "@dnd-kit/core";
import { ApplicationCard } from "./ApplicationCard";
import { cn } from "@/lib/utils";
import type { Application } from "@/types";

export function KanbanColumn({
  id,
  label,
  dotClass,
  applications,
  onCardClick,
}: {
  id: string;
  label: string;
  dotClass: string;
  applications: Application[];
  onCardClick: (id: string) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "min-h-[420px] rounded-[10px] border border-transparent bg-surface2 p-3.5 transition-colors",
        isOver && "border-accent bg-surface"
      )}
    >
      <div className="flex items-center justify-between px-1.5 pb-3.5 pt-1">
        <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wide">
          <span className={cn("h-2 w-2 rounded-full", dotClass)} />
          {label}
        </div>
        <span className="rounded-full bg-surface px-2 py-0.5 font-mono text-[11px] text-text-soft">
          {applications.length}
        </span>
      </div>

      <div className="flex flex-col gap-2.5">
        {applications.map((app) => (
          <ApplicationCard
            key={app.id}
            application={app}
            onClick={() => onCardClick(app.id)}
          />
        ))}
        {applications.length === 0 && (
          <div className="rounded border border-dashed border-border p-4 text-center text-xs text-text-soft">
            Drop here
          </div>
        )}
      </div>
    </div>
  );
}