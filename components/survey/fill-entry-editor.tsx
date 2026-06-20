"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";

import {
  buildOrderedFormQuestions,
  getPrimaryAnswerValue,
  getVisibleQuestions,
  type FormDef,
  type Question,
} from "@/components/forms/types";
import { FillPageHeader } from "@/components/survey/fill-page-header";
import { FillFormNavControls } from "@/components/survey/fill-form-nav";
import { FormNoteCallout } from "@/components/survey/form-note-callout";
import { FormTable } from "@/components/survey/form-table";
import { SessionMetaBar } from "@/components/survey/session-meta-bar";
import {
  useSessionEntriesByFormCodes,
} from "@/hooks/api/use-session-entries";
import type { EntryAnswerItem } from "@/lib/api/endpoints/session-entries";
import type { SessionContext } from "@/lib/api/endpoints/sessions";
import type { SessionEntry } from "@/lib/api/endpoints/session-entries";
import { Button } from "@/components/ui/button";
import {
  getDraft,
  getDraftAnswersByFormCodes,
  makeDraftId,
  upsertDraft,
} from "@/lib/storage/draft-store";
import { enqueueOutboxItem } from "@/lib/storage/outbox-store";
import { isOnline } from "@/lib/sync/connectivity";
import { flushSyncOutbox } from "@/lib/sync/sync-engine";

type SaveState =
  | "idle"
  | "saving"
  | "syncing"
  | "saved"
  | "error"
  | "conflict"
  | "queued"
  | "offline";
const CROSS_SECTOR_CODES = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N"];

type EditableContextSnapshot = Pick<
  SessionContext,
  "surveyorName" | "surveyorNameNIT" | "surveyDate"
>;

function pickEditableContextSnapshot(context: SessionContext): EditableContextSnapshot {
  return {
    surveyorName: context.surveyorName,
    surveyorNameNIT: context.surveyorNameNIT,
    surveyDate: context.surveyDate,
  };
}

function mergeSessionContextWithSnapshot(
  sessionContext: SessionContext,
  snapshot?: Partial<SessionContext>,
): SessionContext {
  if (!snapshot) return sessionContext;
  return { ...sessionContext, ...snapshot };
}

function serializeAnswersForPatch(
  form: FormDef,
  answers: EntryAnswerItem[],
): EntryAnswerItem[] {
  return buildOrderedFormQuestions(form).map((item) => {
    const existing = answers[item.storageIndex];
    return {
      title: existing?.title ?? item.question.title,
      uom: existing?.uom ?? item.question.uom,
      answer: existing?.answer ?? "",
    };
  });
}

function isQuestionAnswered(question: Question, value: unknown) {
  if (question.type === "matrix" || question.type === "small_matrix") {
    if (!value || typeof value !== "object") return false;

    return Object.values(value as Record<string, Record<string, string>>).some((row) =>
      Object.values(row ?? {}).some((cell) => String(cell ?? "").trim().length > 0),
    );
  }

  if (question.type === "facility_group") {
    if (!value || typeof value !== "object") return false;

    const facilities = question.facilities ?? [];
    if (facilities.length === 0) return false;

    const typed = value as Record<string, { available?: string; distanceKm?: string }>;
    return facilities.every((facility) => {
      const entry = typed[facility.key];
      if (!entry?.available) return false;
      if (entry.available === "No") {
        return String(entry.distanceKm ?? "").trim().length > 0;
      }
      return true;
    });
  }

  if (question.type === "facility_inputs") {
    if (!value || typeof value !== "object") return false;

    const facilities = question.facilities ?? [];
    if (facilities.length === 0) return false;

    const typed = value as Record<string, string>;
    return facilities.every((facility) => String(typed[facility.key] ?? "").trim().length > 0);
  }

  if (question.type === "tiered_access") {
    if (!value || typeof value !== "object") return false;
    const facilities = question.facilities ?? [];
    if (facilities.length === 0) return false;

    const typed = value as Record<
      string,
      { available?: string; managementType?: string; distanceKm?: string }
    >;
    return facilities.every((facility) => {
      const entry = typed[facility.key];
      if (!entry?.available) return false;
      if (entry.available === "Yes") {
        return String(entry.managementType ?? "").trim().length > 0;
      }
      if (entry.available === "No") {
        return String(entry.distanceKm ?? "").trim().length > 0;
      }
      return false;
    });
  }

  if (question.type === "duration") {
    if (!value || typeof value !== "object") return false;

    const typed = value as { hours?: string; minutes?: string };
    return (
      String(typed.hours ?? "").trim().length > 0
      || String(typed.minutes ?? "").trim().length > 0
    );
  }

  if (typeof value === "number") {
    return Number.isFinite(value);
  }

  if (typeof value === "string") {
    return value.trim().length > 0;
  }

  if (question.type === "conditional_options") {
    if (!value || typeof value !== "object") return false;

    const typed = value as { primary?: unknown; detail?: unknown };
    const primary = typeof typed.primary === "string" ? typed.primary : "";
    if (!primary) return false;

    const activeRule = question.conditionalRules?.find(
      (rule) => rule.triggerValue === primary,
    );
    if (!activeRule) return true;

    if (activeRule.detail.mode === "multi") {
      return Array.isArray(typed.detail) && typed.detail.length > 0;
    }

    if (
      activeRule.detail.mode === "single" ||
      activeRule.detail.mode === "text" ||
      activeRule.detail.mode === "dropdown" ||
      activeRule.detail.mode === "date" ||
      activeRule.detail.mode === "number"
    ) {
      return typeof typed.detail === "string" && typed.detail.trim().length > 0;
    }

    if (activeRule.detail.mode === "inputs") {
      const facilities = activeRule.detail.facilities ?? [];
      if (facilities.length === 0) return false;
      if (!typed.detail || typeof typed.detail !== "object" || Array.isArray(typed.detail)) {
        return false;
      }
      const detailRecord = typed.detail as Record<string, string>;
      return facilities.every(
        (facility) => String(detailRecord[facility.key] ?? "").trim().length > 0,
      );
    }

    if (activeRule.detail.mode === "small_matrix") {
      if (!typed.detail || typeof typed.detail !== "object" || Array.isArray(typed.detail)) {
        return false;
      }
      return Object.values(typed.detail as Record<string, Record<string, string>>).some((row) =>
        Object.values(row ?? {}).some((cell) => String(cell ?? "").trim().length > 0),
      );
    }
  }

  return false;
}

