"use client";

import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

import { FORMS } from "@/components/forms/forms";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type FillFormNavControlsProps = {
  sessionId: string;
  formCode: string;
  variant?: "header" | "footer";
  showNextButton?: boolean;
  className?: string;
};

export function FillFormNavControls({
  sessionId,
  formCode,
  variant = "footer",
  showNextButton = true,
  className,
}: FillFormNavControlsProps) {
  const router = useRouter();
  const formIndex = FORMS.findIndex((item) => item.code === formCode);
  const formPosition = formIndex >= 0 ? formIndex + 1 : 1;
  const formTotal = FORMS.length;
  const nextForm =
    formIndex >= 0 && formIndex < FORMS.length - 1 ? FORMS[formIndex + 1] : null;

  function goToForm(nextFormCode: string) {
    if (nextFormCode === formCode) return;

    const base = `/fill/${nextFormCode}`;
    router.push(sessionId ? `${base}?sessionId=${sessionId}` : base);
  }

  const isHeader = variant === "header";

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <Select value={formCode} onValueChange={goToForm}>
        <SelectTrigger
          className={cn(
            "data-[size=default]:h-9 min-w-[220px] rounded-none",
            isHeader
              ? "border-primary-foreground/30 bg-primary-foreground/10 text-primary-foreground"
              : "border-border bg-card",
          )}
        >
          <SelectValue placeholder="Select form" />
        </SelectTrigger>
        <SelectContent>
          {FORMS.map((item, index) => (
            <SelectItem key={item.code} value={item.code}>
              Form {index + 1}/{formTotal} — Section {item.code}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Badge
        variant="outline"
        className={cn(
          "h-9 font-semibold",
          isHeader
            ? "border-primary-foreground/30 bg-primary-foreground/10 text-primary-foreground"
            : "border-border bg-muted",
        )}
      >
        {formPosition}/{formTotal}
      </Badge>
      {showNextButton ? (
        <Button
          type="button"
          onClick={() => nextForm && goToForm(nextForm.code)}
          disabled={!nextForm}
          className={cn(
            isHeader
              ? "bg-primary-foreground text-primary hover:bg-primary-foreground/90 h-9"
              : "bg-primary text-primary-foreground hover:bg-primary/90 h-9",
          )}
        >
          Next form
          <ArrowRight className="size-4" />
        </Button>
      ) : null}
    </div>
  );
}
