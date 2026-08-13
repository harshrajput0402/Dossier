// Destination: src/components/dashboard/KanbanBoard.tsx
// This replaces the earlier version — adds searchQuery filtering. The
// filter only affects what's rendered per column; the underlying
// `applications` state (used for drag logic and optimistic updates)
// is untouched, so search doesn't interfere with drag-and-drop.
"use client";

import { useEffect, useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { KanbanColumn } from "./KanbanColumn";
import { ApplicationCard } from "./ApplicationCard";
import { ApplicationDetailModal } from "./ApplicationDetailModal";
import { isStale } from "@/lib/stale";
import type { Application, ApplicationDetail, ApplicationStatus } from "@/types";

const COLUMNS: { id: ApplicationStatus; label: string; dotClass: string }[] = [
  { id: "APPLIED", label: "Applied", dotClass: "bg-stamp-applied" },
  { id: "INTERVIEW", label: "Interview", dotClass: "bg-stamp-interview" },
  { id: "OFFER", label: "Offer", dotClass: "bg-stamp-offer" },
  { id: "REJECTED", label: "Rejected", dotClass: "bg-stamp-rejected" },
];

export function KanbanBoard({
  initialApplications,
  searchQuery = "",
}: {
  initialApplications: Application[];
  searchQuery?: string;
}) {
  const [applications, setApplications] = useState(initialApplications);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    setApplications(initialApplications);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialApplications.length, initialApplications.map((a) => a.id).join(",")]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;

    const appId = active.id as string;
    const newStatus = over.id as ApplicationStatus;
    const current = applications.find((a) => a.id === appId);
    if (!current || current.status === newStatus) return;

    const previousStatus = current.status;

    setApplications((prev) =>
      prev.map((a) => (a.id === appId ? { ...a, status: newStatus } : a))
    );

    try {
      const res = await fetch(`/api/applications/${appId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Update failed");
    } catch {
      setApplications((prev) =>
        prev.map((a) =>
          a.id === appId ? { ...a, status: previousStatus } : a
        )
      );
    }
  }

  function handleModalUpdated(updated: ApplicationDetail) {
    setApplications((prev) =>
      prev.map((a) => (a.id === updated.id ? { ...a, ...updated } : a))
    );
  }

  function handleModalDeleted(id: string) {
    setApplications((prev) => prev.filter((a) => a.id !== id));
    setSelectedId(null);
  }

  const activeApp = applications.find((a) => a.id === activeId) ?? null;

  // filtering happens here, at render — `applications` itself stays the
  // full, untouched source of truth
  const q = searchQuery.trim().toLowerCase();
  const visibleApplications = q
    ? applications.filter(
        (a) =>
          a.company.toLowerCase().includes(q) ||
          a.role.toLowerCase().includes(q)
      )
    : applications;
  const emptyLabel = q ? "No matches" : "Drop here";

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {COLUMNS.map((col) => {
            let colApps = visibleApplications.filter((a) => a.status === col.id);
            if (col.id === "APPLIED") {
              // stale ones (oldest lastUpdate) float to the top so
              // they're the first thing you see in that column
              colApps = [...colApps].sort((a, b) => {
                const aStale = isStale(a) ? 1 : 0;
                const bStale = isStale(b) ? 1 : 0;
                if (aStale !== bStale) return bStale - aStale;
                return (
                  new Date(a.lastUpdate).getTime() -
                  new Date(b.lastUpdate).getTime()
                );
              });
            }
            return (
              <KanbanColumn
                key={col.id}
                id={col.id}
                label={col.label}
                dotClass={col.dotClass}
                applications={colApps}
                emptyLabel={emptyLabel}
                onCardClick={setSelectedId}
              />
            );
          })}
        </div>

        <DragOverlay>
          {activeApp ? (
            <ApplicationCard application={activeApp} dragging />
          ) : null}
        </DragOverlay>
      </DndContext>

      {selectedId && (
        <ApplicationDetailModal
          id={selectedId}
          onClose={() => setSelectedId(null)}
          onUpdated={handleModalUpdated}
          onDeleted={handleModalDeleted}
        />
      )}
    </>
  );
}