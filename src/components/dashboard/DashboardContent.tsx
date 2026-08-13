// Destination: src/components/dashboard/DashboardContent.tsx
"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { KanbanBoard } from "./KanbanBoard";
import { AddApplicationModal } from "./AddApplicationModal";
import { isStale } from "@/lib/stale";
import type { Application } from "@/types";

interface ResumeOption {
  id: string;
  label: string;
  isDefault: boolean;
}

export function DashboardContent({
  initialApplications,
  resumes,
  initialResumeId,
}: {
  initialApplications: Application[];
  resumes: ResumeOption[];
  initialResumeId?: string | null;
}) {
  const [search, setSearch] = useState("");
  const staleCount = initialApplications.filter(isStale).length;

  return (
    <div>
      <div className="mb-1 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Your Applications</h1>
        <div className="flex flex-wrap items-center gap-2.5">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search company or role..."
            className="w-[200px] max-w-[45vw] rounded-md border border-border bg-surface px-3.5 py-2 text-[13.5px] text-text placeholder:text-text-soft"
          />
          <AddApplicationModal
            resumes={resumes}
            initialResumeId={initialResumeId}
          />
        </div>
      </div>
      <p className="mb-4 mt-1 text-sm text-text-soft">
        Drag a card between columns to update its status.
      </p>

      {staleCount > 0 && (
        <div className="mb-6 flex items-center gap-2 rounded-md border border-stamp-rejected/30 bg-stamp-rejected/10 px-4 py-3 text-sm text-stamp-rejected">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          {staleCount === 1
            ? "1 application hasn't been updated in 10+ days — might be worth a follow-up."
            : `${staleCount} applications haven't been updated in 10+ days — might be worth a follow-up.`}
        </div>
      )}

      <KanbanBoard
        initialApplications={initialApplications}
        searchQuery={search}
      />
    </div>
  );
}