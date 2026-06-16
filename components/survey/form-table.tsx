"use client";

import { useMemo } from "react";

import {
  buildOrderedFormQuestions,
  getPrimaryAnswerValue,
  getVisibleQuestions,
  sortOrderBlocks,
  type FormDef,
  type Question,
} from "@/components/forms/types";
import type { EntryAnswerItem } from "@/lib/api/endpoints/session-entries";
import { GovernmentSurveyTable } from "@/components/survey/government-survey-table";
import { CrossSectorAutoMatrix } from "@/components/survey/cross-sector-auto-matrix";
import { InfrastructureGapMatrix } from "@/components/survey/infrastructure-gap-matrix";

type FormTableProps = {
  form: FormDef;
  answers: EntryAnswerItem[];
  sourceAnswersByFormCode?: Record<string, EntryAnswerItem[]>;
  onAnswerChange: (storageIndex: number, question: Question, nextValue: unknown) => void;
  disabled?: boolean;
};

export function FormTable({
  form,
  answers,
  sourceAnswersByFormCode = {},
  onAnswerChange,
  disabled = false,
}: FormTableProps) {
  const orderedBlocks = useMemo(() => sortOrderBlocks(form.order), [form.order]);
  const orderedQuestions = useMemo(() => buildOrderedFormQuestions(form), [form]);

  const answerByLegacyQid = useMemo(() => {
    const mapped: Record<string, unknown> = {};
    orderedQuestions.forEach((item) => {
      mapped[item.question.qid] = answers[item.storageIndex]?.answer;
    });
    return mapped;
  }, [answers, orderedQuestions]);

  const storageIndexByLegacyQid = useMemo(() => {
    const mapped: Record<string, number> = {};
    orderedQuestions.forEach((item) => {
      mapped[item.question.qid] = item.storageIndex;
    });
    return mapped;
  }, [orderedQuestions]);

  const displayQidByLegacyQid = useMemo(() => {
    const mapped: Record<string, string> = {};
    orderedQuestions.forEach((item) => {
      mapped[item.question.qid] = item.displayQid;
    });
    return mapped;
  }, [orderedQuestions]);

  const visibilityAnswers = useMemo(() => {
    const mapped: Record<string, unknown> = {};

    for (const [qid, value] of Object.entries(answerByLegacyQid)) {
      const primary = getPrimaryAnswerValue(value);
      if (primary) {
        mapped[qid] = primary;
      }
    }

    return mapped;
  }, [answerByLegacyQid]);

  const visibleQuestionIds = useMemo(
    () => new Set(getVisibleQuestions(orderedBlocks, visibilityAnswers).map((q) => q.qid)),
    [orderedBlocks, visibilityAnswers],
  );

  const matrixQuestions = useMemo(() => {
    const items: Array<{
      question: (typeof orderedBlocks)[number]["questions"][number];
      blockTitle: { en: string; hi: string };
    }> = [];

    for (const block of orderedBlocks) {
      for (const question of block.questions) {
        if (question.type === "matrix" && visibleQuestionIds.has(question.qid)) {
          items.push({ question, blockTitle: block.title });
        }
      }
    }

    return items;
  }, [orderedBlocks, visibleQuestionIds]);

  return (
    <div className="space-y-0">
      <GovernmentSurveyTable
        blocks={orderedBlocks}
        visibleQuestionIds={visibleQuestionIds}
        answers={answers}
        displayQidByLegacyQid={displayQidByLegacyQid}
        storageIndexByLegacyQid={storageIndexByLegacyQid}
        onAnswerChange={onAnswerChange}
        disabled={disabled}
      />

      {matrixQuestions.map(({ question, blockTitle }) => (
        question.qid === "O9" ? (
          <CrossSectorAutoMatrix
            key={question.qid}
            question={question}
            value={answerByLegacyQid[question.qid]}
            sourceAnswersByFormCode={sourceAnswersByFormCode}
            onChange={(nextValue) =>
              onAnswerChange(storageIndexByLegacyQid[question.qid], question, nextValue)}
            disabled={disabled}
          />
        ) : (
          <InfrastructureGapMatrix
            key={question.qid}
            question={question}
            blockTitle={blockTitle}
            value={answerByLegacyQid[question.qid]}
            onChange={(nextValue) =>
              onAnswerChange(storageIndexByLegacyQid[question.qid], question, nextValue)}
            disabled={disabled}
          />
        )
      ))}
    </div>
  );
}
