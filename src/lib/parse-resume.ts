// Destination: src/lib/parse-resume.ts
// This replaces the earlier version — swaps pdf-parse for unpdf.
// pdf-parse's legacy pdf.js internals have a persistent, well-documented
// incompatibility with how Next.js loads server dependencies (regardless
// of import()/require() or bundling config). unpdf is built specifically
// to extract PDF text reliably in Next.js/serverless/edge environments,
// so it sidesteps the whole problem instead of working around it.

import { extractText, getDocumentProxy } from "unpdf";
import mammoth from "mammoth";

export async function extractResumeText(
  buffer: Buffer,
  mimeType: string,
  fileName: string
): Promise<string> {
  const lower = fileName.toLowerCase();
  const isPdf = mimeType === "application/pdf" || lower.endsWith(".pdf");
  const isDocx =
    mimeType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    lower.endsWith(".docx");

  if (isPdf) {
    const pdf = await getDocumentProxy(new Uint8Array(buffer));
    const { text } = await extractText(pdf, { mergePages: true });
    return text.trim();
  }

  if (isDocx) {
    const result = await mammoth.extractRawText({ buffer });
    return result.value.trim();
  }

  throw new Error("Unsupported file type — upload a PDF or DOCX.");
}