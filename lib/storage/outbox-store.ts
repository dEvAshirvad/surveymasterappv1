"use client";

import { getOfflineDb } from "@/lib/storage/offline-db";
import type { OutboxRecord } from "@/lib/storage/offline-types";

export type { OutboxRecord };

function makeOutboxId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export async function enqueueOutboxItem(
  input: Omit<OutboxRecord, "id" | "retries" | "nextRetryAt" | "createdAt" | "updatedAt">,
) {
  const db = await getOfflineDb();
  if (!db) return null;

  const existing = await db.getAllFromIndex("outbox", "by-draft", input.draftId);
  const now = Date.now();

  // Keep only one latest payload per draft to avoid queue blow-ups while typing.
  if (existing[0]) {
    const updated: OutboxRecord = {
      ...existing[0],
      expectedVersion: input.expectedVersion,
      answers: input.answers,
      progress: input.progress,
      contextSnapshot: input.contextSnapshot,
      formCode: input.formCode,
      sessionId: input.sessionId,
      entryId: input.entryId,
      updatedAt: now,
      nextRetryAt: now,
    };
    await db.put("outbox", updated);
    return updated;
  }

  const record: OutboxRecord = {
    id: makeOutboxId(),
    draftId: input.draftId,
    sessionId: input.sessionId,
    entryId: input.entryId,
    formCode: input.formCode,
    expectedVersion: input.expectedVersion,
    answers: input.answers,
    progress: input.progress,
    contextSnapshot: input.contextSnapshot,
    retries: 0,
    nextRetryAt: now,
    createdAt: now,
    updatedAt: now,
  };
  await db.add("outbox", record);
  return record;
}

export async function getDueOutboxItems(limit = 20) {
  const db = await getOfflineDb();
  if (!db) return [];
  const now = Date.now();
  const all = await db.getAll("outbox");
  return all
    .filter((item) => item.nextRetryAt <= now)
    .sort((a, b) => a.createdAt - b.createdAt)
    .slice(0, limit);
}

export async function scheduleOutboxRetry(
  id: string,
  retries: number,
  backoffMs: number,
) {
  const db = await getOfflineDb();
  if (!db) return null;
  const existing = await db.get("outbox", id);
  if (!existing) return null;

  const next: OutboxRecord = {
    ...existing,
    retries,
    updatedAt: Date.now(),
    nextRetryAt: Date.now() + backoffMs,
  };
  await db.put("outbox", next);
  return next;
}

export async function removeOutboxItem(id: string) {
  const db = await getOfflineDb();
  if (!db) return;
  await db.delete("outbox", id);
}

export async function clearOutboxForDraft(draftId: string) {
  const db = await getOfflineDb();
  if (!db) return;
  const matches = await db.getAllFromIndex("outbox", "by-draft", draftId);
  await Promise.all(matches.map((item) => db.delete("outbox", item.id)));
}
