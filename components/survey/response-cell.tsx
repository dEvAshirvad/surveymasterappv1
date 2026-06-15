"use client";

import type {
  ConditionalOptionRule,
  FacilityGroupAnswer,
  FacilityInputAnswer,
  Question,
} from "@/components/forms/types";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

type ResponseCellProps = {
  question: Question;
  value: unknown;
  onChange: (nextValue: unknown) => void;
  disabled?: boolean;
};

export function ResponseCell({
  question,
  value,
  onChange,
  disabled = false,
}: ResponseCellProps) {
  const stringValue = typeof value === "string" ? value : "";
  const numericPattern = /^\d*\.?\d*$/;
  const conditionalValue =
    value && typeof value === "object"
      ? (value as { primary?: string; detail?: string | string[] })
      : undefined;

  const conditionalPrimary = conditionalValue?.primary ?? "";

  const getRuleByPrimary = (rules: ConditionalOptionRule[] | undefined, primary: string) =>
    rules?.find((rule) => rule.triggerValue === primary);

  const inputClassName = "h-8 rounded-none border-border bg-card";

  if (question.type === "date") {
    return (
      <Input
        type="date"
        value={stringValue}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        className={cn(inputClassName, "max-w-[200px]")}
      />
    );
  }

  if (question.type === "time") {
    return (
      <Input
        type="time"
        value={stringValue}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        className={cn(inputClassName, "max-w-[160px]")}
      />
    );
  }

  if (question.type === "small_matrix") {
    const matrixValue =
      value && typeof value === "object" ? (value as Record<string, Record<string, string>>) : {};
    const rows = question.matrixRows ?? [];
    const cols = question.matrixCols ?? [];

    const handleCellChange = (rowKey: string, colKey: string, next: string) => {
      onChange({
        ...matrixValue,
        [rowKey]: {
          ...(matrixValue[rowKey] ?? {}),
          [colKey]: next,
        },
      });
    };

    const defaultCell = question.matrixDefaultValue ?? "";

    return (
      <div className="max-w-full overflow-x-auto border border-border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              {cols.map((col) => (
                <TableHead key={col.value} className="h-8 px-2 text-[11px]">
                  {col.label.en}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.value}>
                {cols.map((col) => {
                  const cellValue = matrixValue[row.value]?.[col.value] ?? "";
                  const isLabelCol =
                    col.inputType === undefined &&
                    (col.value === "type" || col.value === "item");

                  if (isLabelCol) {
                    return (
                      <TableCell key={col.value} className="px-2 py-1 text-[11px] font-medium">
                        {row.label.en}
                      </TableCell>
                    );
                  }

                  return (
                    <TableCell key={col.value} className="min-w-[100px] px-2 py-1">
                      <Input
                        type="text"
                        inputMode={col.inputType === "number" ? "decimal" : "text"}
                        value={cellValue}
                        onChange={(event) => {
                          const next = event.target.value;
                          if (
                            col.inputType === "number" &&
                            next !== "" &&
                            !numericPattern.test(next.trimStart())
                          ) {
                            return;
                          }
                          handleCellChange(row.value, col.value, next);
                        }}
                        disabled={disabled}
                        placeholder={defaultCell || "—"}
                        className={cn(inputClassName, "h-7 w-full min-w-[80px]")}
                      />
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (question.type === "facility_inputs") {
    const facilities = question.facilities ?? [];
    const inputType = question.facilityInputType ?? "text";
    const inputValue: FacilityInputAnswer =
      value && typeof value === "object" ? (value as FacilityInputAnswer) : {};

    return (
      <div className="space-y-2">
        {facilities.map((facility) => (
          <div key={facility.key} className="flex items-center gap-2">
            <span className="min-w-[140px] text-[11px] font-medium text-foreground">
              {facility.label.en}
            </span>
            <Input
              type="text"
              inputMode={inputType === "number" ? "decimal" : "text"}
              value={inputValue[facility.key] ?? ""}
              onChange={(event) => {
                const next = event.target.value.trimStart();
                if (inputType === "number" && next !== "" && !numericPattern.test(next)) {
                  return;
                }
                onChange({ ...inputValue, [facility.key]: next });
              }}
              disabled={disabled}
              placeholder={inputType === "number" ? "0" : "Enter value"}
              className={cn(inputClassName, "max-w-[160px]")}
            />
          </div>
        ))}
      </div>
    );
  }

  if (question.type === "facility_group") {
    const facilities = question.facilities ?? [];
    const groupValue: FacilityGroupAnswer =
      value && typeof value === "object" ? (value as FacilityGroupAnswer) : {};

    const updateFacility = (key: string, patch: Partial<FacilityGroupAnswer[string]>) => {
      const current = groupValue[key] ?? {};
      onChange({
        ...groupValue,
        [key]: { ...current, ...patch },
      });
    };

    return (
      <div className="space-y-3">
        {facilities.map((facility) => {
          const facilityAnswer = groupValue[facility.key];
          const available = facilityAnswer?.available ?? "";

          return (
            <div key={facility.key} className="space-y-1 border-l-2 border-border pl-2">
              <p className="text-[11px] font-semibold text-foreground">{facility.label.en}</p>
              <RadioGroup
                value={available}
                onValueChange={(next) =>
                  updateFacility(facility.key, {
                    available: next as "Yes" | "No",
                    distanceKm: next === "Yes" ? undefined : facilityAnswer?.distanceKm,
                  })
                }
                disabled={disabled}
                className="flex flex-row flex-wrap gap-3"
              >
                {(["Yes", "No"] as const).map((option) => {
                  const itemId = `${question.qid}-${facility.key}-${option}`;
                  return (
                    <div key={option} className="flex items-center gap-2">
                      <RadioGroupItem value={option} id={itemId} />
                      <label htmlFor={itemId} className="cursor-pointer text-[11px] font-semibold uppercase tracking-wide text-primary">
                        {option}
                      </label>
                    </div>
                  );
                })}
              </RadioGroup>
              {available === "No" ? (
                <Input
                  type="text"
                  inputMode="decimal"
                  value={facilityAnswer?.distanceKm ?? ""}
                  onChange={(event) => {
                    const next = event.target.value.trimStart();
                    if (next === "" || numericPattern.test(next)) {
                      updateFacility(facility.key, { distanceKm: next });
                    }
                  }}
                  disabled={disabled}
                  placeholder="Distance to nearest (km)"
                  className={cn(inputClassName, "max-w-[200px]")}
                />
              ) : null}
            </div>
          );
        })}
      </div>
    );
  }

  if (question.type === "options") {
    const options = question.options ?? [];

    return (
      <RadioGroup
        value={stringValue}
        onValueChange={onChange}
        disabled={disabled}
        className="flex flex-row flex-wrap gap-4"
      >
        {options.map((option) => {
          const itemId = `${question.qid}-${option.value}`;

          return (
            <div key={option.value} className="flex items-center gap-2">
              <RadioGroupItem value={option.value} id={itemId} />
              <label
                htmlFor={itemId}
                className={cn(
                  "cursor-pointer text-[11px] font-semibold uppercase tracking-wide text-primary",
                  disabled && "cursor-not-allowed opacity-60",
                )}
              >
                {option.label.en}
              </label>
            </div>
          );
        })}
      </RadioGroup>
    );
  }

  if (question.type === "number") {
    return (
      <Input
        type="text"
        inputMode="decimal"
        value={stringValue}
        onChange={(event) => {
          const next = event.target.value.trimStart();
          if (next === "" || numericPattern.test(next)) {
            onChange(next);
          }
        }}
        disabled={disabled}
        placeholder="Enter value"
        className="h-8 max-w-[200px] rounded-none border-border bg-card"
      />
    );
  }

  if (question.type === "text") {
    return (
      <Input
        type="text"
        value={stringValue}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        placeholder="Enter value"
        className="h-8 w-full max-w-[280px] rounded-none border-border bg-card"
      />
    );
  }

  if (question.type === "dropdown") {
    const dropdownOptions = question.dropdownOptions ?? [];
    const selectValue = stringValue || undefined;

    return (
      <Select
        value={selectValue}
        onValueChange={onChange}
        disabled={disabled}
      >
        <SelectTrigger className="h-8 w-full max-w-[280px] rounded-none border-border bg-card">
          <SelectValue placeholder="Select option" />
        </SelectTrigger>
        <SelectContent>
          {dropdownOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label.en}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  if (question.type === "conditional_options") {
    const primaryOptions = question.options ?? [];
    const activeRule = getRuleByPrimary(question.conditionalRules, conditionalPrimary);

    return (
      <div className="space-y-2">
        <RadioGroup
          value={conditionalPrimary}
          onValueChange={(nextPrimary) => onChange({ primary: nextPrimary })}
          disabled={disabled}
          className="flex flex-row flex-wrap gap-4"
        >
          {primaryOptions.map((option) => {
            const itemId = `${question.qid}-${option.value}`;

            return (
              <div key={option.value} className="flex items-center gap-2">
                <RadioGroupItem value={option.value} id={itemId} />
                <label
                  htmlFor={itemId}
                  className={cn(
                    "cursor-pointer text-[11px] font-semibold uppercase tracking-wide text-primary",
                    disabled && "cursor-not-allowed opacity-60",
                  )}
                >
                  {option.label.en}
                </label>
              </div>
            );
          })}
        </RadioGroup>

        {activeRule ? (
          <div className="border-l-2 border-border pl-3">
            {activeRule.detailLabel ? (
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                {activeRule.detailLabel.en}
              </p>
            ) : null}

            {activeRule.detail.mode === "single" ? (
              <RadioGroup
                value={typeof conditionalValue?.detail === "string" ? conditionalValue.detail : ""}
                onValueChange={(nextDetail) =>
                  onChange({ primary: conditionalPrimary, detail: nextDetail })
                }
                disabled={disabled}
                className="flex flex-row flex-wrap gap-4"
              >
                {(activeRule.detail.options ?? []).map((option) => {
                  const itemId = `${question.qid}-${conditionalPrimary}-${option.value}`;
                  return (
                    <div key={option.value} className="flex items-center gap-2">
                      <RadioGroupItem value={option.value} id={itemId} />
                      <label
                        htmlFor={itemId}
                        className={cn(
                          "cursor-pointer text-[11px] font-semibold uppercase tracking-wide text-primary",
                          disabled && "cursor-not-allowed opacity-60",
                        )}
                      >
                        {option.label.en}
                      </label>
                    </div>
                  );
                })}
              </RadioGroup>
            ) : null}

            {activeRule.detail.mode === "multi" ? (
              <div className="flex flex-wrap gap-4">
                {(activeRule.detail.options ?? []).map((option) => {
                  const selected = Array.isArray(conditionalValue?.detail)
                    ? conditionalValue.detail.includes(option.value)
                    : false;
                  const itemId = `${question.qid}-${conditionalPrimary}-${option.value}`;
                  return (
                    <div key={option.value} className="flex items-center gap-2">
                      <Checkbox
                        id={itemId}
                        checked={selected}
                        disabled={disabled}
                        onCheckedChange={(checked) => {
                          const current = Array.isArray(conditionalValue?.detail)
                            ? conditionalValue.detail
                            : [];
                          const next = checked
                            ? Array.from(new Set([...current, option.value]))
                            : current.filter((valueItem) => valueItem !== option.value);

                          onChange({ primary: conditionalPrimary, detail: next });
                        }}
                      />
                      <label
                        htmlFor={itemId}
                        className={cn(
                          "cursor-pointer text-[11px] font-semibold uppercase tracking-wide text-primary",
                          disabled && "cursor-not-allowed opacity-60",
                        )}
                      >
                        {option.label.en}
                      </label>
                    </div>
                  );
                })}
              </div>
            ) : null}

            {activeRule.detail.mode === "text" ? (
              <Input
                type="text"
                value={typeof conditionalValue?.detail === "string" ? conditionalValue.detail : ""}
                onChange={(event) =>
                  onChange({ primary: conditionalPrimary, detail: event.target.value })
                }
                disabled={disabled}
                placeholder={activeRule.detail.placeholder ?? "Enter details"}
                className="h-8 w-full max-w-[320px] rounded-none border-border bg-card"
              />
            ) : null}

            {activeRule.detail.mode === "dropdown" ? (
              <Select
                value={typeof conditionalValue?.detail === "string" ? conditionalValue.detail : undefined}
                onValueChange={(nextDetail) =>
                  onChange({ primary: conditionalPrimary, detail: nextDetail })
                }
                disabled={disabled}
              >
                <SelectTrigger className="h-8 w-full max-w-[320px] rounded-none border-border bg-card">
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent>
                  {(activeRule.detail.options ?? []).map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label.en}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : null}

            {activeRule.detail.mode === "date" ? (
              <Input
                type="date"
                value={typeof conditionalValue?.detail === "string" ? conditionalValue.detail : ""}
                onChange={(event) =>
                  onChange({ primary: conditionalPrimary, detail: event.target.value })
                }
                disabled={disabled}
                className={cn(inputClassName, "max-w-[200px]")}
              />
            ) : null}

            {activeRule.detail.mode === "number" ? (
              <Input
                type="text"
                inputMode="decimal"
                value={typeof conditionalValue?.detail === "string" ? conditionalValue.detail : ""}
                onChange={(event) => {
                  const next = event.target.value.trimStart();
                  if (next === "" || numericPattern.test(next)) {
                    onChange({ primary: conditionalPrimary, detail: next });
                  }
                }}
                disabled={disabled}
                placeholder={activeRule.detail.placeholder ?? "Enter number"}
                className={cn(inputClassName, "max-w-[200px]")}
              />
            ) : null}

            {activeRule.detail.mode === "inputs" ? (
              <div className="space-y-2">
                {(activeRule.detail.facilities ?? []).map((facility) => {
                  const inputType = activeRule.detail.facilityInputType ?? "text";
                  const detailRecord =
                    conditionalValue?.detail &&
                    typeof conditionalValue.detail === "object" &&
                    !Array.isArray(conditionalValue.detail)
                      ? (conditionalValue.detail as Record<string, string>)
                      : {};

                  return (
                    <div key={facility.key} className="flex items-center gap-2">
                      <span className="min-w-[120px] text-[11px] font-medium text-foreground">
                        {facility.label.en}
                      </span>
                      <Input
                        type="text"
                        inputMode={inputType === "number" ? "decimal" : "text"}
                        value={detailRecord[facility.key] ?? ""}
                        onChange={(event) => {
                          const next = event.target.value.trimStart();
                          if (inputType === "number" && next !== "" && !numericPattern.test(next)) {
                            return;
                          }
                          onChange({
                            primary: conditionalPrimary,
                            detail: { ...detailRecord, [facility.key]: next },
                          });
                        }}
                        disabled={disabled}
                        placeholder={inputType === "number" ? "0" : "Enter value"}
                        className={cn(inputClassName, "max-w-[160px]")}
                      />
                    </div>
                  );
                })}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    );
  }

  return null;
}
