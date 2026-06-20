"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import type { FormDef } from "@/components/forms/types";
import { FillFormNavControls } from "@/components/survey/fill-form-nav";
import type { SessionContext } from "@/lib/api/endpoints/sessions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

type FillPageHeaderProps = {
  sessionId: string;
  form: FormDef;
  context: SessionContext;
  progress: { answered: number; totalVisible: number; percent: number };
  saveState: string;
};

function formatSaveState(saveState: string) {
  const normalized = saveState.toLowerCase();
  if (normalized === "offline") return "offline (queued)";
  if (normalized === "queued") return "queued for sync";
  if (normalized === "saving") return "syncing";
  return normalized;
}

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
  saveState,
}: FillPageHeaderProps) {
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
          <FillFormNavControls
            sessionId={sessionId}
            formCode={form.code}
            variant="header"
            showNextButton={false}
          />
          <div className="flex flex-wrap items-center justify-end gap-2">
            <Badge
              variant="outline"
              className="border-primary-foreground/30 h-8 bg-primary-foreground/10 text-primary-foreground"
            >
              Save: {formatSaveState(saveState)}
            </Badge>
          </div>
        </div>
      </div>
    </header>
  );
}
