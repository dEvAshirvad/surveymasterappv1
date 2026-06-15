import type { Question } from "@/components/forms/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MatrixField } from "@/components/survey/matrix-field";

type QuestionFieldProps = {
  question: Question;
  value: unknown;
  onChange: (nextValue: unknown) => void;
  disabled?: boolean;
};

export function QuestionField({
  question,
  value,
  onChange,
  disabled = false,
}: QuestionFieldProps) {
  const stringValue = typeof value === "string" ? value : "";

  return (
    <div className="space-y-2 border border-border bg-background p-3">
      <div>
        <p className="text-xs font-semibold text-foreground">
          {question.qid} — {question.title.en}
        </p>
        <p className="text-xs text-muted-foreground">{question.title.hi}</p>
      </div>

      <p className="text-[11px] text-muted-foreground">
        UoM: {question.uom.en} / {question.uom.hi}
      </p>

      {question.dmfEligible ? (
        <p className="text-[11px] text-muted-foreground">
          DMF Eligible: {question.dmfEligible.en}
        </p>
      ) : null}

      {question.type === "options" ? (
        <div className="flex flex-wrap gap-2">
          {(question.options ?? []).map((option) => (
            <Button
              key={option.value}
              type="button"
              size="sm"
              variant={stringValue === option.value ? "default" : "outline"}
              onClick={() => onChange(option.value)}
              disabled={disabled}
            >
              {option.label.en}
            </Button>
          ))}
        </div>
      ) : null}

      {question.type === "text" ? (
        <Textarea
          value={stringValue}
          onChange={(event) => onChange(event.target.value)}
          disabled={disabled}
          placeholder="Enter response"
        />
      ) : null}

      {question.type === "number" ? (
        <Input
          type="number"
          value={stringValue}
          onChange={(event) => onChange(event.target.value)}
          disabled={disabled}
          placeholder="Enter number"
        />
      ) : null}

      {question.type === "matrix" ? (
        <MatrixField
          question={question}
          value={value}
          onChange={onChange as (nextValue: Record<string, Record<string, string>>) => void}
          disabled={disabled}
        />
      ) : null}
    </div>
  );
}
