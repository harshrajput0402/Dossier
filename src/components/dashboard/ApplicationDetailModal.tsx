// Destination: src/components/dashboard/ApplicationDetailModal.tsx
"use client";

import { useEffect, useState } from "react";
import { X, Loader2, Trash2, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ApplicationDetail, ApplicationStatus } from "@/types";

const STATUS_OPTIONS: { value: ApplicationStatus; label: string }[] = [
  { value: "WISHLIST", label: "Wishlist" },
  { value: "APPLIED", label: "Applied" },
  { value: "INTERVIEW", label: "Interview" },
  { value: "OFFER", label: "Offer" },
  { value: "REJECTED", label: "Rejected" },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function ApplicationDetailModal({
  id,
  onClose,
  onUpdated,
  onDeleted,
}: {
  id: string;
  onClose: () => void;
  onUpdated: (app: ApplicationDetail) => void;
  onDeleted: (id: string) => void;
}) {
  const [app, setApp] = useState<ApplicationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusSaving, setStatusSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [addingNote, setAddingNote] = useState(false);
  const [showFullJob, setShowFullJob] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`/api/applications/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Failed to load");
        if (!cancelled) setApp(data);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Something went wrong");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  async function handleStatusChange(newStatus: ApplicationStatus) {
    if (!app) return;
    const previous = app.status;
    setApp({ ...app, status: newStatus });
    setStatusSaving(true);
    try {
      const res = await fetch(`/api/applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      const updated = { ...app, status: newStatus };
      onUpdated(updated);
    } catch {
      setApp({ ...app, status: previous });
    } finally {
      setStatusSaving(false);
    }
  }

  async function handleAddNote() {
    if (!noteText.trim() || !app) return;
    setAddingNote(true);
    try {
      const res = await fetch(`/api/applications/${id}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: noteText.trim() }),
      });
      const note = await res.json();
      if (!res.ok) throw new Error(note.error ?? "Failed to add note");
      setApp({ ...app, notes: [...app.notes, note] });
      setNoteText("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setAddingNote(false);
    }
  }

  async function handleDelete() {
    if (!confirm(`Delete the application for ${app?.company}? This can't be undone.`)) {
      return;
    }
    setDeleting(true);
    try {
      const res = await fetch(`/api/applications/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      onDeleted(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setDeleting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[300] flex items-end justify-center bg-[var(--overlay)] p-0 sm:items-center sm:p-5"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="grid max-h-[92vh] w-full max-w-[880px] grid-cols-1 overflow-y-auto rounded-t-2xl bg-surface shadow-2xl sm:grid-cols-2 sm:rounded-md">
        {loading ? (
          <div className="col-span-2 flex justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-accent" />
          </div>
        ) : !app ? (
          <div className="col-span-2 p-7 text-sm text-stamp-rejected">
            {error || "Couldn't load this application."}
          </div>
        ) : (
          <>
            {/* left: details */}
            <div className="border-b border-border p-7 sm:border-b-0 sm:border-r">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <div className="mb-1 font-mono text-[11px] uppercase tracking-wide text-accent">
                    {app.company}
                  </div>
                  <h2 className="text-lg font-bold">{app.role}</h2>
                </div>
                <button onClick={onClose} aria-label="Close">
                  <X className="h-5 w-5 text-text-soft" />
                </button>
              </div>

              <div className="mb-5 flex flex-col gap-3">
                <div>
                  <label className="mb-1 block font-mono text-xs text-text-soft">
                    Status
                  </label>
                  <select
                    value={app.status}
                    disabled={statusSaving}
                    onChange={(e) =>
                      handleStatusChange(e.target.value as ApplicationStatus)
                    }
                    className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm text-text disabled:opacity-60"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-6 font-mono text-xs text-text-soft">
                  <div>
                    <div className="mb-0.5 uppercase tracking-wide">Applied</div>
                    <div className="text-text">{formatDate(app.appliedAt)}</div>
                  </div>
                  <div>
                    <div className="mb-0.5 uppercase tracking-wide">
                      Last update
                    </div>
                    <div className="text-text">{formatDate(app.lastUpdate)}</div>
                  </div>
                </div>

                {app.jobUrl && (
                  <a
                    href={app.jobUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm text-accent"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    View original posting
                  </a>
                )}

                {app.matchScore !== null && app.matchScore !== undefined && (
                  <div>
                    <div className="mb-1 flex items-baseline gap-2">
                      <span className="font-mono text-2xl font-bold text-stamp-offer">
                        {app.matchScore}%
                      </span>
                      <span className="font-mono text-[11px] text-text-soft">
                        MATCH SCORE
                      </span>
                    </div>
                    {app.missingKeywords.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {app.missingKeywords.map((k) => (
                          <span
                            key={k}
                            className="rounded-full bg-stamp-rejected/10 px-2 py-0.5 font-mono text-[10.5px] text-stamp-rejected"
                          >
                            {k}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {app.jobText && (
                  <div>
                    <div className="mb-1 font-mono text-xs text-text-soft">
                      Job description
                    </div>
                    <p
                      className={cn(
                        "whitespace-pre-line text-[13px] text-text-soft",
                        !showFullJob && "line-clamp-4"
                      )}
                    >
                      {app.jobText}
                    </p>
                    <button
                      onClick={() => setShowFullJob((v) => !v)}
                      className="mt-1 font-mono text-[11px] text-accent"
                    >
                      {showFullJob ? "Show less" : "Show more"}
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex items-center gap-1.5 rounded-md border border-stamp-rejected px-3 py-2 font-mono text-[11.5px] text-stamp-rejected disabled:opacity-60"
              >
                <Trash2 className="h-3.5 w-3.5" />
                {deleting ? "Deleting..." : "Delete application"}
              </button>
            </div>

            {/* right: notes/timeline */}
            <div className="p-7">
              <div className="mb-1 font-mono text-[11px] uppercase tracking-wide text-accent">
                Timeline
              </div>
              <h2 className="mb-4 text-lg font-bold">Notes</h2>

              <div className="mb-4 flex flex-col gap-3">
                <div className="rounded-md border border-dashed border-border p-3 text-[13px] text-text-soft">
                  Applied on {formatDate(app.appliedAt)}
                </div>
                {app.notes.map((note) => (
                  <div
                    key={note.id}
                    className="rounded-md border border-border bg-bg p-3"
                  >
                    <div className="mb-1 font-mono text-[10.5px] text-text-soft">
                      {formatDate(note.createdAt)}
                    </div>
                    <div className="text-[13.5px]">{note.body}</div>
                  </div>
                ))}
                {app.notes.length === 0 && (
                  <p className="text-sm text-text-soft">No notes yet.</p>
                )}
              </div>

              {error && <p className="mb-3 text-sm text-stamp-rejected">{error}</p>}

              <div className="flex flex-col gap-2">
                <textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="e.g. Recruiter call scheduled for Friday"
                  className="min-h-[70px] w-full resize-y rounded-md border border-border bg-bg px-3 py-2 text-[13.5px] text-text"
                />
                <button
                  onClick={handleAddNote}
                  disabled={addingNote || !noteText.trim()}
                  className="rounded-md bg-accent px-4 py-2 font-mono text-[12px] text-white disabled:opacity-60"
                >
                  {addingNote ? "Adding..." : "Add note"}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}