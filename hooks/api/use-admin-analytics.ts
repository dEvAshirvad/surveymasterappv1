"use client";

import { useQuery } from "@tanstack/react-query";

import type { AdminFilters } from "@/lib/api/endpoints/admin";
import {
  getAdminDashboard,
  getAdminSessionDrillDown,
  listAdminSessions,
} from "@/lib/api/endpoints/admin";
import { queryKeys } from "@/lib/api/query-keys";

function filtersKey(filters: AdminFilters) {
  return {
    district: filters.district,
    block: filters.block,
    gramPanchayat: filters.gramPanchayat,
    formCode: filters.formCode,
    from: filters.from,
    to: filters.to,
  };
}

export function useAdminDashboard(filters: AdminFilters = {}) {
  const key = filtersKey(filters);
  return useQuery({
    queryKey: queryKeys.admin.dashboard(key),
    queryFn: () => getAdminDashboard(filters),
    staleTime: 5 * 60 * 1000,
    refetchOnReconnect: false,
  });
}

export function useAdminSessions(
  filters: AdminFilters = {},
  page = 1,
  limit = 10,
) {
  const key = filtersKey(filters);
  return useQuery({
    queryKey: queryKeys.admin.sessions(key, page, limit),
    queryFn: () => listAdminSessions(filters, page, limit),
    staleTime: 2 * 60 * 1000,
    refetchOnReconnect: false,
  });
}

export function useAdminSessionDrillDown(sessionId?: string) {
  return useQuery({
    queryKey: sessionId
      ? queryKeys.admin.sessionDetail(sessionId)
      : ["admin", "session", "disabled"],
    enabled: Boolean(sessionId),
    queryFn: () => getAdminSessionDrillDown(sessionId as string),
    staleTime: 2 * 60 * 1000,
  });
}
