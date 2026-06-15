import { apiGet, apiPatch, apiPost } from "@/lib/api/client";

export type SessionContext = {
  district: string;
  block: string;
  gramPanchayat: string;
  village: string;
  surveyDate: string;
  totalPopulation: number;
  totalHouseholds: number;
  scHouseholds: number;
  stHouseholds: number;
  miningAffectedArea: "direct" | "indirect";
  surveyorName: string;
  surveyorNameNIT: string;
};

export type SessionListItem = {
  id: string;
  title: string;
  context: SessionContext;
  createdAt: string;
  updatedAt: string;
};

export type SessionDetail = SessionListItem & {
  forms: [];
  summary: {
    formCount: number;
    entryCount: number;
  };
};

export type SessionFormsSummaryItem = {
  formCode: string;
  total: number;
  draft: number;
  submitted: number;
};

export type SessionFormsSummary = {
  sessionId: string;
  forms: SessionFormsSummaryItem[];
};

export type SessionSearchFilters = {
  district?: string;
  block?: string;
  gramPanchayat?: string;
};

export type CreateSessionPayload = {
  title: string;
  context: SessionContext;
};

export type UpdateSessionPayload = CreateSessionPayload;

export async function listSessions(params?: { page?: number; limit?: number }) {
  return apiGet<SessionListItem[]>("/api/v1/sessions", { params });
}

export async function getSessionDetail(sessionId: string) {
  return apiGet<SessionDetail>(`/api/v1/sessions/${sessionId}`);
}

export async function getSessionFormsSummary(sessionId: string) {
  return apiGet<SessionFormsSummary>(`/api/v1/sessions/${sessionId}/forms-summary`);
}

export async function createSession(payload: CreateSessionPayload) {
  return apiPost<{ id: string }>("/api/v1/sessions", payload);
}

export async function updateSession(
  sessionId: string,
  payload: UpdateSessionPayload,
) {
  return apiPatch<SessionDetail>(`/api/v1/sessions/${sessionId}`, payload);
}

export async function listSessionDistrictOptions() {
  return apiGet<string[]>("/api/v1/sessions/options/districts");
}

export async function listSessionBlockOptions(district: string) {
  return apiGet<string[]>("/api/v1/sessions/options/blocks", {
    params: { district },
  });
}

export async function listSessionGramPanchayatOptions(
  district: string,
  block: string,
) {
  return apiGet<string[]>("/api/v1/sessions/options/gram-panchayats", {
    params: { district, block },
  });
}

export async function searchSessions(filters: SessionSearchFilters) {
  return apiGet<SessionListItem[]>("/api/v1/sessions/search", {
    params: filters,
  });
}
