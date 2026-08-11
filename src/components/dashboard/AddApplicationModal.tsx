// Destination: src/components/dashboard/AddApplicationModal.tsx
// This replaces the earlier version — swaps the resume textarea for a
// dropdown of saved resumes.
"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MatchResult } from "@/types";

const inputClass =
  "w-full rounded-md border border-border bg-bg px-3 py-2.5 text-[13.5px] text-text";

interface ResumeOption {
  id: string;
  label: string;
  isDefault: boolean;
}

export function AddApplicationModal({
  resumes,
  initialResumeId,
}: {
  resumes: ResumeOption[];
  initialResumeId?: string | null;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const defaultResumeId =
    initialResumeId ?? resumes.find((r) => r.isDefault)?.id ?? resumes[0]?.id ?? "";

  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [jobUrl, setJobUrl] = useState("");
  const [jobText, setJobText] = useState("");
  const [resumeId, setResumeId] = useState(defaultResumeId);

  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");
  const [error, setError] = useState("");
  const [result, setResult] = useState<MatchResult | null>(null);
  const [saving, setSaving] = useState(false);

  function reset() {
    setCompany("");
    setRole("");
    setJobUrl("");
    setJobText("");
    setStatus("idle");
    setError("");
    setResult(null);
  }

  async function runAnalysis() {
    if (jobText.trim().length < 20) {
      setError("Paste a fuller job description first.");
      return;
    }
    if (!resumeId) {
      setError("Upload a resume in Settings first.");
      return;
    }
    setError("");
    setStatus("loading");
    try {
      const res = await fetch("/api/ai/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobDescription: jobText, resumeId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Analysis failed");
      setResult(data);
      setStatus("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setStatus("idle");
    }
  }

  async function handleSave() {
    if (!company.trim() || !role.trim()) {
      setError("Company and role are required.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company,
          role,
          jobUrl: jobUrl || undefined,
          jobText: jobText || undefined,
          matchScore: result?.matchScore,
          missingKeywords: result?.missingKeywords,
          resumeId: resumeId || undefined,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to save");
      }
      setOpen(false);
      reset();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-md bg-accent px-4 py-2.5 font-mono text-[12.5px] text-white"
      >
        + Add Application
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[300] flex items-end justify-center bg-[var(--overlay)] p-0 sm:items-center sm:p-5"
          onClick={(e) => e.target === e.currentTarget && setOpen(false)}
        >
          <div className="grid max-h-[92vh] w-full max-w-[880px] grid-cols-1 overflow-y-auto rounded-t-2xl bg-surface shadow-2xl sm:grid-cols-2 sm:rounded-md">
            <div className="border-b border-border p-7 sm:border-b-0 sm:border-r">
              <div className="mb-1 flex items-start justify-between">
                <div>
                  <div className="mb-1 font-mono text-[11px] uppercase tracking-wide text-accent">
                    New application
                  </div>
                  <h2 className="text-lg font-bold">Paste the job details</h2>
                </div>
                <button onClick={() => setOpen(false)} aria-label="Close">
                  <X className="h-5 w-5 text-text-soft" />
                </button>
              </div>

              <div className="mt-4 flex flex-col gap-3.5">
                <Field label="Company">
                  <input
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className={inputClass}
                    placeholder="e.g. Stripe"
                  />
                </Field>
                <Field label="Role">
                  <input
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className={inputClass}
                    placeholder="e.g. SWE, Platform"
                  />
                </Field>
                <Field label="Job link (optional)">
                  <input
                    value={jobUrl}
                    onChange={(e) => setJobUrl(e.target.value)}
                    className={inputClass}
                    placeholder="https://..."
                  />
                </Field>
                <Field label="Job description">
                  <textarea
                    value={jobText}
                    onChange={(e) => setJobText(e.target.value)}
                    className={cn(inputClass, "min-h-[110px] resize-y")}
                    placeholder="Paste the full job description here..."
                  />
                </Field>

                <Field label="Resume to match against">
                  {resumes.length === 0 ? (
                    <p className="text-sm text-text-soft">
                      No resumes yet —{" "}
                      <Link href="/settings" className="text-accent">
                        upload one in Settings
                      </Link>
                      .
                    </p>
                  ) : (
                    <select
                      value={resumeId}
                      onChange={(e) => setResumeId(e.target.value)}
                      className={inputClass}
                    >
                      {resumes.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.label}
                          {r.isDefault ? " (default)" : ""}
                        </option>
                      ))}
                    </select>
                  )}
                </Field>

                {error && (
                  <p className="text-sm text-stamp-rejected">{error}</p>
                )}

                <button
                  onClick={runAnalysis}
                  disabled={status === "loading" || resumes.length === 0}
                  className="mt-1 flex items-center justify-center gap-2 rounded-md bg-accent px-4 py-2.5 font-mono text-[12.5px] text-white disabled:opacity-60"
                >
                  {status === "loading" && (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  )}
                  {status === "loading"
                    ? "Analyzing..."
                    : "Run AI Match Analysis"}
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="rounded-md border border-text px-4 py-2.5 font-mono text-[12.5px] disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save Application"}
                </button>
              </div>
            </div>

            <div className="p-7">
              <div className="mb-1 font-mono text-[11px] uppercase tracking-wide text-accent">
                AI insights
              </div>
              <h2 className="mb-4 text-lg font-bold">
                How your resume stacks up
              </h2>

              {status === "idle" && !result && (
                <p className="py-10 text-center text-sm text-text-soft">
                  Fill in the job description and pick a resume, then run the
                  analysis.
                </p>
              )}

              {status === "loading" && (
                <div className="flex justify-center py-10">
                  <Loader2 className="h-6 w-6 animate-spin text-accent" />
                </div>
              )}

              {result && status === "done" && (
                <div>
                  <div className="mb-1 flex items-baseline gap-2.5">
                    <span className="font-mono text-4xl font-bold text-stamp-offer">
                      {result.matchScore}%
                    </span>
                    <span className="font-mono text-xs text-text-soft">
                      MATCH SCORE
                    </span>
                  </div>
                  <div className="mb-5 h-1.5 overflow-hidden rounded-full bg-surface2">
                    <div
                      className="h-full rounded-full bg-stamp-offer transition-all"
                      style={{ width: `${result.matchScore}%` }}
                    />
                  </div>

                  {result.missingKeywords.length > 0 && (
                    <KeywordGroup
                      title="Missing keywords"
                      items={result.missingKeywords}
                      variant="missing"
                    />
                  )}
                  {result.presentKeywords.length > 0 && (
                    <KeywordGroup
                      title="Already covered"
                      items={result.presentKeywords}
                      variant="present"
                    />
                  )}
                  {result.suggestions.length > 0 && (
                    <div>
                      <div className="mb-2 font-mono text-[11px] uppercase tracking-wide text-text-soft">
                        Suggested tweaks
                      </div>
                      <ul className="flex flex-col gap-2">
                        {result.suggestions.map((s, i) => (
                          <li
                            key={i}
                            className="relative pl-3.5 text-[13px] text-text-soft before:absolute before:left-0 before:text-accent before:content-['—']"
                          >
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <label className="mb-1 block font-mono text-xs text-text-soft">
        {label}
      </label>
      {children}
    </div>
  );
}

function KeywordGroup({
  title,
  items,
  variant,
}: {
  title: string;
  items: string[];
  variant: "missing" | "present";
}) {
  return (
    <div className="mb-4">
      <div className="mb-2 font-mono text-[11px] uppercase tracking-wide text-text-soft">
        {title}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {items.map((k) => (
          <span
            key={k}
            className={cn(
              "rounded-full px-2.5 py-1 font-mono text-[11px]",
              variant === "missing"
                ? "bg-stamp-rejected/10 text-stamp-rejected"
                : "bg-stamp-offer/10 text-stamp-offer"
            )}
          >
            {k}
          </span>
        ))}
      </div>
    </div>
  );
}