"use client";

import { ArrowRight, ClipboardList, Loader2, Trash2 } from "lucide-react";

import type { SessionEntry } from "@/lib/api/endpoints/session-entries";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function formatShortDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(
    new Date(value),
  );
}

type EntryCardProps = {
  entry: SessionEntry;
  entryLabel: string;
  onOpen: () => void;
  onDelete?: () => Promise<void>;
  isDeleting?: boolean;
};

export function EntryCard({
  entry,
  entryLabel,
  onOpen,
  onDelete,
  isDeleting = false,
}: EntryCardProps) {
  const isDraft = entry.status === "draft";

  return (
    <article className="border border-border bg-card p-4">
      <div className="mb-3 flex items-center justify-end">
        <ClipboardList className="size-4 text-muted-foreground" />
      </div>

      <h3 className="text-sm font-semibold text-foreground">{entryLabel}</h3>
      <p className="mt-1 text-[13px] text-muted-foreground">
        Last updated {formatDate(entry.updatedAt)}
      </p>

      <div className="mt-4 grid grid-cols-3 gap-2 text-[11px]">
        <div className="border border-border bg-muted px-2 py-1 text-center">
          <p className="font-semibold text-foreground">{entry.progress.percent}%</p>
          <p className="text-muted-foreground">Progress</p>
        </div>
        <div className="border border-border bg-muted px-2 py-1 text-center">
          <p className="font-semibold text-foreground">
            {entry.progress.answered}/{entry.progress.totalVisible}
          </p>
          <p className="text-muted-foreground">Answered</p>
        </div>
        <div className="border border-border bg-muted px-2 py-1 text-center">
          <p className="font-semibold text-foreground">
            {formatShortDate(entry.createdAt)}
          </p>
          <p className="text-muted-foreground">Created</p>
        </div>
      </div>

      <Button
        onClick={onOpen}
        className="mt-4 w-full bg-primary text-primary-foreground hover:bg-primary/90"
      >
        Open Entry
        <ArrowRight className="size-3.5" />
      </Button>

      {isDraft && onDelete ? (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              disabled={isDeleting}
              className="mt-2 w-full text-destructive hover:text-destructive"
            >
              {isDeleting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Trash2 className="size-4" />
              )}
              Delete Draft
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete draft entry?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently remove the draft entry and its unsaved answers.
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-white hover:bg-destructive/90"
                onClick={() => void onDelete()}
              >
                Delete entry
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ) : null}
    </article>
  );
}
