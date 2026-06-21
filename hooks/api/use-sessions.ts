"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createSession,
  type CreateSessionPayload,
  getSessionDetail,
  getSessionFormsSummary,
  listSessionBlockOptions,
  listSessionDistrictOptions,
  listSessionGramPanchayatOptions,
  listSessions,
  searchSessions,
  type SessionSearchFilters,
  type UpdateSessionPayload,
  updateSession,
} from "@/lib/api/endpoints/sessions";
import { queryKeys } from "@/lib/api/query-keys";

export function useSessions() {
  return useQuery({
    queryKey: queryKeys.sessions.list(),
    queryFn: () => listSessions(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useSessionSearch(filters: SessionSearchFilters) {
  return useQuery({
    queryKey: queryKeys.sessions.search(
      filters.district,
      filters.block,
      filters.gramPanchayat,
    ),
    enabled: Boolean(filters.district || filters.block || filters.gramPanchayat),
    queryFn: () => searchSessions(filters),
    staleTime: 2 * 60 * 1000,
  });
}

export function useSessionDistrictOptions() {
  return useQuery({
    queryKey: queryKeys.sessions.districtOptions(),
    queryFn: listSessionDistrictOptions,
    staleTime: 0,
    refetchOnMount: "always",
  });
}

export function useSessionBlockOptions(district?: string) {
  return useQuery({
    queryKey: queryKeys.sessions.blockOptions(district),
    enabled: Boolean(district),
    queryFn: () => listSessionBlockOptions(district as string),
    staleTime: 0,
    refetchOnMount: "always",
  });
}

export function useSessionGramPanchayatOptions(district?: string, block?: string) {
  return useQuery({
    queryKey: queryKeys.sessions.gramPanchayatOptions(district, block),
    enabled: Boolean(district && block),
    queryFn: () => listSessionGramPanchayatOptions(district as string, block as string),
    staleTime: 0,
    refetchOnMount: "always",
  });
}

export function useSessionDetail(sessionId?: string) {
  return useQuery({
    queryKey: sessionId ? queryKeys.sessions.detail(sessionId) : ["sessions", "disabled"],
    enabled: Boolean(sessionId),
    queryFn: () => getSessionDetail(sessionId as string),
    staleTime: 5 * 60 * 1000,
  });
}

export function useSessionFormsSummary(sessionId?: string) {
  return useQuery({
    queryKey: sessionId
      ? queryKeys.sessions.formsSummary(sessionId)
      : ["sessions", "forms-summary", "disabled"],
    enabled: Boolean(sessionId),
    queryFn: () => getSessionFormsSummary(sessionId as string),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateSessionPayload) => createSession(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.sessions.list(),
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.sessions.search(),
      });
    },
  });
}

export function useUpdateSession(sessionId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateSessionPayload) => updateSession(sessionId, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.sessions.list(),
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.sessions.search(),
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.sessions.detail(sessionId),
      });
    },
  });
}
