"use client";

import { useEffect, useMemo } from "react";

import { buildOrderedFormQuestions, type Question } from "@/components/forms/types";
import { getForm } from "@/components/forms/forms";
import type { EntryAnswerItem } from "@/lib/api/endpoints/session-entries";
import { cn } from "@/lib/utils";
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

type CrossSectorAutoMatrixProps = {
  question: Question;
  value: unknown;
  onChange: (nextValue: MatrixValue) => void;
  sourceAnswersByFormCode: Record<string, EntryAnswerItem[]>;
  disabled?: boolean;
};

type DerivedRow = {
  rowKey: string;
  sectorCode: string;
  sector: string;
  activity: string;
  keyGap: string;
  schemeCoverage: string;
};

type SectorGroup = {
  sectorCode: string;
  sector: string;
  rows: DerivedRow[];
};

const SECTOR_CODES = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
] as const;

function normalizeKey(value: string) {
  return value.toLowerCase().replace(/[^a-z]/g, "");
}

function asMatrixValue(value: unknown): MatrixValue {
  return value && typeof value === "object" ? (value as MatrixValue) : {};
}

function getLastMatrixQuestion(formCode: string) {
  const form = getForm(formCode);
  if (!form) return null;
  const ordered = buildOrderedFormQuestions(form);
  const matrixItems = ordered.filter((item) => item.question.type === "matrix");
  return matrixItems[matrixItems.length - 1] ?? null;
}

function readSourceCell(
  rowValue: Record<string, string> | undefined,
  cols: NonNullable<Question["matrixCols"]>,
  normalizedKey: string,
) {
  const targetCol = cols.find((col) => normalizeKey(col.value) === normalizedKey);
  if (!targetCol) return "";
  return rowValue?.[targetCol.value] ?? "";
}

function mapCoverageValue(
  rawCoverage: string,
  cols: NonNullable<Question["matrixCols"]>,
): string {
  const coverageCol = cols.find((col) => normalizeKey(col.value) === "schemename");
  if (!coverageCol?.dropdownOptions?.length) return rawCoverage;
  return coverageCol.dropdownOptions.find((opt) => opt.value === rawCoverage)?.label.en ?? rawCoverage;
}

function isSourceRowFilled(rowValue: Record<string, string> | undefined) {
  if (!rowValue || typeof rowValue !== "object") return false;
  return Object.values(rowValue).some((cell) => String(cell ?? "").trim().length > 0);
}

