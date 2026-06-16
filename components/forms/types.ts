// web/src/forms/types.ts

export type Bilingual = { en: string; hi: string };
export type Option = { value: string; label: Bilingual };
export type MatrixInputType = "number" | "text" | "options" | "dropdown";
export type MatrixOption = Option & { inputType?: MatrixInputType; dropdownOptions?: Option[] };
export type ConditionalDetailMode =
  | "single"
  | "multi"
  | "text"
  | "dropdown"
  | "date"
  | "number"
  | "inputs"
  | "small_matrix";
export type FacilityAvailability = { available: "Yes" | "No"; distanceKm?: string };
export type FacilityGroupAnswer = Record<string, FacilityAvailability>;
export type FacilityInputAnswer = Record<string, string>;
export type TieredAccessAnswer = Record<
  string,
  { available: "Yes" | "No"; managementType?: string; distanceKm?: string }
>;
export type ConditionalDetailConfig = {
  mode: ConditionalDetailMode;
  options?: Option[];
  placeholder?: string;
  facilities?: Array<{ key: string; label: Bilingual }>;
  facilityInputType?: MatrixInputType;
  matrixRows?: Option[];
  matrixCols?: MatrixOption[];
  matrixDefaultValue?: string;
};
export type ConditionalOptionRule = {
  triggerValue: string;
  detailLabel?: Bilingual;
  detail: ConditionalDetailConfig;
};

// No "boolean" — Yes/No is just an `options` question. This guarantees every
// answer value is a string, so triggerValue comparison never breaks.
export type QuestionType =
  | "options"
  | "dropdown"
  | "text"
  | "number"
  | "date"
  | "duration"
  | "matrix"
  | "small_matrix"
  | "facility_group"
  | "facility_inputs"
  | "tiered_access"
  | "conditional_options";

export type Question = {
  qid: string;                 // "A1.1" — flat, no indentation
  title: Bilingual;
  type: QuestionType;
  uom: Bilingual;
  options?: Option[];          // for type "options"
  dropdownOptions?: Option[];  // for type "dropdown"
  conditionalRules?: ConditionalOptionRule[]; // for type "conditional_options"
  dmfEligible?: Bilingual;
  matrixRows?: Option[];       // for type "matrix" | "small_matrix"
  matrixCols?: MatrixOption[]; // for type "matrix" | "small_matrix"
  facilities?: Array<{ key: string; label: Bilingual }>; // facility_group | facility_inputs
  managementOptions?: Option[]; // tiered_access
  facilityInputType?: MatrixInputType; // facility_inputs — default "text"
  matrixDefaultValue?: string; // small_matrix placeholder/default hint (e.g. "0")
  parentId?: string | null;    // qid of the question this depends on
  triggerValue?: string;       // show only if answers[parentId] === triggerValue
  parentTriggerWhen?: "equals" | "answered"; // default "equals"
};

// A titled group of questions (e.g. "A1. Village water infrastructure status").
export type OrderBlock = {
  title: Bilingual;
  questions: Question[];        // array position = render order
};

export type FormDef = {
  code: string;
  title: Bilingual;
  ruleRef: string;
  note?: Bilingual;
  order: OrderBlock[];          // groups render top to bottom, questions in array order
};

export type OrderedFormQuestion = {
  storageIndex: number;
  blockIndex: number;
  questionIndex: number;
  displayQid: string;
  blockTitle: Bilingual;
  question: Question;
};

export function parseQid(qid: string): { letter: string; major: number; minor: number } {
  const match = qid.match(/^([A-O])(?:(\d+)(?:\.(\d+))?)?$/);
  if (!match) return { letter: qid, major: 0, minor: 0 };
  return {
    letter: match[1],
    major: match[2] ? Number(match[2]) : 0,
    minor: match[3] ? Number(match[3]) : 0,
  };
}

export function compareQid(a: string, b: string): number {
  const left = parseQid(a);
  const right = parseQid(b);
  return (
    left.letter.localeCompare(right.letter)
    || left.major - right.major
    || left.minor - right.minor
  );
}

export function sortOrderBlocks(blocks: OrderBlock[]): OrderBlock[] {
  return [...blocks]
    .map((block) => ({
      ...block,
      questions: [...block.questions].sort((left, right) => compareQid(left.qid, right.qid)),
    }))
    .sort((left, right) => {
      const leftFirst = left.questions[0]?.qid ?? "";
      const rightFirst = right.questions[0]?.qid ?? "";
      return compareQid(leftFirst, rightFirst);
    });
}

export function buildOrderedFormQuestions(form: FormDef): OrderedFormQuestion[] {
  const orderedBlocks = sortOrderBlocks(form.order);
  const items: OrderedFormQuestion[] = [];
  let storageIndex = 0;

  orderedBlocks.forEach((block, blockIndex) => {
    block.questions.forEach((question, questionIndex) => {
      items.push({
        storageIndex,
        blockIndex: blockIndex + 1,
        questionIndex: questionIndex + 1,
        displayQid: `${form.code}${blockIndex + 1}.${questionIndex + 1}`,
        blockTitle: block.title,
        question,
      });
      storageIndex += 1;
    });
  });

  return items;
}

// Flatten all questions across blocks, then filter by conditional visibility.
export function getPrimaryAnswerValue(value: unknown): string | undefined {
  if (typeof value === "string") return value;
  if (!value || typeof value !== "object") return undefined;

  const maybePrimary = (value as { primary?: unknown }).primary;
  return typeof maybePrimary === "string" ? maybePrimary : undefined;
}

export function isParentTriggerMet(
  parentAnswer: unknown,
  triggerValue: string | undefined,
  triggerWhen: Question["parentTriggerWhen"] = "equals",
): boolean {
  if (triggerWhen === "answered") {
    if (typeof parentAnswer === "string") return parentAnswer.trim().length > 0;
    if (!parentAnswer || typeof parentAnswer !== "object") return false;
    return Object.keys(parentAnswer as Record<string, unknown>).length > 0;
  }

  return getPrimaryAnswerValue(parentAnswer) === triggerValue;
}

export function getVisibleQuestions(
  blocks: OrderBlock[],
  answers: Record<string, unknown>,
): Question[] {
  return sortOrderBlocks(blocks)
    .flatMap((b) => b.questions)
    .filter((q) => {
      if (!q.parentId) return true;
      return isParentTriggerMet(
        answers[q.parentId],
        q.triggerValue,
        q.parentTriggerWhen,
      );
    });
}