function computeProgress(form: FormDef, answers: EntryAnswerItem[]) {
  const orderedQuestions = buildOrderedFormQuestions(form);
  const answerByLegacyQid: Record<string, unknown> = {};

  orderedQuestions.forEach((item) => {
    answerByLegacyQid[item.question.qid] = answers[item.storageIndex]?.answer;
  });

  const visibilityAnswers: Record<string, unknown> = {};

  for (const [qid, value] of Object.entries(answerByLegacyQid)) {
    const primary = getPrimaryAnswerValue(value);
    if (primary) {
      visibilityAnswers[qid] = primary;
    }
  }

  const visibleQuestions = getVisibleQuestions(form.order, visibilityAnswers);
  const answered = visibleQuestions.filter((question) =>
    isQuestionAnswered(question, answerByLegacyQid[question.qid]),
  ).length;
  const totalVisible = visibleQuestions.length;
  const percent = totalVisible > 0 ? Math.round((answered / totalVisible) * 100) : 0;

  return { answered, totalVisible, percent };
}

function sectionSlug(formCode: string) {
  return `section-${formCode.toLowerCase()}`;
}

export type FillEntryEditorProps = {
  sessionId: string;
  section: string;
  entry: SessionEntry;
  form: FormDef;
  context: SessionContext;
  topContent?: ReactNode;
  onRefetchEntry?: () => Promise<{ data?: SessionEntry }>;
};

