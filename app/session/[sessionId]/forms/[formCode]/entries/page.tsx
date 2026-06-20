"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, FileText, Loader2, Plus } from "lucide-react";
import { toast } from "sonner";

import Header from "@/components/Header";
import { FORM_CODES, getForm } from "@/components/forms/forms";
import { EntryCard } from "@/components/survey/entry-card";
import {
  useCreateSessionEntry,
  useDeleteSessionEntry,
  useSessionEntries,
} from "@/hooks/api/use-session-entries";
import { useSessionDetail, useSessionFormsSummary } from "@/hooks/api/use-sessions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { DraftSyncStatus } from "@/lib/storage/draft-store";
import { listDraftsBySession } from "@/lib/storage/draft-store";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const PAGE_SIZE = 9;

function fillPath(sessionId: string, formCode: string) {
  return `/fill/${formCode}/edit?sessionID=${sessionId}`;
}

function formatLocation(context: {
  block: string;
  gramPanchayat: string;
  village: string;
}) {
  return `${context.block} · GP ${context.gramPanchayat} · Village ${context.village}`;
}

export default function SessionFormEntriesPage() {
  const params = useParams<{ sessionId: string; formCode: string }>();
  const router = useRouter();
  const [deletingEntryId, setDeletingEntryId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [syncStateByEntryId, setSyncStateByEntryId] = useState<Record<string, DraftSyncStatus>>({});

  const sessionId = params?.sessionId;
  const rawFormCode = params?.formCode;
  const formCode = rawFormCode?.toUpperCase();
  const isValidFormCode = Boolean(formCode && FORM_CODES.includes(formCode));
  const form = isValidFormCode ? getForm(formCode as string) : undefined;

  const sessionQuery = useSessionDetail(sessionId);
  const formsSummaryQuery = useSessionFormsSummary(sessionId);
  const entriesQuery = useSessionEntries({
    sessionId: isValidFormCode ? sessionId : undefined,
    formCode: isValidFormCode ? formCode : undefined,
    page,
    limit: PAGE_SIZE,
  });
  const createEntryMutation = useCreateSessionEntry(sessionId);
  const deleteEntryMutation = useDeleteSessionEntry(sessionId, formCode);

  const entries = entriesQuery.data?.items ?? [];
  const formSummary = useMemo(
    () => formsSummaryQuery.data?.forms.find((item) => item.formCode === formCode),
    [formCode, formsSummaryQuery.data?.forms],
  );
  const totalCount = formSummary?.total ?? entriesQuery.data?.pagination?.total ?? entries.length;
  const pagination = entriesQuery.data?.pagination;
  const totalPages = pagination?.totalPages ?? 1;
  const currentPage = pagination?.page ?? page;
  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  useEffect(() => {
    if (!sessionId) return;
    let ignore = false;
    async function loadDraftStatuses() {
      const drafts = await listDraftsBySession(sessionId);
      if (ignore) return;
      const mapped = drafts.reduce<Record<string, DraftSyncStatus>>((acc, draft) => {
        acc[draft.entryId] = draft.syncStatus;
        return acc;
      }, {});
      setSyncStateByEntryId(mapped);
    }
    void loadDraftStatuses();
    return () => {
      ignore = true;
    };
  }, [sessionId, entriesQuery.data?.items]);

  const handleCreateEntry = async () => {
    if (!sessionId || !formCode) {
      toast.error("Invalid route. Missing session or form details.");
      return;
    }

    try {
      await createEntryMutation.mutateAsync({ formCode });
      toast.success("Draft entry created.");
      router.push(fillPath(sessionId, formCode));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Could not create entry.";
      toast.error(message);
    }
  };

  const handleDeleteEntry = async (entryId: string) => {
    try {
      setDeletingEntryId(entryId);
      await deleteEntryMutation.mutateAsync({ entryId });
      toast.success("Draft entry deleted.");
      if (entries.length === 1 && page > 1) {
        setPage((prev) => Math.max(1, prev - 1));
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Could not delete entry.";
      toast.error(message);
    } finally {
      setDeletingEntryId(null);
    }
  };

  if (!sessionId || !formCode || !isValidFormCode || !form) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto mt-6 max-w-[900px] pb-20">
          <section className="border border-border bg-card p-6">
            <h1 className="text-lg font-semibold text-foreground">Invalid form route</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              The requested session/form combination is not valid.
            </p>
            <Button asChild className="mt-4" variant="outline">
              <Link href="/">
                <ArrowLeft className="size-4" />
                Back to landing
              </Link>
            </Button>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto mt-6 max-w-[1240px] pb-24">
        <section className="rounded-none border border-border bg-card p-4">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <Button asChild className="mb-3" variant="outline" size="sm">
                <Link href={`/?sessionId=${sessionId}`}>
                  <ArrowLeft className="size-4" />
                  Back to forms
                </Link>
              </Button>

              <div className="mb-2 flex items-center gap-2">
                <Badge variant="outline" className="border-border bg-muted font-semibold">
                  Form {form.code}
                </Badge>
                <FileText className="size-4 text-muted-foreground" />
              </div>

              <h1 className="text-2xl font-semibold text-foreground">{form.title.en}</h1>
              <p className="mt-1 text-sm text-muted-foreground">{form.title.hi}</p>

              {sessionQuery.data ? (
                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <Badge
                    variant="outline"
                    className="border-border bg-muted text-foreground"
                  >
                    SESSION
                  </Badge>
                  <span>{sessionQuery.data.title}</span>
                  <span>·</span>
                  <span>{formatLocation(sessionQuery.data.context)}</span>
                </div>
              ) : null}
            </div>

            <Button
              onClick={handleCreateEntry}
              className="h-10 bg-primary px-4 text-primary-foreground hover:bg-primary/90"
              disabled={createEntryMutation.isPending}
            >
              {createEntryMutation.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Plus className="size-4" />
              )}
              Create New Entry
            </Button>
          </div>

          <div className="mt-4 border border-border bg-muted px-4 py-2 text-center text-[11px] sm:max-w-xs">
            <p className="font-semibold text-foreground">{totalCount}</p>
            <p className="text-muted-foreground">Entries</p>
          </div>
        </section>

        <section className="mt-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">
              Entries ({totalCount})
            </h2>
            <p className="text-xs text-muted-foreground">
              Entries autosave as you edit
            </p>
          </div>

          {entriesQuery.isLoading ? (
            <div className="flex items-center gap-2 border border-border bg-card p-6 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              Loading entries...
            </div>
          ) : null}

          {entriesQuery.isError ? (
            <div className="border border-border bg-card p-6">
              <p className="text-sm text-destructive">
                Could not load entries for this form.
              </p>
            </div>
          ) : null}

          {!entriesQuery.isLoading && !entriesQuery.isError && entries.length === 0 ? (
            <article className="border border-dashed border-border bg-card p-8 text-center">
              <ClipboardListPlaceholder />
              <h3 className="mt-3 text-sm font-semibold text-foreground">
                No entries yet
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Create your first draft entry for Form {form.code}.
              </p>
              <Button
                onClick={handleCreateEntry}
                className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={createEntryMutation.isPending}
              >
                {createEntryMutation.isPending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Plus className="size-4" />
                )}
                Create New Entry
              </Button>
            </article>
          ) : null}

          {!entriesQuery.isLoading && !entriesQuery.isError && entries.length > 0 ? (
            <>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {entries.map((entry, index) => {
                  const stableEntryId =
                    entry.id ||
                    entry.rawId ||
                    `entry-${index}-${entry.updatedAt ?? entry.createdAt ?? "unknown"}`;
                  const isDeleting =
                    deletingEntryId === stableEntryId && deleteEntryMutation.isPending;

                  return (
                    <EntryCard
                      key={stableEntryId}
                      entry={entry}
                      entryLabel={`Entry #${stableEntryId.slice(-6)}`}
                      isDeleting={isDeleting}
                      syncStatus={syncStateByEntryId[stableEntryId]}
                      onOpen={() =>
                        router.push(fillPath(sessionId, formCode))
                      }
                      onDelete={
                        entry.status === "draft"
                          ? () => handleDeleteEntry(stableEntryId)
                          : undefined
                      }
                    />
                  );
                })}
              </div>

              {totalPages > 1 ? (
                <div className="mt-6 border border-border bg-card px-4 py-3">
                  <div className="mb-2 text-center text-xs text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </div>
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          className={!hasPrev ? "pointer-events-none opacity-50" : undefined}
                          onClick={(event) => {
                            event.preventDefault();
                            if (!hasPrev) return;
                            setPage((prev) => Math.max(1, prev - 1));
                          }}
                        />
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          className={!hasNext ? "pointer-events-none opacity-50" : undefined}
                          onClick={(event) => {
                            event.preventDefault();
                            if (!hasNext) return;
                            setPage((prev) => Math.min(totalPages, prev + 1));
                          }}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              ) : null}
            </>
          ) : null}
        </section>
      </main>
    </div>
  );
}

function ClipboardListPlaceholder() {
  return (
    <div className="mx-auto flex size-10 items-center justify-center border border-border bg-muted">
      <FileText className="size-5 text-muted-foreground" />
    </div>
  );
}
