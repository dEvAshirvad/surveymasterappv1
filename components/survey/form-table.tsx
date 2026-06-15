"use client";

import { useMemo } from "react";

import {
  getPrimaryAnswerValue,
  getVisibleQuestions,
  sortOrderBlocks,
  type FormDef,
} from "@/components/forms/types";
import { GovernmentSurveyTable } from "@/components/survey/government-survey-table";
import { InfrastructureGapMatrix } from "@/components/survey/infrastructure-gap-matrix";

type FormTableProps = {
  form: FormDef;
  answers: Record<string, unknown>;
  onAnswerChange: (qid: string, nextValue: unknown) => void;
  disabled?: boolean;
};

export function FormTable({
  form,
  answers,
  onAnswerChange,
  disabled = false,
}: FormTableProps) {
  const orderedBlocks = useMemo(() => sortOrderBlocks(form.order), [form.order]);

  const visibilityAnswers = useMemo(() => {
    const mapped: Record<string, unknown> = {};

    for (const [qid, value] of Object.entries(answers)) {
      const primary = getPrimaryAnswerValue(value);
      if (primary) {
        mapped[qid] = primary;
      }
    }

    return mapped;
  }, [answers]);

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
        onAnswerChange={onAnswerChange}
        disabled={disabled}
      />

      {matrixQuestions.map(({ question, blockTitle }) => (
        <InfrastructureGapMatrix
          key={question.qid}
          question={question}
          blockTitle={blockTitle}
          value={answers[question.qid]}
          onChange={(nextValue) => onAnswerChange(question.qid, nextValue)}
          disabled={disabled}
        />
      ))}
    </div>
  );
}
