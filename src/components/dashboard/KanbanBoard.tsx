// Destination: src/components/dashboard/KanbanBoard.tsx
// This replaces the earlier version — adds selectedId state and renders
// ApplicationDetailModal on card click.
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
import type { Application, ApplicationDetail, ApplicationStatus } from "@/types";

const COLUMNS: { id: ApplicationStatus; label: string; dotClass: string }[] = [
  { id: "APPLIED", label: "Applied", dotClass: "bg-stamp-applied" },
  { id: "INTERVIEW", label: "Interview", dotClass: "bg-stamp-interview" },
  { id: "OFFER", label: "Offer", dotClass: "bg-stamp-offer" },
  { id: "REJECTED", label: "Rejected", dotClass: "bg-stamp-rejected" },
];

export function KanbanBoard({
  initialApplications,
}: {
  initialApplications: Application[];
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

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {COLUMNS.map((col) => (
            <KanbanColumn
              key={col.id}
              id={col.id}
              label={col.label}
              dotClass={col.dotClass}
              applications={applications.filter((a) => a.status === col.id)}
              onCardClick={setSelectedId}
            />
          ))}
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