export function FillEntryEditor({
  sessionId,
  section,
  entry,
  form,
  context,
  topContent,
}: FillEntryEditorProps) {
  const [localSourceAnswersByFormCode, setLocalSourceAnswersByFormCode] = useState<
    Record<string, EntryAnswerItem[]>
  >({});
  const crossSectorEntries = useSessionEntriesByFormCodes(
    sessionId,
    form.code === "O" ? CROSS_SECTOR_CODES : [],
    localSourceAnswersByFormCode,
  );

  const [answers, setAnswers] = useState<EntryAnswerItem[]>(
    () => entry.answers ?? [],
  );
  const [contextSnapshot, setContextSnapshot] = useState<SessionContext>(
    () => mergeSessionContextWithSnapshot(context, entry.contextSnapshot),
  );
  const [version, setVersion] = useState<number>(entry.version);
  const [saveState, setSaveState] = useState<SaveState>("idle");

  const autosaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const lastSavedSnapshotRef = useRef<string>(
    JSON.stringify({
      answers: serializeAnswersForPatch(form, entry.answers ?? []),
      contextSnapshot: pickEditableContextSnapshot(
        mergeSessionContextWithSnapshot(context, entry.contextSnapshot),
      ),
    }),
  );
  const expectedSection = sectionSlug(form.code);

  const liveProgress = useMemo(() => computeProgress(form, answers), [answers, form]);

  useEffect(() => {
    let ignore = false;

    async function hydrateDraft() {
      const localDraft = await getDraft(sessionId, entry.id);
      if (ignore || !localDraft) return;

      setAnswers(localDraft.answers);
      setContextSnapshot(localDraft.context);
      setVersion(localDraft.version);
      setSaveState(localDraft.syncStatus === "synced" ? "saved" : localDraft.syncStatus);
      lastSavedSnapshotRef.current = JSON.stringify({
        answers: serializeAnswersForPatch(form, localDraft.answers),
        contextSnapshot: pickEditableContextSnapshot(localDraft.context),
      });
    }

    void hydrateDraft();
    return () => {
      ignore = true;
    };
  }, [entry.id, form, sessionId]);

  useEffect(() => {
    if (form.code !== "O") return;
    let ignore = false;

    async function hydrateCrossSectorAnswers() {
      const local = await getDraftAnswersByFormCodes(sessionId, CROSS_SECTOR_CODES);
      if (!ignore) {
        setLocalSourceAnswersByFormCode(local);
      }
    }

    void hydrateCrossSectorAnswers();
    return () => {
      ignore = true;
    };
  }, [form.code, sessionId, answers]);

  useEffect(() => {
    const editableContextSnapshot = pickEditableContextSnapshot(contextSnapshot);
    const serializedAnswers = serializeAnswersForPatch(form, answers);
    const currentSnapshot = JSON.stringify({
      answers: serializedAnswers,
      contextSnapshot: editableContextSnapshot,
    });
    if (currentSnapshot === lastSavedSnapshotRef.current) return;

    if (autosaveTimerRef.current) {
      clearTimeout(autosaveTimerRef.current);
    }

    setSaveState(isOnline() ? "saving" : "offline");

    autosaveTimerRef.current = setTimeout(async () => {
      try {
        const nextProgress = computeProgress(form, answers);
        await upsertDraft({
          sessionId,
          entryId: entry.id,
          formCode: entry.formCode,
          answers: serializedAnswers,
          progress: nextProgress,
          context: contextSnapshot,
          version,
          syncStatus: isOnline() ? "queued" : "offline",
        });

        await enqueueOutboxItem({
          draftId: makeDraftId(sessionId, entry.id),
          sessionId,
          entryId: entry.id,
          formCode: entry.formCode,
          expectedVersion: version,
          answers: serializedAnswers,
          progress: nextProgress,
          contextSnapshot: editableContextSnapshot,
        });

        lastSavedSnapshotRef.current = currentSnapshot;
        if (!isOnline()) {
          setSaveState("offline");
          return;
        }

        setSaveState("queued");
        const flushResult = await flushSyncOutbox();
        const nextVersion = flushResult.latestVersionByDraftId[makeDraftId(sessionId, entry.id)];
        if (nextVersion !== undefined) {
          setVersion(nextVersion);
          setSaveState("saved");
        } else if (flushResult.failed > 0) {
          setSaveState("error");
        } else {
          setSaveState("queued");
        }
      } catch (error) {
        setSaveState(isOnline() ? "error" : "offline");
        const message = error instanceof Error ? error.message : "Autosave failed.";
        toast.error(message);
      }
    }, 800);

    return () => {
      if (autosaveTimerRef.current) {
        clearTimeout(autosaveTimerRef.current);
      }
    };
  }, [
    answers,
    contextSnapshot,
    entry.formCode,
    entry.id,
    form,
    sessionId,
    version,
  ]);

  const handleAnswerChange = (
    storageIndex: number,
    question: Question,
    nextValue: unknown,
  ) => {
    if (storageIndex < 0) return;

    setAnswers((previous) => {
      const next = [...previous];
      next[storageIndex] = {
        title: question.title,
        uom: question.uom,
        answer: nextValue,
      };
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-[1240px] pb-24">
        <FillPageHeader
          sessionId={sessionId}
          form={form}
          context={contextSnapshot}
          progress={liveProgress}
          saveState={saveState}
        />

        {topContent ? <div className="mt-4">{topContent}</div> : null}

        <div className="space-y-4 mt-4">
          <SessionMetaBar
            context={contextSnapshot}
            editableContext={pickEditableContextSnapshot(contextSnapshot)}
            onEditableContextChange={(next) => {
              setContextSnapshot((previous) => ({ ...previous, ...next }));
            }}
          />
          <FormNoteCallout note={form.note} />

          {section !== expectedSection ? (
            <p className="text-xs text-destructive">
              Route section does not match form code. Expected {expectedSection}.
            </p>
          ) : null}

          <FormTable
            form={form}
            answers={answers}
            sourceAnswersByFormCode={crossSectorEntries.dataByFormCode}
            onAnswerChange={handleAnswerChange}
          />

          <div className="flex justify-end border border-border bg-card px-4 py-4">
            <FillFormNavControls sessionId={sessionId} formCode={form.code} variant="footer" />
          </div>
        </div>
      </main>
    </div>
  );
}

export function FillPageLoading() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto mt-6 max-w-[900px] pb-24">
        <section className="border border-border bg-card p-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            Loading entry...
          </div>
        </section>
      </main>
    </div>
  );
}

export function FillPageError({ message }: { message: string }) {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto mt-6 max-w-[900px] pb-24">
        <section className="border border-border bg-card p-6">
          <h1 className="text-lg font-semibold text-foreground">Could not load form</h1>
          <p className="mt-2 text-sm text-muted-foreground">{message}</p>
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