export function CrossSectorAutoMatrix({
  question,
  value,
  onChange,
  sourceAnswersByFormCode,
  disabled = false,
}: CrossSectorAutoMatrixProps) {
  const matrixValue = asMatrixValue(value);
  const priorityOptions = question.matrixCols?.find((col) => col.value === "Priority")?.dropdownOptions ?? [];

  const derivedRows = useMemo<DerivedRow[]>(() => {
    const rows: DerivedRow[] = [];

    for (const sectorCode of SECTOR_CODES) {
      const source = getLastMatrixQuestion(sectorCode);
      if (!source) continue;

      const sourceQuestion = source.question;
      const sourceRows = sourceQuestion.matrixRows ?? [];
      const sourceCols = sourceQuestion.matrixCols ?? [];
      const sourceAnswers = sourceAnswersByFormCode[sectorCode] ?? [];
      const sourceAnswer = sourceAnswers[source.storageIndex]?.answer;
      const sourceMatrix = asMatrixValue(sourceAnswer);
      const sectorLabel = `${sectorCode}. ${getForm(sectorCode)?.title.en ?? sectorCode}`;

      for (const row of sourceRows) {
        const sourceRowValue = sourceMatrix[row.value];
        if (!isSourceRowFilled(sourceRowValue)) continue;

        const rawCoverage = readSourceCell(sourceRowValue, sourceCols, "schemename");
        rows.push({
          rowKey: `${sectorCode}__${row.value}`,
          sectorCode,
          sector: sectorLabel,
          activity: row.label.en,
          keyGap: readSourceCell(sourceRowValue, sourceCols, "gapshortfall"),
          schemeCoverage: mapCoverageValue(rawCoverage, sourceCols),
        });
      }
    }

    return rows;
  }, [sourceAnswersByFormCode]);

  const sectorGroups = useMemo<SectorGroup[]>(() => {
    const groups: SectorGroup[] = [];

    for (const sectorCode of SECTOR_CODES) {
      const sectorRows = derivedRows.filter((row) => row.sectorCode === sectorCode);
      if (sectorRows.length === 0) continue;
      groups.push({
        sectorCode,
        sector: sectorRows[0].sector,
        rows: sectorRows,
      });
    }

    return groups;
  }, [derivedRows]);

  useEffect(() => {
    const merged: MatrixValue = {};
    derivedRows.forEach((row) => {
      merged[row.rowKey] = {
        Sector: row.sector,
        SectorActivities: row.activity,
        KeyGap: row.keyGap,
        ExistingCoverage: row.schemeCoverage,
        Priority: matrixValue[row.rowKey]?.Priority ?? "",
        ResidualGap: matrixValue[row.rowKey]?.ResidualGap ?? "",
        Intervention: matrixValue[row.rowKey]?.Intervention ?? "",
      };
    });

    if (JSON.stringify(merged) !== JSON.stringify(matrixValue)) {
      onChange(merged);
    }
  }, [derivedRows, matrixValue, onChange]);

  const updateManualCell = (rowKey: string, colKey: string, next: string) => {
    onChange({
      ...matrixValue,
      [rowKey]: {
        ...(matrixValue[rowKey] ?? {}),
        [colKey]: next,
      },
    });
  };

  const colBorder = "border-r border-border";

  return (
    <section className="mt-6 border border-border bg-card">
      <div className="border-b border-border bg-[#dbeafe] px-4 py-2">
        <p className="font-semibold text-primary">{question.title.en}</p>
        <p className="text-[12px] text-primary/80">{question.title.hi}</p>
      </div>

      <Table className="border-collapse">
        <TableHeader>
          <TableRow className="border-border bg-primary hover:bg-primary">
            <TableHead className={cn("text-primary-foreground", colBorder)}>Sectors</TableHead>
            <TableHead className={cn("text-primary-foreground", colBorder)}>Sector Activities</TableHead>
            <TableHead className={cn("text-primary-foreground", colBorder)}>Key Gap Identified</TableHead>
            <TableHead className={cn("text-primary-foreground", colBorder)}>Existing Scheme Coverage</TableHead>
            <TableHead className={cn("text-primary-foreground", colBorder)}>Priority (H/M/L)</TableHead>
            <TableHead className={cn("text-primary-foreground", colBorder)}>Residual Gap for DMFT (Rs. Lakh)</TableHead>
            <TableHead className="text-primary-foreground">Recommended Intervention</TableHead>
          </TableRow>
        </TableHeader>
        {sectorGroups.length === 0 ? (
          <TableBody>
            <TableRow>
              <TableCell colSpan={7} className="py-8 text-center text-sm text-muted-foreground">
                No sector activities filled in Forms A–N yet. Complete the gap matrices in those forms to populate this summary.
              </TableCell>
            </TableRow>
          </TableBody>
        ) : (
        <TableBody>
          {sectorGroups.map((group) =>
            group.rows.map((row, rowIndex) => (
              <TableRow key={row.rowKey} className={rowIndex % 2 === 1 ? "bg-muted/40" : "bg-card"}>
                {rowIndex === 0 ? (
                  <TableCell
                    rowSpan={group.rows.length}
                    className={cn(
                      "min-w-[160px] align-top bg-muted/20 font-medium",
                      colBorder,
                    )}
                  >
                    {group.sector}
                  </TableCell>
                ) : null}
                <TableCell className={cn("min-w-[220px]", colBorder)}>{row.activity}</TableCell>
                <TableCell className={cn("min-w-[180px]", colBorder)}>{row.keyGap || "—"}</TableCell>
                <TableCell className={cn("min-w-[200px]", colBorder)}>{row.schemeCoverage || "—"}</TableCell>
                <TableCell className={cn("min-w-[140px]", colBorder)}>
                  <Select
                    value={matrixValue[row.rowKey]?.Priority ?? ""}
                    onValueChange={(next) => updateManualCell(row.rowKey, "Priority", next)}
                    disabled={disabled}
                  >
                    <SelectTrigger className="h-8 w-full rounded-none border-border bg-card">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {priorityOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label.en}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className={cn("min-w-[180px]", colBorder)}>
                  <Input
                    type="text"
                    inputMode="decimal"
                    value={matrixValue[row.rowKey]?.ResidualGap ?? ""}
                    onChange={(event) => {
                      const next = event.target.value.trimStart();
                      if (next === "" || /^\d*\.?\d*$/.test(next)) {
                        updateManualCell(row.rowKey, "ResidualGap", next);
                      }
                    }}
                    disabled={disabled}
                    placeholder="0"
                    className="h-8 rounded-none border-border bg-card"
                  />
                </TableCell>
                <TableCell className="min-w-[220px]">
                  <Input
                    type="text"
                    value={matrixValue[row.rowKey]?.Intervention ?? ""}
                    onChange={(event) =>
                      updateManualCell(row.rowKey, "Intervention", event.target.value.trimStart())
                    }
                    disabled={disabled}
                    placeholder="Enter intervention"
                    className="h-8 rounded-none border-border bg-card"
                  />
                </TableCell>
              </TableRow>
            )),
          )}
        </TableBody>
        )}
      </Table>
    </section>
  );
}

