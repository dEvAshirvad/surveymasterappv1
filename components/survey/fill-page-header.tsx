"use client";

import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

import type { FormDef } from "@/components/forms/types";
import { FORMS } from "@/components/forms/forms";
import type { SessionContext } from "@/lib/api/endpoints/sessions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type FillPageHeaderProps = {
  sessionId: string;
  form: FormDef;
  context: SessionContext;
  progress: { answered: number; totalVisible: number; percent: number };
  status: string;
  saveState: string;
  isSubmitted: boolean;
  isSubmitting: boolean;
  isSaving: boolean;
  onSubmit: () => void;
};

function buildBreadcrumb(context: SessionContext) {
  return [
    context.district,
    context.block,
    `GP ${context.gramPanchayat}`,
    `Village ${context.village}`,
  ].join(" > ");
}

export function FillPageHeader({
  sessionId,
  form,
  context,
  progress,
  status,
  saveState,
  isSubmitted,
  isSubmitting,
  isSaving,
  onSubmit,
}: FillPageHeaderProps) {
  const router = useRouter();
  const formIndex = FORMS.findIndex((item) => item.code === form.code);
  const formPosition = formIndex >= 0 ? formIndex + 1 : 1;
  const formTotal = FORMS.length;

  function handleFormChange(nextFormCode: string) {
    if (nextFormCode === form.code) return;

    const base = `/fill/${nextFormCode}`;
    router.push(sessionId ? `${base}?sessionID=${sessionId}` : base);
  }

  return (
    <header className="">
      <div className="border-b py-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-[11px] text-primary/85 font-bold">{buildBreadcrumb(context)}</p>
          <div className="flex min-w-[200px] flex-col gap-1">
            <div className="flex items-center justify-between text-[11px]">
              <span>
                {progress.answered} / {progress.totalVisible} answered
              </span>
              <span>{progress.percent}%</span>
            </div>
            <Progress value={progress.percent} className="h-1 bg-primary/20" />
          </div>
        </div>
      </div>

      <div className="flex h-full justify-between gap-4 px-4 py-4 bg-primary text-primary-foreground">
        <div className="min-w-0 flex-1">
          <Button
            asChild
            size="sm"
            variant="outline"
            className="mb-3 border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
          >
            <Link href={`/?sessionId=${sessionId}`}>
              <ArrowLeft className="size-4" />
              Back to forms
            </Link>
          </Button>
          <h1 className="text-lg font-bold uppercase tracking-tight">
            Section {form.code} — {form.title.en}
          </h1>
          <p className="mt-1 text-sm text-primary-foreground/90">({form.title.hi})</p>
          <p className="mt-2 text-xs text-primary-foreground/80">{form.ruleRef}</p>
        </div>

        <div className="flex flex-col items-end gap-2 h-full justify-between">
          <div className="flex items-center gap-2">
            <Select value={form.code} onValueChange={handleFormChange}>
              <SelectTrigger className="h-8 min-w-[220px] rounded-none border-primary-foreground/30 bg-primary-foreground/10 text-primary-foreground">
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
              className="border-primary-foreground/30 h-8 bg-primary-foreground/10 text-primary-foreground"
            >
              {formPosition}/{formTotal}
            </Badge>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-2">
            <Badge
              variant="outline"
              className="border-primary-foreground/30 h-8 bg-primary-foreground/10 text-primary-foreground"
            >
              {status.toUpperCase()}
            </Badge>
            <Badge
              variant="outline"
              className="border-primary-foreground/30 h-8 bg-primary-foreground/10 text-primary-foreground"
            >
              Save: {saveState}
            </Badge>
            <Button
              onClick={onSubmit}
              disabled={isSubmitted || isSubmitting || isSaving}
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
            >
              {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : null}
              {isSubmitted ? "Submitted" : "Submit"}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
