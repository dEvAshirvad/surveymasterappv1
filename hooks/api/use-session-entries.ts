"use client";

import { useMutation, useQueries, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createSessionEntry,
  deleteSessionEntry,
  type EntryAnswerItem,
  getSessionEntry,
  getOrCreateFormEntry,
  listSessionEntries,
  patchSessionEntry,
  type SessionEntryProgress,
  type SessionEntry,
} from "@/lib/api/endpoints/session-entries";
import { queryKeys } from "@/lib/api/query-keys";

export function useSessionEntries(params: {
  sessionId?: string;
  formCode?: string;
  page?: number;
  limit?: number;
}) {
  const { sessionId, formCode, page, limit } = params;
  const enabled = Boolean(sessionId && formCode);
  const pageNumber = page ?? 1;
  const pageLimit = limit ?? 10;

  return useQuery({
    queryKey:
      sessionId && formCode
        ? queryKeys.entries.bySessionForm(sessionId, formCode, pageNumber, pageLimit)
        : ["entries", "disabled"],
    enabled,
    queryFn: () =>
      listSessionEntries({
        sessionId: sessionId as string,
        formCode,
        page: pageNumber,
        limit: pageLimit,
      }),
    staleTime: 2 * 60 * 1000,
  });
}

export function useSessionEntriesByFormCodes(
  sessionId: string | undefined,
  formCodes: string[],
  localByFormCode: Record<string, EntryAnswerItem[]> = {},
) {
  const normalizedCodes = [...new Set(formCodes.map((code) => code.toUpperCase()))];
  const queryResults = useQueries({
    queries: normalizedCodes.map((formCode) => ({
      queryKey: sessionId
        ? queryKeys.entries.bySessionForm(sessionId, formCode, 1, 1)
        : ["entries", "disabled", formCode],
      enabled: Boolean(sessionId) && !(localByFormCode[formCode]?.length),
      queryFn: () =>
        listSessionEntries({
          sessionId: sessionId as string,
          formCode,
          page: 1,
          limit: 1,
        }),
      staleTime: 15 * 60 * 1000,
    })),
  });

  const dataByFormCode = normalizedCodes.reduce<Record<string, EntryAnswerItem[]>>(
    (acc, formCode, index) => {
      const local = localByFormCode[formCode];
      acc[formCode] = local?.length
        ? local
        : queryResults[index].data?.items?.[0]?.answers ?? [];
      return acc;
    },
    {},
  );

  return {
    dataByFormCode,
    isLoading: queryResults.some((result) => result.isLoading),
    isError: queryResults.some((result) => result.isError),
  };
}

export function useCreateSessionEntry(sessionId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ formCode }: { formCode: string }) => {
      if (!sessionId) {
        throw new Error("No active session selected.");
      }
      return createSessionEntry({ sessionId, formCode });
    },
    onSuccess: (_, variables) => {
      if (!sessionId) return;

      void queryClient.invalidateQueries({
        queryKey: ["entries", sessionId, variables.formCode],
      });
    },
  });
}

export function useSessionEntry(sessionId?: string, entryId?: string) {
  const enabled = Boolean(sessionId && entryId);

  return useQuery({
    queryKey:
      sessionId && entryId
        ? queryKeys.entries.detail(sessionId, entryId)
        : ["entry", "disabled"],
    enabled,
    queryFn: () =>
      getSessionEntry({
        sessionId: sessionId as string,
        entryId: entryId as string,
      }),
    staleTime: 30 * 60 * 1000,
  });
}

export function useGetOrCreateFormEntry(sessionId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ formCode }: { formCode: string }) => {
      if (!sessionId) {
        throw new Error("No active session selected.");
      }
      return getOrCreateFormEntry({ sessionId, formCode });
    },
    onSuccess: (entry, variables) => {
      if (!sessionId) return;

      queryClient.setQueryData(queryKeys.entries.detail(sessionId, entry.id), entry);
      void queryClient.invalidateQueries({
        queryKey: ["entries", sessionId, variables.formCode],
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.sessions.formsSummary(sessionId),
      });
    },
  });
}

export function usePatchSessionEntry(sessionId?: string, entryId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: {
      expectedVersion: number;
      answers?: EntryAnswerItem[];
      progress?: SessionEntryProgress;
      contextSnapshot?: {
        surveyorName: string;
        surveyorNameNIT: string;
        surveyDate: string;
      };
      formCode?: string;
    }) => {
      if (!sessionId || !entryId) {
        throw new Error("Missing session or entry id.");
      }

      return patchSessionEntry({
        sessionId,
        entryId,
        expectedVersion: input.expectedVersion,
        answers: input.answers,
        progress: input.progress,
        contextSnapshot: input.contextSnapshot,
      });
    },
    onSuccess: (result, variables) => {
      if (!sessionId || !entryId) return;

      queryClient.setQueryData(
        queryKeys.entries.detail(sessionId, entryId),
        (previous: SessionEntry | undefined) => {
          if (!previous) return previous;
          return {
            ...previous,
            version: result.version,
            answers: variables.answers ?? previous.answers,
            progress: variables.progress ?? previous.progress,
            contextSnapshot: variables.contextSnapshot
              ? { ...previous.contextSnapshot, ...variables.contextSnapshot }
              : previous.contextSnapshot,
            updatedAt: new Date().toISOString(),
          };
        },
      );

      if (variables.formCode) {
        void queryClient.invalidateQueries({
          queryKey: ["entries", sessionId, variables.formCode],
        });
      }
    },
  });
}

export function useDeleteSessionEntry(sessionId?: string, formCode?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ entryId }: { entryId: string }) => {
      if (!sessionId) {
        throw new Error("Missing session id.");
      }

      return deleteSessionEntry({ sessionId, entryId });
    },
    onSuccess: () => {
      if (!sessionId || !formCode) return;

      void queryClient.invalidateQueries({
        queryKey: ["entries", sessionId, formCode],
      });
    },
  });
}
