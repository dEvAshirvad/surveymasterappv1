"use client";

import type { Question } from "@/components/forms/types";
import {
  resolveSelectChange,
  resolveSelectValue,
} from "@/components/forms/scheme-options";
import { Input } from "@/components/ui/input";
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

type MatrixValue = Record<string, Record<string, string>>;

type InfrastructureGapMatrixProps = {
  question: Question;
  blockTitle?: { en: string; hi: string };
  value: unknown;
  onChange: (nextValue: MatrixValue) => void;
  disabled?: boolean;
};

export function InfrastructureGapMatrix({
  question,
  blockTitle,
  value,
  onChange,
  disabled = false,
}: InfrastructureGapMatrixProps) {
  const matrixValue: MatrixValue =
    value && typeof value === "object" ? (value as MatrixValue) : {};
  const rows = question.matrixRows ?? [];
  const cols = question.matrixCols ?? [];
  const numericPattern = /^\d*\.?\d*$/;

  const normalize = (value: string) => value.toLowerCase().replace(/[^a-z]/g, "");
  const requiredCol = cols.find((col) => normalize(col.value) === "required");
  const existingCol = cols.find((col) => normalize(col.value) === "existing");
  const functionalCol = cols.find((col) => normalize(col.value) === "functional");
  const gapCol = cols.find((col) => normalize(col.value) === "gapshortfall");

  const parseNumeric = (raw: string | undefined) => {
    if (!raw) return 0;
    const parsed = Number(raw);
    return Number.isFinite(parsed) ? parsed : 0;
  };

  const formatNumeric = (value: number) => {
    if (Number.isInteger(value)) return String(value);
    return value.toFixed(2).replace(/\.?0+$/, "");
  };

  const handleCellChange = (rowKey: string, colKey: string, next: string) => {
    const nextRow = {
      ...(matrixValue[rowKey] ?? {}),
      [colKey]: next,
    };

    if (
      gapCol &&
      requiredCol &&
      existingCol &&
      functionalCol &&
      [requiredCol.value, existingCol.value, functionalCol.value].includes(colKey)
    ) {
      const required = parseNumeric(nextRow[requiredCol.value]);
      const existing = parseNumeric(nextRow[existingCol.value]);
      const functional = parseNumeric(nextRow[functionalCol.value]);
      const computedGap = required + (existing - functional);
      nextRow[gapCol.value] = formatNumeric(computedGap);
    }

    onChange({
      ...matrixValue,
      [rowKey]: nextRow,
    });
  };

  return (
    <section className="mt-6 border border-border bg-card">
      <div className="border-b border-border bg-[#dbeafe] px-4 py-2">
        <p className="font-semibold text-primary">
          {blockTitle?.en ?? question.title.en}
        </p>
        <p className="text-[12px] text-primary/80">
          {blockTitle?.hi ?? question.title.hi}
        </p>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="border-border bg-primary hover:bg-primary">
            <TableHead className="min-w-[240px] text-primary-foreground">
              Infrastructure / Activity
            </TableHead>
            {cols.map((col) => (
              <TableHead key={col.value} className="text-primary-foreground">
                <span className="block">{col.label.en}</span>
                <span className="block text-[10px] font-normal opacity-90">
                  {col.label.hi}
                </span>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow
              key={row.value}
              className={index % 2 === 1 ? "bg-muted/40" : "bg-card"}
            >
              <TableCell className="align-top whitespace-normal">
                <p className="font-medium text-foreground">{row.label.en}</p>
                <p className="text-[12px] text-muted-foreground">{row.label.hi}</p>
              </TableCell>
              {cols.map((col) => {
                const dropdownOptions = col.dropdownOptions ?? [];
                const cellValue = matrixValue[row.value]?.[col.value] ?? "";

                return (
                  <TableCell key={`${row.value}-${col.value}`} className="min-w-[100px]">
                    {col.inputType === "dropdown" ? (
                      <Select
                        value={resolveSelectValue(cellValue, dropdownOptions)}
                        onValueChange={(next) =>
                          handleCellChange(
                            row.value,
                            col.value,
                            resolveSelectChange(next, dropdownOptions),
                          )
                        }
                        disabled={disabled}
                      >
                        <SelectTrigger className="h-8 w-full rounded-none border-border bg-card">
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
                    ) : (
                      <Input
                        type="text"
                        inputMode={col.inputType === "text" ? "text" : "decimal"}
                        value={matrixValue[row.value]?.[col.value] ?? ""}
                        onChange={(event) => {
                          const next = event.target.value.trimStart();
                          const inputType = col.inputType ?? "number";
                          if (
                            inputType === "text" ||
                            next === "" ||
                            numericPattern.test(next)
                          ) {
                            handleCellChange(row.value, col.value, next);
                          }
                        }}
                        disabled={disabled}
                        placeholder={col.inputType === "text" ? "Enter text" : "0"}
                        className="h-8 rounded-none border-border bg-card"
                      />
                    )}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
}
