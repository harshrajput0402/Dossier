// Destination: src/components/settings/ResumeManager.tsx
"use client";

import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Star, Trash2, FileText, Loader2 } from "lucide-react";

interface ResumeItem {
  id: string;
  label: string;
  fileName: string | null;
  isDefault: boolean;
  createdAt: string;
}

export function ResumeManager({
  initialResumes,
}: {
  initialResumes: ResumeItem[];
}) {
  const router = useRouter();
  const [resumes, setResumes] = useState(initialResumes);
  const [label, setLabel] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleUpload(e: FormEvent) {
    e.preventDefault();
    if (!file) {
      setError("Choose a PDF or DOCX file.");
      return;
    }
    if (!label.trim()) {
      setError('Give this resume a label, e.g. "Frontend".');
      return;
    }
    setError("");
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("label", label.trim());

    try {
      const res = await fetch("/api/resumes", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload failed");

      setResumes((prev) => [data, ...prev]);
      setLabel("");
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setUploading(false);
    }
  }

  async function setDefault(id: string) {
    setResumes((prev) => prev.map((r) => ({ ...r, isDefault: r.id === id })));
    await fetch(`/api/resumes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ setDefault: true }),
    });
    router.refresh();
  }

  async function deleteResume(id: string) {
    setResumes((prev) => prev.filter((r) => r.id !== id));
    await fetch(`/api/resumes/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div>
      <form
        onSubmit={handleUpload}
        className="mb-8 flex flex-col gap-3 rounded-md border border-border bg-surface p-5 sm:flex-row sm:items-end"
      >
        <div className="flex-1">
          <label className="mb-1 block font-mono text-xs text-text-soft">
            Label
          </label>
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="e.g. Frontend Resume"
            className="w-full rounded-md border border-border bg-bg px-3 py-2.5 text-sm text-text"
          />
        </div>
        <div className="flex-1">
          <label className="mb-1 block font-mono text-xs text-text-soft">
            File (PDF or DOCX)
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm text-text file:mr-3 file:rounded file:border-0 file:bg-surface2 file:px-2.5 file:py-1 file:text-xs"
          />
        </div>
        <button
          type="submit"
          disabled={uploading}
          className="flex items-center justify-center gap-2 whitespace-nowrap rounded-md bg-accent px-4 py-2.5 font-mono text-[12.5px] text-white disabled:opacity-60"
        >
          {uploading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </form>

      {error && <p className="mb-4 text-sm text-stamp-rejected">{error}</p>}

      <div className="flex flex-col gap-3">
        {resumes.length === 0 && (
          <p className="text-sm text-text-soft">No resumes uploaded yet.</p>
        )}
        {resumes.map((r) => (
          <div
            key={r.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-border bg-surface p-4"
          >
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 shrink-0 text-text-soft" />
              <div>
                <div className="flex items-center gap-2 text-sm font-semibold">
                  {r.label}
                  {r.isDefault && (
                    <span className="rounded-full bg-stamp-offer/15 px-2 py-0.5 font-mono text-[10px] text-stamp-offer">
                      DEFAULT
                    </span>
                  )}
                </div>
                <div className="font-mono text-xs text-text-soft">
                  {r.fileName}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {!r.isDefault && (
                <button
                  onClick={() => setDefault(r.id)}
                  className="flex items-center gap-1 rounded-md border border-border px-2.5 py-1.5 font-mono text-[11px] text-text-soft"
                >
                  <Star className="h-3.5 w-3.5" />
                  Set default
                </button>
              )}
              <button
                onClick={() => deleteResume(r.id)}
                aria-label="Delete resume"
                className="rounded-md border border-border p-1.5 text-stamp-rejected"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}