"use client";

import { Fragment, useMemo } from "react";

import type { OrderBlock, Question } from "@/components/forms/types";
import type { EntryAnswerItem } from "@/lib/api/endpoints/session-entries";
import { ResponseCell } from "@/components/survey/response-cell";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type GovernmentSurveyTableProps = {
  blocks: OrderBlock[];
  visibleQuestionIds: Set<string>;
  answers: EntryAnswerItem[];
  displayQidByLegacyQid: Record<string, string>;
  storageIndexByLegacyQid: Record<string, number>;
  onAnswerChange: (storageIndex: number, question: Question, nextValue: unknown) => void;
  disabled?: boolean;
};

function QuestionRow({
  question,
  answers,
  displayQidByLegacyQid,
  storageIndexByLegacyQid,
  onAnswerChange,
  disabled,
  striped,
}: {
  question: Question;
  answers: EntryAnswerItem[];
  displayQidByLegacyQid: Record<string, string>;
  storageIndexByLegacyQid: Record<string, number>;
  onAnswerChange: (storageIndex: number, question: Question, nextValue: unknown) => void;
  disabled?: boolean;
  striped: boolean;
}) {
  const storageIndex = storageIndexByLegacyQid[question.qid];
  const displayQid = displayQidByLegacyQid[question.qid] ?? question.qid;
  const value = storageIndex != null ? answers[storageIndex]?.answer : undefined;

  return (
    <TableRow className={striped ? "bg-muted/40" : "bg-card"}>
      <TableCell className="w-[72px] align-top font-semibold text-primary pl-4">
        {displayQid}
      </TableCell>
      <TableCell className="min-w-[320px] align-top whitespace-normal">
        <p className="font-medium text-foreground">{question.title.en}</p>
        <p className="mt-0.5 text-[13px] leading-relaxed text-muted-foreground">
          {question.title.hi}
        </p>
        {question.dmfEligible ? (
          <p className="mt-1 text-[12px] italic text-primary">
            → DMF Eligible: {question.dmfEligible.en}
          </p>
        ) : null}
      </TableCell>
      <TableCell className="w-[140px] align-top italic text-muted-foreground">
        {question.uom.en}
      </TableCell>
      <TableCell className="min-w-[200px] align-top pr-4">
        <ResponseCell
          question={question}
          value={value}
          onChange={(nextValue) => onAnswerChange(storageIndex, question, nextValue)}
          disabled={disabled}
        />
      </TableCell>
    </TableRow>
  );
}

type TableSection = {
  block: OrderBlock;
  questions: Array<{ question: Question; striped: boolean }>;
};

function buildTableSections(
  blocks: OrderBlock[],
  visibleQuestionIds: Set<string>,
): TableSection[] {
  const sections: TableSection[] = [];
  let rowIndex = 0;

  for (const block of blocks) {
    const blockQuestions = block.questions
      .filter((q) => q.type !== "matrix" && visibleQuestionIds.has(q.qid))
      .map((question) => {
        const striped = rowIndex % 2 === 1;
        rowIndex += 1;
        return { question, striped };
      });

    if (blockQuestions.length > 0) {
      sections.push({ block, questions: blockQuestions });
    }
  }

  return sections;
}

export function GovernmentSurveyTable({
  blocks,
  visibleQuestionIds,
  answers,
  displayQidByLegacyQid,
  storageIndexByLegacyQid,
  onAnswerChange,
  disabled = false,
}: GovernmentSurveyTableProps) {
  const sections = useMemo(
    () => buildTableSections(blocks, visibleQuestionIds),
    [blocks, visibleQuestionIds],
  );

  return (
    <div className="border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="border-border bg-primary hover:bg-primary">
            <TableHead className="text-primary-foreground pl-4">Q.No.</TableHead>
            <TableHead className="text-primary-foreground">
              Question &amp; DMFT Eligible Activity
            </TableHead>
            <TableHead className="text-primary-foreground">Response Type</TableHead>
            <TableHead className="text-primary-foreground pr-4">Response</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sections.map(({ block, questions }) => (
            <Fragment key={block.title.en}>
              <TableRow className="bg-[#dbeafe] hover:bg-[#dbeafe]">
                <TableCell colSpan={4} className="py-3 font-semibold text-primary px-4">
                  <p>{block.title.en}</p>
                  <p className="text-[12px] font-normal text-primary/80">{block.title.hi}</p>
                </TableCell>
              </TableRow>
              {questions.map(({ question, striped }) => (
                <QuestionRow
                  key={question.qid}
                  question={question}
                  answers={answers}
                  displayQidByLegacyQid={displayQidByLegacyQid}
                  storageIndexByLegacyQid={storageIndexByLegacyQid}
                  onAnswerChange={onAnswerChange}
                  disabled={disabled}
                  striped={striped}
                />
              ))}
            </Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
