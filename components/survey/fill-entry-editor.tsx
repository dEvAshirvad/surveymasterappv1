"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";

import {
  getPrimaryAnswerValue,
  getVisibleQuestions,
  type FormDef,
  type Question,
} from "@/components/forms/types";
import { FillPageHeader } from "@/components/survey/fill-page-header";
import { FormNoteCallout } from "@/components/survey/form-note-callout";
import { FormTable } from "@/components/survey/form-table";
import { SessionMetaBar } from "@/components/survey/session-meta-bar";
import {
  usePatchSessionEntry,
  useSubmitSessionEntry,
} from "@/hooks/api/use-session-entries";
import type { SessionContext } from "@/lib/api/endpoints/sessions";
import type { SessionEntry } from "@/lib/api/endpoints/session-entries";
import { ApiError } from "@/lib/api/envelope";
import { Button } from "@/components/ui/button";

type SaveState = "idle" | "saving" | "saved" | "error" | "conflict";

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
  }

  return false;
}

function computeProgress(form: FormDef, answers: Record<string, unknown>) {
  const visibilityAnswers: Record<string, unknown> = {};

  for (const [qid, value] of Object.entries(answers)) {
    const primary = getPrimaryAnswerValue(value);
    if (primary) {
      visibilityAnswers[qid] = primary;
    }
  }

  const visibleQuestions = getVisibleQuestions(form.order, visibilityAnswers);
  const answered = visibleQuestions.filter((question) =>
    isQuestionAnswered(question, answers[question.qid]),
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
  onRefetchEntry: () => Promise<{ data?: SessionEntry }>;
};

export function FillEntryEditor({
  sessionId,
  section,
  entry,
  form,
  context,
  topContent,
  onRefetchEntry,
}: FillEntryEditorProps) {
  const router = useRouter();
  const patchMutation = usePatchSessionEntry(sessionId, entry.id);
  const submitMutation = useSubmitSessionEntry(sessionId, entry.id);

  const [answers, setAnswers] = useState<Record<string, unknown>>(
    () => entry.answers ?? {},
  );
  const [contextSnapshot, setContextSnapshot] = useState<SessionContext>(
    () => entry.contextSnapshot ?? context,
  );
  const [version, setVersion] = useState<number>(entry.version);
  const [saveState, setSaveState] = useState<SaveState>("idle");

  const autosaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSavedSnapshotRef = useRef<string>(
    JSON.stringify({
      answers: entry.answers ?? {},
      contextSnapshot: pickEditableContextSnapshot(entry.contextSnapshot ?? context),
    }),
  );
  const expectedSection = sectionSlug(form.code);
  const isSubmitted = entry.status === "submitted";

  const liveProgress = useMemo(() => computeProgress(form, answers), [answers, form]);

  useEffect(() => {
    if (isSubmitted) return;

    const editableContextSnapshot = pickEditableContextSnapshot(contextSnapshot);
    const currentSnapshot = JSON.stringify({
      answers,
      contextSnapshot: editableContextSnapshot,
    });
    if (currentSnapshot === lastSavedSnapshotRef.current) return;

    if (autosaveTimerRef.current) {
      clearTimeout(autosaveTimerRef.current);
    }

    setSaveState("saving");

    autosaveTimerRef.current = setTimeout(async () => {
      try {
        const nextProgress = computeProgress(form, answers);
        const patched = await patchMutation.mutateAsync({
          expectedVersion: version,
          answers,
          progress: nextProgress,
          contextSnapshot: editableContextSnapshot,
          formCode: entry.formCode,
        });

        setVersion(patched.version);
        lastSavedSnapshotRef.current = currentSnapshot;
        setSaveState("saved");
      } catch (error) {
        if (error instanceof ApiError && error.code === "VERSION_CONFLICT") {
          const latest = await onRefetchEntry();
          const latestEntry = latest.data;

          if (latestEntry) {
            setVersion(latestEntry.version);
            setAnswers((previous) => ({
              ...(latestEntry.answers ?? {}),
              ...previous,
            }));
            setContextSnapshot((previous) => ({
              ...(latestEntry.contextSnapshot ?? context),
              ...pickEditableContextSnapshot(previous),
            }));
          }

          setSaveState("conflict");
          toast.error("Entry changed elsewhere. Latest version loaded. Please retry.");
          return;
        }

        setSaveState("error");
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
    context,
    contextSnapshot,
    entry.formCode,
    form,
    isSubmitted,
    onRefetchEntry,
    patchMutation,
    version,
  ]);

  const handleAnswerChange = (qid: string, nextValue: unknown) => {
    if (isSubmitted) return;

    setAnswers((previous) => ({
      ...previous,
      [qid]: nextValue,
    }));
  };

  const handleSubmit = async () => {
    if (!entry || !form || version == null) return;
    if (isSubmitted) return;

    try {
      let nextVersion = version;
      const editableContextSnapshot = pickEditableContextSnapshot(contextSnapshot);
      const currentCombinedSnapshot = JSON.stringify({
        answers,
        contextSnapshot: editableContextSnapshot,
      });

      if (currentCombinedSnapshot !== lastSavedSnapshotRef.current) {
        setSaveState("saving");

        const patchResult = await patchMutation.mutateAsync({
          expectedVersion: nextVersion,
          answers,
          progress: computeProgress(form, answers),
          contextSnapshot: editableContextSnapshot,
          formCode: entry.formCode,
        });

        nextVersion = patchResult.version;
        setVersion(nextVersion);
        lastSavedSnapshotRef.current = currentCombinedSnapshot;
      }

      const submitResult = await submitMutation.mutateAsync({
        expectedVersion: nextVersion,
        formCode: entry.formCode,
      });

      setVersion(submitResult.version);
      setSaveState("saved");
      toast.success("Entry submitted successfully.");
      router.push(`/fill/${sessionId}/${entry.formCode}`);
    } catch (error) {
      if (error instanceof ApiError && error.code === "VERSION_CONFLICT") {
        const latest = await onRefetchEntry();
        if (latest.data) {
          setVersion(latest.data.version);
          setContextSnapshot((previous) => ({
            ...(latest.data?.contextSnapshot ?? context),
            ...pickEditableContextSnapshot(previous),
          }));
        }
        setSaveState("conflict");
        toast.error("Submit conflict. Reloaded latest version, please retry.");
        return;
      }

      setSaveState("error");
      const message = error instanceof Error ? error.message : "Submit failed.";
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-[1240px]">
        <FillPageHeader
          sessionId={sessionId}
          form={form}
          context={contextSnapshot}
          progress={liveProgress}
          status={entry.status}
          saveState={saveState}
          isSubmitted={isSubmitted}
          isSubmitting={submitMutation.isPending}
          isSaving={patchMutation.isPending}
          onSubmit={handleSubmit}
        />

        {topContent ? <div className="mt-4">{topContent}</div> : null}

        <div className="space-y-4 mt-4">
          <SessionMetaBar
            context={contextSnapshot}
            editableContext={pickEditableContextSnapshot(contextSnapshot)}
            onEditableContextChange={(next) => {
              if (isSubmitted) return;
              setContextSnapshot((previous) => ({ ...previous, ...next }));
            }}
            disabled={isSubmitted}
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
            onAnswerChange={handleAnswerChange}
            disabled={isSubmitted}
          />
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
