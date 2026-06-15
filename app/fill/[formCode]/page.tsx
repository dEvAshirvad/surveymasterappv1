"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";

import { getForm } from "@/components/forms/forms";
import { FillEntryEditor, FillPageError, FillPageLoading } from "@/components/survey/fill-entry-editor";
import { FillPageHeader } from "@/components/survey/fill-page-header";
import { FormNoteCallout } from "@/components/survey/form-note-callout";
import { FormTable } from "@/components/survey/form-table";
import { SessionMetaBar } from "@/components/survey/session-meta-bar";
import { useGetOrCreateFormEntry, useSessionEntry } from "@/hooks/api/use-session-entries";
import {
  useSessionBlockOptions,
  useSessionDetail,
  useSessionDistrictOptions,
  useSessionGramPanchayatOptions,
  useSessionSearch,
} from "@/hooks/api/use-sessions";
import type { SessionContext } from "@/lib/api/endpoints/sessions";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function toSectionSlug(formCode: string) {
  return `section-${formCode.toLowerCase()}`;
}

function makePreviewContext(
  district: string,
  block: string,
  gramPanchayat: string,
): SessionContext {
  return {
    district: district || "—",
    block: block || "—",
    gramPanchayat: gramPanchayat || "—",
    village: "—",
    surveyDate: new Date().toISOString(),
    totalPopulation: 0,
    totalHouseholds: 0,
    scHouseholds: 0,
    stHouseholds: 0,
    miningAffectedArea: "direct",
    surveyorName: "",
    surveyorNameNIT: "",
  };
}

type SessionSearchPanelProps = {
  district: string;
  onDistrictChange: (value: string) => void;
  districts: string[];
  block: string;
  onBlockChange: (value: string) => void;
  blocks: string[];
  gramPanchayat: string;
  onGramPanchayatChange: (value: string) => void;
  gramPanchayats: string[];
  gramPopoverOpen: boolean;
  setGramPopoverOpen: (value: boolean) => void;
};

