// Destination: src/types/index.ts
// This replaces the earlier version — adds Note + ApplicationDetail.

export type ApplicationStatus =
  | "WISHLIST"
  | "APPLIED"
  | "INTERVIEW"
  | "OFFER"
  | "REJECTED";

export interface Application {
  id: string;
  company: string;
  role: string;
  jobUrl?: string | null;
  jobText?: string | null;
  status: ApplicationStatus;
  matchScore?: number | null;
  missingKeywords: string[];
  appliedAt: string;
  lastUpdate: string;
}

export interface Note {
  id: string;
  body: string;
  createdAt: string;
}

export interface ApplicationDetail extends Application {
  notes: Note[];
}

export interface MatchResult {
  matchScore: number;
  missingKeywords: string[];
  presentKeywords: string[];
  suggestions: string[];
}