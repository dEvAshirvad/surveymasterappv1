import type { EntryAnswerItem, SessionEntryProgress } from "@/lib/api/endpoints/session-entries";
import type { SessionContext } from "@/lib/api/endpoints/sessions";

export type DraftSyncStatus =
  | "synced"
  | "queued"
  | "syncing"
  | "offline"
  | "error"
  | "conflict";

export type DraftRecord = {
  id: string;
  sessionId: string;
  entryId: string;
  formCode: string;
  answers: EntryAnswerItem[];
  progress: SessionEntryProgress;
  context: SessionContext;
  version: number;
  localRevision: number;
  syncStatus: DraftSyncStatus;
  lastError?: string;
  updatedAt: string;
};

export type OutboxRecord = {
  id: string;
  draftId: string;
  sessionId: string;
  entryId: string;
  formCode: string;
  expectedVersion: number;
  answers: EntryAnswerItem[];
  progress: SessionEntryProgress;
  contextSnapshot: Pick<SessionContext, "surveyorName" | "surveyorNameNIT" | "surveyDate">;
  retries: number;
  nextRetryAt: number;
  createdAt: number;
  updatedAt: number;
};
