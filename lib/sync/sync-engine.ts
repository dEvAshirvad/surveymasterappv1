"use client";

import { ApiError } from "@/lib/api/envelope";
import { getSessionEntry, patchSessionEntry } from "@/lib/api/endpoints/session-entries";
import { isOnline } from "@/lib/sync/connectivity";
import { makeDraftId, updateDraftSyncState, updateDraftVersion } from "@/lib/storage/draft-store";
import {
  type OutboxRecord,
  getDueOutboxItems,
  removeOutboxItem,
  scheduleOutboxRetry,
} from "@/lib/storage/outbox-store";

type FlushResult = {
  processed: number;
  success: number;
  failed: number;
  latestVersionByDraftId: Record<string, number>;
};

let inFlight = false;

function computeBackoffMs(retries: number) {
  const initial = 1500;
  const max = 60_000;
  return Math.min(max, initial * 2 ** retries);
}

function isRetryable(error: unknown) {
  if (!(error instanceof ApiError)) return true;
  return error.status >= 500;
}

async function applyClientWinsConflict(item: OutboxRecord) {
  const latest = await getSessionEntry({
    sessionId: item.sessionId,
    entryId: item.entryId,
  });

  const patched = await patchSessionEntry({
    sessionId: item.sessionId,
    entryId: item.entryId,
    expectedVersion: latest.version,
    answers: item.answers,
    progress: item.progress,
    contextSnapshot: item.contextSnapshot,
  });

  return patched.version;
}

async function processItem(item: OutboxRecord) {
  const draftId = makeDraftId(item.sessionId, item.entryId);
  await updateDraftSyncState(item.sessionId, item.entryId, "syncing");

  try {
    const patched = await patchSessionEntry({
      sessionId: item.sessionId,
      entryId: item.entryId,
      expectedVersion: item.expectedVersion,
      answers: item.answers,
      progress: item.progress,
      contextSnapshot: item.contextSnapshot,
    });

    await removeOutboxItem(item.id);
    await updateDraftVersion(item.sessionId, item.entryId, patched.version, "synced");
    return { ok: true as const, draftId, version: patched.version };
  } catch (error) {
    if (error instanceof ApiError && error.code === "VERSION_CONFLICT") {
      try {
        const version = await applyClientWinsConflict(item);
        await removeOutboxItem(item.id);
        await updateDraftVersion(item.sessionId, item.entryId, version, "synced");
        return { ok: true as const, draftId, version };
      } catch (retryError) {
        const retryCount = item.retries + 1;
        await scheduleOutboxRetry(item.id, retryCount, computeBackoffMs(retryCount));
        await updateDraftSyncState(
          item.sessionId,
          item.entryId,
          "error",
          retryError instanceof Error ? retryError.message : "Conflict replay failed.",
        );
        return { ok: false as const, draftId };
      }
    }

    if (!isRetryable(error)) {
      await updateDraftSyncState(
        item.sessionId,
        item.entryId,
        "error",
        error instanceof Error ? error.message : "Sync failed.",
      );
      return { ok: false as const, draftId };
    }

    const retryCount = item.retries + 1;
    await scheduleOutboxRetry(item.id, retryCount, computeBackoffMs(retryCount));
    await updateDraftSyncState(
      item.sessionId,
      item.entryId,
      "offline",
      error instanceof Error ? error.message : "Network unavailable.",
    );
    return { ok: false as const, draftId };
  }
}

export async function flushSyncOutbox() {
  if (inFlight || !isOnline()) {
    return {
      processed: 0,
      success: 0,
      failed: 0,
      latestVersionByDraftId: {},
    } satisfies FlushResult;
  }

  inFlight = true;
  try {
    const due = await getDueOutboxItems(30);
    let success = 0;
    let failed = 0;
    const latestVersionByDraftId: Record<string, number> = {};

    for (const item of due) {
      const result = await processItem(item);
      if (result.ok) {
        success += 1;
        latestVersionByDraftId[result.draftId] = result.version;
      } else {
        failed += 1;
      }
    }

    return {
      processed: due.length,
      success,
      failed,
      latestVersionByDraftId,
    } satisfies FlushResult;
  } finally {
    inFlight = false;
  }
}
