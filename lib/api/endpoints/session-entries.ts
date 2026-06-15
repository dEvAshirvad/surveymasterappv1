import { apiDelete, apiGet, apiPatch, apiPost } from "@/lib/api/client";
import type { ApiEnvelope, ApiPagination } from "@/lib/api/envelope";
import type { SessionContext } from "@/lib/api/endpoints/sessions";

export type SessionEntryStatus = "draft" | "submitted";

export type SessionEntry = {
  id: string;
  rawId?: string;
  sessionId: string;
  formCode: string;
  status: SessionEntryStatus;
  answers: Record<string, unknown>;
  progress: {
    answered: number;
    totalVisible: number;
    percent: number;
  };
  contextSnapshot?: SessionContext;
  version: number;
  createdAt: string;
  updatedAt: string;
  submittedAt: string | null;
  deletedAt: string | null;
};

export type SessionEntriesListResult = {
  items: SessionEntry[];
  pagination?: ApiPagination;
};

type SessionEntryApiShape = Omit<SessionEntry, "id"> & {
  id?: string;
  _id?: string;
};

export type SessionEntryProgress = SessionEntry["progress"];

function normalizeSessionEntry(
  item: SessionEntryApiShape,
  index?: number,
): SessionEntry {
  const stableId =
    item.id ??
    item._id ??
    `entry-${index ?? 0}-${item.updatedAt ?? item.createdAt ?? "unknown"}`;

  return {
    ...item,
    id: stableId,
    rawId: item._id ?? item.id ?? undefined,
  };
}

export async function listSessionEntries(params: {
  sessionId: string;
  formCode?: string;
  page?: number;
  limit?: number;
}): Promise<SessionEntriesListResult> {
  const { sessionId, ...query } = params;

  const envelope = await apiGet<ApiEnvelope<SessionEntryApiShape[]>>(
    `/api/v1/sessions/${sessionId}/entries`,
    {
      params: query,
      skipEnvelope: true,
    },
  );

  return {
    items: (envelope.data ?? []).map((item, index) =>
      normalizeSessionEntry(item, index),
    ),
    pagination: envelope.pagination,
  };
}

export async function createSessionEntry(params: {
  sessionId: string;
  formCode: string;
}) {
  const { sessionId, formCode } = params;
  return apiPost<{ id: string }>(`/api/v1/sessions/${sessionId}/entries`, {
    formCode,
  });
}

export async function getSessionEntry(params: {
  sessionId: string;
  entryId: string;
}) {
  const { sessionId, entryId } = params;
  const entry = await apiGet<SessionEntryApiShape>(
    `/api/v1/sessions/${sessionId}/entries/${entryId}`,
  );
  return normalizeSessionEntry(entry);
}

export async function getOrCreateFormEntry(params: {
  sessionId: string;
  formCode: string;
}) {
  const { sessionId, formCode } = params;
  const entry = await apiPost<SessionEntryApiShape>(
    `/api/v1/sessions/${sessionId}/forms/${formCode}/entry`,
    {},
  );
  return normalizeSessionEntry(entry);
}

export async function patchSessionEntry(params: {
  sessionId: string;
  entryId: string;
  expectedVersion: number;
  answers?: Record<string, unknown>;
  progress?: SessionEntryProgress;
  contextSnapshot?: Pick<
    SessionContext,
    "surveyorName" | "surveyorNameNIT" | "surveyDate"
  >;
}) {
  const { sessionId, entryId, ...body } = params;

  return apiPatch<{ id: string; version: number }>(
    `/api/v1/sessions/${sessionId}/entries/${entryId}`,
    body,
  );
}

export async function submitSessionEntry(params: {
  sessionId: string;
  entryId: string;
  expectedVersion: number;
}) {
  const { sessionId, entryId, expectedVersion } = params;

  return apiPost<{ id: string; status: SessionEntryStatus; version: number }>(
    `/api/v1/sessions/${sessionId}/entries/${entryId}/submit`,
    { expectedVersion },
  );
}

export async function deleteSessionEntry(params: {
  sessionId: string;
  entryId: string;
}) {
  const { sessionId, entryId } = params;

  return apiDelete<{ id: string }>(
    `/api/v1/sessions/${sessionId}/entries/${entryId}`,
  );
}
