import { adminGet } from "@/lib/api/admin-client";
import type { ApiEnvelope, ApiPagination } from "@/lib/api/envelope";
import type { SessionContext } from "@/lib/api/endpoints/sessions";

export type AdminFilters = {
  district?: string;
  block?: string;
  gramPanchayat?: string;
  formCode?: string;
  from?: string;
  to?: string;
};

export type AdminDashboardKpis = {
  totalSessions: number;
  totalEntries: number;
  avgProgressPercent: number;
  formsTouched: number;
  totalForms: number;
  entriesUpdatedLast7Days: number;
};

export type AdminFormProgressItem = {
  formCode: string;
  entryCount: number;
  avgPercent: number;
  completedCount: number;
  inProgressCount: number;
  notStartedCount: number;
};

export type AdminProgressBucket = {
  bucket: string;
  count: number;
};

export type AdminGeographyItem = {
  district: string;
  block: string;
  sessionCount: number;
  entryCount: number;
  avgPercent: number;
};

export type AdminTimelineItem = {
  date: string;
  entriesCreated: number;
  entriesUpdated: number;
};

export type AdminMiningSplitItem = {
  area: "direct" | "indirect";
  entryCount: number;
  avgPercent: number;
};

export type AdminDashboard = {
  kpis: AdminDashboardKpis;
  formProgress: AdminFormProgressItem[];
  progressBuckets: AdminProgressBucket[];
  geography: AdminGeographyItem[];
  timeline: AdminTimelineItem[];
  miningSplit: AdminMiningSplitItem[];
};

export type AdminSessionProgressRow = {
  sessionId: string;
  title: string;
  district: string;
  block: string;
  gramPanchayat: string;
  village: string;
  surveyDate: string;
  entryCount: number;
  formsTouched: number;
  avgProgressPercent: number;
  lastUpdatedAt: string;
};

export type AdminSessionsListResult = {
  items: AdminSessionProgressRow[];
  pagination?: ApiPagination;
};

export type AdminSessionDrillDownEntry = {
  id: string;
  formCode: string;
  percent: number;
  surveyorName: string;
  updatedAt: string;
};

export type AdminSessionFormProgress = {
  formCode: string;
  entryCount: number;
  avgPercent: number;
  latestUpdatedAt: string | null;
};

export type AdminSessionDrillDown = {
  session: {
    id: string;
    title: string;
    context: SessionContext;
    createdAt: string;
    updatedAt: string;
  };
  kpis: {
    entryCount: number;
    formsTouched: number;
    avgProgressPercent: number;
    totalForms: number;
  };
  formProgress: AdminSessionFormProgress[];
  entries: AdminSessionDrillDownEntry[];
};

function buildFilterParams(filters: AdminFilters) {
  const params: Record<string, string> = {};
  if (filters.district) params.district = filters.district;
  if (filters.block) params.block = filters.block;
  if (filters.gramPanchayat) params.gramPanchayat = filters.gramPanchayat;
  if (filters.formCode) params.formCode = filters.formCode;
  if (filters.from) params.from = filters.from;
  if (filters.to) params.to = filters.to;
  return params;
}

export async function getAdminDashboard(filters: AdminFilters = {}) {
  return adminGet<AdminDashboard>("/api/v1/admin/dashboard", {
    params: buildFilterParams(filters),
  });
}

export async function listAdminSessions(
  filters: AdminFilters = {},
  page = 1,
  limit = 10,
) {
  const envelope = await adminGet<ApiEnvelope<AdminSessionProgressRow[]>>(
    "/api/v1/admin/sessions",
    {
      params: { ...buildFilterParams(filters), page, limit },
      skipEnvelope: true,
    },
  );

  return {
    items: envelope.data ?? [],
    pagination: envelope.pagination,
  } satisfies AdminSessionsListResult;
}

export async function getAdminSessionDrillDown(sessionId: string) {
  return adminGet<AdminSessionDrillDown>(`/api/v1/admin/sessions/${sessionId}`);
}