function SessionSearchPanel({
  district,
  onDistrictChange,
  districts,
  block,
  onBlockChange,
  blocks,
  gramPanchayat,
  onGramPanchayatChange,
  gramPanchayats,
  gramPopoverOpen,
  setGramPopoverOpen,
}: SessionSearchPanelProps) {
  return (
    <section className="border border-border bg-[#eff4ff] px-4 py-3">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Session context search
      </p>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <div className="space-y-1">
          <Label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            District
          </Label>
          <Select value={district} onValueChange={onDistrictChange}>
            <SelectTrigger className="h-8 rounded-none border-border bg-card w-full">
              <SelectValue placeholder="Select district" />
            </SelectTrigger>
            <SelectContent>
              {districts.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            Block
          </Label>
          <Select value={block} onValueChange={onBlockChange} disabled={!district}>
            <SelectTrigger className="h-8 rounded-none border-border bg-card w-full">
              <SelectValue placeholder="Select block" />
            </SelectTrigger>
            <SelectContent>
              {blocks.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            Gram Panchayat
          </Label>
          <Popover open={gramPopoverOpen} onOpenChange={setGramPopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                type="button"
                aria-expanded={gramPopoverOpen}
                disabled={!district || !block}
                className="h-8 w-full justify-between rounded-none border-border bg-card px-2 font-normal"
              >
                <span className="truncate text-left">
                  {gramPanchayat || "Search gram panchayat"}
                </span>
                <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
              <Command>
                <CommandInput placeholder="Search gram panchayat..." />
                <CommandList>
                  <CommandEmpty>No gram panchayat found.</CommandEmpty>
                  {gramPanchayats.map((item) => (
                    <CommandItem
                      key={item}
                      value={item}
                      onSelect={() => {
                        onGramPanchayatChange(item);
                        setGramPopoverOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 size-4",
                          gramPanchayat === item ? "opacity-100" : "opacity-0",
                        )}
                      />
                      {item}
                    </CommandItem>
                  ))}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

      </div>
    </section>
  );
}

export default function FillByCodePage() {
  const params = useParams<{ formCode: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();

  const formCode = params?.formCode?.toUpperCase();
  const form = useMemo(() => (formCode ? getForm(formCode) : undefined), [formCode]);
  const selectedSessionId = searchParams.get("sessionID") ?? undefined;

  const [district, setDistrict] = useState("");
  const [block, setBlock] = useState("");
  const [gramPanchayat, setGramPanchayat] = useState("");
  const [gramPopoverOpen, setGramPopoverOpen] = useState(false);
  const [entryId, setEntryId] = useState<string | undefined>();

  const districtQuery = useSessionDistrictOptions();
  const blockQuery = useSessionBlockOptions(district || undefined);
  const gramPanchayatQuery = useSessionGramPanchayatOptions(
    district || undefined,
    block || undefined,
  );
  const sessionsQuery = useSessionSearch({
    district: district || undefined,
    block: block || undefined,
    gramPanchayat: gramPanchayat || undefined,
  });

  const getOrCreateMutation = useGetOrCreateFormEntry(selectedSessionId);
  const sessionQuery = useSessionDetail(selectedSessionId);
  const entryQuery = useSessionEntry(selectedSessionId, entryId);
  const inFlightKeyRef = useRef<string | null>(null);

  useEffect(() => {
    setEntryId(undefined);
    inFlightKeyRef.current = null;
  }, [formCode, selectedSessionId]);

  useEffect(() => {
    if (!selectedSessionId || !formCode) return;
    if (entryId) return;
    if (getOrCreateMutation.isPending) return;

    const currentKey = `${selectedSessionId}:${formCode}`;
    if (inFlightKeyRef.current === currentKey) return;

    inFlightKeyRef.current = currentKey;
    getOrCreateMutation
      .mutateAsync({ formCode })
      .then((entry) => {
        setEntryId(entry.id);
      })
      .catch(() => {
        setEntryId(undefined);
      })
      .finally(() => {
        inFlightKeyRef.current = null;
      });
  }, [entryId, formCode, getOrCreateMutation, selectedSessionId]);

  useEffect(() => {
    if (!selectedSessionId || !sessionQuery.data?.context) return;
    const { district: nextDistrict, block: nextBlock, gramPanchayat: nextGramPanchayat } =
      sessionQuery.data.context;
    setDistrict(nextDistrict);
    setBlock(nextBlock);
    setGramPanchayat(nextGramPanchayat);
  }, [selectedSessionId, sessionQuery.data?.context]);

  useEffect(() => {
    if (selectedSessionId) return;
    if (!formCode || !district || !block || !gramPanchayat) return;
    const sessions = sessionsQuery.data ?? [];
    if (sessions.length === 0) return;

    const resolvedSessionId = sessions[0]?.id;
    if (!resolvedSessionId) return;

    router.replace(`/fill/${formCode}?sessionID=${resolvedSessionId}`);
  }, [
    block,
    district,
    formCode,
    gramPanchayat,
    router,
    selectedSessionId,
    sessionsQuery.data,
  ]);

  if (!formCode || !form) {
    return <FillPageError message="Invalid form code in route." />;
  }

  const searchPanel = (
    <SessionSearchPanel
      district={district}
      onDistrictChange={(value) => {
        setDistrict(value);
        setBlock("");
        setGramPanchayat("");
        setEntryId(undefined);
        inFlightKeyRef.current = null;
        router.replace(`/fill/${formCode}`);
      }}
      districts={districtQuery.data ?? []}
      block={block}
      onBlockChange={(value) => {
        setBlock(value);
        setGramPanchayat("");
        setEntryId(undefined);
        inFlightKeyRef.current = null;
        router.replace(`/fill/${formCode}`);
      }}
      blocks={blockQuery.data ?? []}
      gramPanchayat={gramPanchayat}
      onGramPanchayatChange={(value) => {
        setGramPanchayat(value);
        setEntryId(undefined);
        inFlightKeyRef.current = null;
        router.replace(`/fill/${formCode}`);
      }}
      gramPanchayats={gramPanchayatQuery.data ?? []}
      gramPopoverOpen={gramPopoverOpen}
      setGramPopoverOpen={setGramPopoverOpen}
    />
  );

  if (!selectedSessionId) {
    const previewContext = makePreviewContext(district, block, gramPanchayat);

    return (
      <div className="min-h-screen bg-background">
        <main className="mx-auto max-w-[1240px] pb-24">
          <FillPageHeader
            sessionId=""
            form={form}
            context={previewContext}
            progress={{ answered: 0, totalVisible: 0, percent: 0 }}
            status="draft"
            saveState="idle"
            isSubmitted
            isSubmitting={false}
            isSaving={false}
            onSubmit={() => {}}
          />

          <div className="mt-4">{searchPanel}</div>

          <div className="pointer-events-none mt-4 space-y-4 opacity-60 blur-[1.5px]">
            <SessionMetaBar context={previewContext} disabled />
            <FormNoteCallout note={form.note} />
            <FormTable
              form={form}
              answers={{}}
              onAnswerChange={() => {}}
              disabled
            />
          </div>
        </main>
      </div>
    );
  }

  if (
    getOrCreateMutation.isPending ||
    !entryId ||
    entryQuery.isLoading ||
    sessionQuery.isLoading ||
    !entryQuery.data ||
    entryQuery.data.formCode.toUpperCase() !== formCode
  ) {
    return <FillPageLoading />;
  }

  if (
    getOrCreateMutation.isError ||
    entryQuery.isError ||
    sessionQuery.isError ||
    !sessionQuery.data
  ) {
    return (
      <FillPageError message="The entry, session, or form definition could not be loaded." />
    );
  }

  return (
    <FillEntryEditor
      key={`${selectedSessionId}-${formCode}-${entryQuery.data.id}`}
      sessionId={selectedSessionId}
      section={toSectionSlug(form.code)}
      entry={entryQuery.data}
      form={form}
      context={sessionQuery.data.context}
      topContent={searchPanel}
      onRefetchEntry={async () => {
        const result = await entryQuery.refetch();
        return { data: result.data };
      }}
    />
  );
}
