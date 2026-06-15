"use client";

import { useMemo, useState } from "react";

import type { SessionContext } from "@/lib/api/endpoints/sessions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type SessionMetaBarProps = {
  context: SessionContext;
  editableContext?: Pick<
    SessionContext,
    "surveyorName" | "surveyorNameNIT" | "surveyDate"
  >;
  onEditableContextChange?: (
    next: Pick<SessionContext, "surveyorName" | "surveyorNameNIT" | "surveyDate">,
  ) => void;
  disabled?: boolean;
};

function formatSurveyDate(value: string) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(parsed);
}

function toDateInputValue(value: string) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toISOString().slice(0, 10);
}

type ViewMode = "half" | "full";

type ContextField = {
  key: keyof SessionContext;
  label: string;
  formatter?: (value: SessionContext[keyof SessionContext]) => string;
};

const CONTEXT_FIELDS: ContextField[] = [
  { key: "surveyorName", label: "Surveyor Name" },
  { key: "surveyorNameNIT", label: "NIT Team Member" },
  {
    key: "surveyDate",
    label: "Survey Date",
    formatter: (value) => formatSurveyDate(String(value)),
  },
  { key: "district", label: "District" },
  { key: "block", label: "Block" },
  { key: "gramPanchayat", label: "Gram panchayat" },
  { key: "village", label: "Village" },
  { key: "totalPopulation", label: "Total population" },
  { key: "totalHouseholds", label: "Total households" },
  { key: "scHouseholds", label: "SC households" },
  { key: "stHouseholds", label: "ST households" },
  {
    key: "miningAffectedArea",
    label: "Mining affected area",
    formatter: (value) => {
      const text = String(value);
      return `${text.charAt(0).toUpperCase()}${text.slice(1)}`;
    },
  },
];

export function SessionMetaBar({
  context,
  editableContext,
  onEditableContextChange,
  disabled = false,
}: SessionMetaBarProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("half");
  const editableKeys = new Set<keyof SessionContext>([
    "surveyorName",
    "surveyorNameNIT",
    "surveyDate",
  ]);
  const editableState = editableContext ?? {
    surveyorName: context.surveyorName,
    surveyorNameNIT: context.surveyorNameNIT,
    surveyDate: context.surveyDate,
  };

  const visibleFields = useMemo(
    () => (viewMode === "half" ? CONTEXT_FIELDS.slice(0, 3) : CONTEXT_FIELDS),
    [viewMode],
  );

  return (
    <section className="border border-border bg-[#eff4ff] px-4 py-3">
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Session context
        </p>
        <div className="inline-flex border border-border bg-card">
          <button
            type="button"
            onClick={() => setViewMode("half")}
            className={cn(
              "px-3 py-1 text-[11px] font-semibold uppercase tracking-wide transition-colors",
              viewMode === "half"
                ? "bg-primary text-primary-foreground"
                : "text-primary hover:bg-muted",
            )}
          >
            Half view
          </button>
          <button
            type="button"
            onClick={() => setViewMode("full")}
            className={cn(
              "px-3 py-1 text-[11px] font-semibold uppercase tracking-wide transition-colors",
              viewMode === "full"
                ? "bg-primary text-primary-foreground"
                : "text-primary hover:bg-muted",
            )}
          >
            Full view
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {visibleFields.map((field) => {
          const isEditable = editableKeys.has(field.key);
          const rawValue = isEditable
            ? editableState[field.key as keyof typeof editableState]
            : context[field.key];
          const displayValue =
            field.key === "surveyDate" && isEditable
              ? toDateInputValue(String(rawValue ?? ""))
              : field.formatter
                ? field.formatter(rawValue)
                : String(rawValue ?? "");

          return (
            <div key={field.key} className="space-y-1">
              <Label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                {field.label}
              </Label>
              <Input
                type={field.key === "surveyDate" && isEditable ? "date" : "text"}
                disabled={disabled || !isEditable}
                readOnly={!isEditable}
                value={displayValue}
                onChange={(event) => {
                  if (!isEditable || !onEditableContextChange) return;
                  const nextValue = event.target.value;
                  if (field.key === "surveyorName") {
                    onEditableContextChange({
                      ...editableState,
                      surveyorName: nextValue,
                    });
                    return;
                  }
                  if (field.key === "surveyorNameNIT") {
                    onEditableContextChange({
                      ...editableState,
                      surveyorNameNIT: nextValue,
                    });
                    return;
                  }
                  if (field.key === "surveyDate") {
                    onEditableContextChange({
                      ...editableState,
                      surveyDate: nextValue,
                    });
                  }
                }}
                className="h-8 rounded-none border-border bg-card"
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}
