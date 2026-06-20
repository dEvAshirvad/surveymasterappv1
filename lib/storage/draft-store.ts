"use client";

import { getOfflineDb } from "@/lib/storage/offline-db";
import type { DraftRecord, DraftSyncStatus } from "@/lib/storage/offline-types";
import type { EntryAnswerItem } from "@/lib/api/endpoints/session-entries";

export type { DraftRecord, DraftSyncStatus };

function draftId(sessionId: string, entryId: string) {
  return `${sessionId}:${entryId}`;
}

export async function upsertDraft(
  input: Omit<DraftRecord, "id" | "localRevision" | "updatedAt"> &
    Partial<Pick<DraftRecord, "localRevision" | "updatedAt">>,
) {
  const db = await getOfflineDb();
  if (!db) return null;

  const id = draftId(input.sessionId, input.entryId);
  const existing = await db.get("drafts", id);

  const next: DraftRecord = {
    id,
    sessionId: input.sessionId,
    entryId: input.entryId,
    formCode: input.formCode,
    answers: input.answers,
    progress: input.progress,
    context: input.context,
    version: input.version,
    syncStatus: input.syncStatus,
    lastError: input.lastError,
    localRevision: input.localRevision ?? (existing?.localRevision ?? 0) + 1,
    updatedAt: input.updatedAt ?? new Date().toISOString(),
  };

  await db.put("drafts", next);
  return next;
}

export async function getDraft(sessionId: string, entryId: string) {
  const db = await getOfflineDb();
  if (!db) return null;
  return db.get("drafts", draftId(sessionId, entryId));
}

export async function getDraftBySessionAndForm(sessionId: string, formCode: string) {
  const db = await getOfflineDb();
  if (!db) return null;
  const all = await db.getAllFromIndex("drafts", "by-session", sessionId);
  const normalized = formCode.toUpperCase();
  const matches = all
    .filter((item) => item.formCode.toUpperCase() === normalized)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  return matches[0] ?? null;
}

export async function listDraftsBySession(sessionId: string) {
  const db = await getOfflineDb();
  if (!db) return [];
  return db.getAllFromIndex("drafts", "by-session", sessionId);
}

export async function getDraftAnswersByFormCodes(sessionId: string, formCodes: string[]) {
  const drafts = await listDraftsBySession(sessionId);
  const target = new Set(formCodes.map((code) => code.toUpperCase()));
  return drafts.reduce<Record<string, EntryAnswerItem[]>>((acc, draft) => {
    const key = draft.formCode.toUpperCase();
    if (!target.has(key)) return acc;
    acc[key] = draft.answers;
    return acc;
  }, {});
}

export async function updateDraftSyncState(
  sessionId: string,
  entryId: string,
  syncStatus: DraftSyncStatus,
  lastError?: string,
) {
  const db = await getOfflineDb();
  if (!db) return null;

  const id = draftId(sessionId, entryId);
  const existing = await db.get("drafts", id);
  if (!existing) return null;

  const next: DraftRecord = {
    ...existing,
    syncStatus,
    lastError,
    updatedAt: new Date().toISOString(),
  };
  await db.put("drafts", next);
  return next;
}

export async function updateDraftVersion(
  sessionId: string,
  entryId: string,
  version: number,
  syncStatus: DraftSyncStatus = "synced",
) {
  const db = await getOfflineDb();
  if (!db) return null;

  const id = draftId(sessionId, entryId);
  const existing = await db.get("drafts", id);
  if (!existing) return null;

  const next: DraftRecord = {
    ...existing,
    version,
    syncStatus,
    lastError: undefined,
    updatedAt: new Date().toISOString(),
  };
  await db.put("drafts", next);
  return next;
}

export async function removeDraft(sessionId: string, entryId: string) {
  const db = await getOfflineDb();
  if (!db) return;
  await db.delete("drafts", draftId(sessionId, entryId));
}

export function makeDraftId(sessionId: string, entryId: string) {
  return draftId(sessionId, entryId);
}
