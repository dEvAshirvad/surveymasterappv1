export const queryKeys = {
  sessions: {
    all: ["sessions"] as const,
    list: () => ["sessions", "list"] as const,
    search: (district?: string, block?: string, gramPanchayat?: string) =>
      ["sessions", "search", district ?? "", block ?? "", gramPanchayat ?? ""] as const,
    districtOptions: () => ["sessions", "options", "districts"] as const,
    blockOptions: (district?: string) =>
      ["sessions", "options", "blocks", district ?? ""] as const,
    gramPanchayatOptions: (district?: string, block?: string) =>
      ["sessions", "options", "gram-panchayats", district ?? "", block ?? ""] as const,
    detail: (id: string) => ["sessions", id] as const,
    formsSummary: (id: string) => ["sessions", id, "forms-summary"] as const,
  },
  entries: {
    bySessionForm: (
      sessionId: string,
      formCode: string,
      page = 1,
      limit = 10,
    ) => ["entries", sessionId, formCode, page, limit] as const,
    detail: (sessionId: string, entryId: string) =>
      ["entry", sessionId, entryId] as const,
  },
} as const;
