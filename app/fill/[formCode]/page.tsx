"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import { getForm } from "@/components/forms/forms";
import { FillEntryEditor, FillPageError, FillPageLoading } from "@/components/survey/fill-entry-editor";
import { FillFormNavControls } from "@/components/survey/fill-form-nav";
import { FillPageHeader } from "@/components/survey/fill-page-header";
import { FormNoteCallout } from "@/components/survey/form-note-callout";
import { FormTable } from "@/components/survey/form-table";
import { SessionMetaBar } from "@/components/survey/session-meta-bar";
import { useSessionEntry } from "@/hooks/api/use-session-entries";
import {
  useSessionBlockOptions,
  useSessionDetail,
  useSessionDistrictOptions,
  useSessionGramPanchayatOptions,
  useSessionSearch,
  useSessionVillageOptions,
} from "@/hooks/api/use-sessions";
import { getOrCreateFormEntry } from "@/lib/api/endpoints/session-entries";
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
import { getDraftBySessionAndForm } from "@/lib/storage/draft-store";
import type { SessionEntry } from "@/lib/api/endpoints/session-entries";

function toSectionSlug(formCode: string) {
  return `section-${formCode.toLowerCase()}`;
}

function makePreviewContext(
  district: string,
  block: string,
  gramPanchayat: string,
  village: string,
): SessionContext {
  return {
    district: district || "—",
    block: block || "—",
    gramPanchayat: gramPanchayat || "—",
    village: village || "—",
    surveyDate: new Date().toISOString(),
    totalPopulation: 0,
    totalHouseholds: 0,
    scHouseholds: 0,
    stHouseholds: 0,
    miningAffectedArea: "direct",
    distanceFromNearestMine: 0,
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
  village: string;
  onVillageChange: (value: string) => void;
  villages: string[];
  villagePopoverOpen: boolean;
  setVillagePopoverOpen: (value: boolean) => void;
};

type ActiveFillSessionProps = {
  sessionId: string;
  formCode: string;
  form: NonNullable<ReturnType<typeof getForm>>;
  topContent: ReactNode;
};

function ActiveFillSession({
  sessionId,
  formCode,
  form,
  topContent,
}: ActiveFillSessionProps) {
  const queryClient = useQueryClient();
  const [entryId, setEntryId] = useState<string | undefined>();
  const [offlineSessionContext, setOfflineSessionContext] = useState<SessionContext | null>(null);
  const [entryResolveError, setEntryResolveError] = useState<string | null>(null);
  const [isResolvingEntry, setIsResolvingEntry] = useState(false);
  const inFlightKeyRef = useRef<string | null>(null);

  const sessionQuery = useSessionDetail(sessionId);
  const entryQuery = useSessionEntry(sessionId, entryId);

  useEffect(() => {
    let ignore = false;

    async function hydrateOfflineDraft() {
      const draft = await getDraftBySessionAndForm(sessionId, formCode);
      if (ignore || !draft) return;

      setEntryId(draft.entryId);
      setOfflineSessionContext(draft.context);

      const optimisticEntry: SessionEntry = {
        id: draft.entryId,
        sessionId: draft.sessionId,
        formCode: draft.formCode,
        status: "draft",
        answers: draft.answers,
        progress: draft.progress,
        contextSnapshot: draft.context,
        version: draft.version,
        createdAt: draft.updatedAt,
        updatedAt: draft.updatedAt,
        submittedAt: null,
        deletedAt: null,
      };

      queryClient.setQueryData(
        ["entry", sessionId, draft.entryId],
        optimisticEntry,
      );
    }

    void hydrateOfflineDraft();
    return () => {
      ignore = true;
    };
  }, [formCode, queryClient, sessionId]);

  useEffect(() => {
    if (entryId) return;
    if (typeof navigator !== "undefined" && !navigator.onLine) return;
    if (isResolvingEntry) return;

    const currentKey = `${sessionId}:${formCode}`;
    if (inFlightKeyRef.current === currentKey) return;

    inFlightKeyRef.current = currentKey;
    setEntryResolveError(null);
    setIsResolvingEntry(true);

    const resolvePromise = getOrCreateFormEntry({ sessionId, formCode });
    const timeoutPromise = new Promise<never>((_, reject) => {
      const timeoutId = setTimeout(() => {
        clearTimeout(timeoutId);
        reject(new Error("Entry creation timed out. Please retry."));
      }, 10000);
    });

    Promise.race([resolvePromise, timeoutPromise])
      .then((entry) => {
        setEntryId(entry.id);
        queryClient.setQueryData(["entry", sessionId, entry.id], entry);
      })
      .catch((error) => {
        setEntryId(undefined);
        setEntryResolveError(error instanceof Error ? error.message : "Could not resolve entry.");
      })
      .finally(() => {
        setIsResolvingEntry(false);
        inFlightKeyRef.current = null;
      });
  }, [entryId, formCode, isResolvingEntry, queryClient, sessionId]);

  if (
    Boolean(entryResolveError) ||
    entryQuery.isError ||
    sessionQuery.isError ||
    (!isResolvingEntry && !entryId) ||
    (entryQuery.data && entryQuery.data.formCode.toUpperCase() !== formCode) ||
    (!sessionQuery.isLoading && !sessionQuery.data && !offlineSessionContext) ||
    (!entryQuery.isLoading && entryId && !entryQuery.data)
  ) {
    return (
      <FillPageError message="The entry, session, or form definition could not be loaded." />
    );
  }

  if (
    isResolvingEntry ||
    !entryId ||
    entryQuery.isLoading ||
    sessionQuery.isLoading ||
    !entryQuery.data
  ) {
    return <FillPageLoading />;
  }

  const resolvedSessionContext = sessionQuery.data?.context ?? offlineSessionContext;

  if (
    !resolvedSessionContext
  ) {
    return (
      <FillPageError message="The entry, session, or form definition could not be loaded." />
    );
  }

  return (
    <FillEntryEditor
      sessionId={sessionId}
      section={toSectionSlug(form.code)}
      entry={entryQuery.data}
      form={form}
      context={resolvedSessionContext}
      topContent={topContent}
    />
  );
}

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
  village,
  onVillageChange,
  villages,
  villagePopoverOpen,
  setVillagePopoverOpen,
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
            <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
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

        <div className="space-y-1">
          <Label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            Village
          </Label>
          <Popover open={villagePopoverOpen} onOpenChange={setVillagePopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                type="button"
                aria-expanded={villagePopoverOpen}
                disabled={!district || !block || !gramPanchayat}
                className="h-8 w-full justify-between rounded-none border-border bg-card px-2 font-normal"
              >
                <span className="truncate text-left">
                  {village || "Search village"}
                </span>
                <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
              <Command>
                <CommandInput placeholder="Search village..." />
                <CommandList>
                  <CommandEmpty>No village found.</CommandEmpty>
                  {villages.map((item) => (
                    <CommandItem
                      key={item}
                      value={item}
                      onSelect={() => {
                        onVillageChange(item);
                        setVillagePopoverOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 size-4",
                          village === item ? "opacity-100" : "opacity-0",
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
  const selectedSessionId =
    searchParams.get("sessionId")
    ?? searchParams.get("sessionID")
    ?? searchParams.get("sessionid")
    ?? undefined;

  const [district, setDistrict] = useState("");
  const [block, setBlock] = useState("");
  const [gramPanchayat, setGramPanchayat] = useState("");
  const [village, setVillage] = useState("");
  const [debouncedFilters, setDebouncedFilters] = useState({
    district: "",
    block: "",
    gramPanchayat: "",
    village: "",
  });
  const [gramPopoverOpen, setGramPopoverOpen] = useState(false);
  const [villagePopoverOpen, setVillagePopoverOpen] = useState(false);

  const sessionQuery = useSessionDetail(selectedSessionId);
  const sessionContext = sessionQuery.data?.context;
  const effectiveDistrict =
    selectedSessionId && sessionContext ? sessionContext.district : district;
  const effectiveBlock = selectedSessionId && sessionContext ? sessionContext.block : block;

  const districtQuery = useSessionDistrictOptions();
  const blockQuery = useSessionBlockOptions(effectiveDistrict || undefined);
  const availableBlocks = blockQuery.data ?? [];
  const normalizedBlock = availableBlocks.includes(effectiveBlock) ? effectiveBlock : "";
  const gramPanchayatQuery = useSessionGramPanchayatOptions(
    effectiveDistrict || undefined,
    normalizedBlock || undefined,
  );
  const availableGramPanchayats = gramPanchayatQuery.data ?? [];
  const normalizedGramPanchayat = availableGramPanchayats.includes(gramPanchayat)
    ? gramPanchayat
    : "";
  const villageQuery = useSessionVillageOptions(
    effectiveDistrict || undefined,
    normalizedBlock || undefined,
    normalizedGramPanchayat || undefined,
  );
  const availableVillages = villageQuery.data ?? [];
  const normalizedVillage = availableVillages.includes(village)
    ? village
    : "";
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFilters({
        district,
        block: normalizedBlock,
        gramPanchayat: normalizedGramPanchayat,
        village: normalizedVillage,
      });
    }, 350);
    return () => clearTimeout(timer);
  }, [district, normalizedBlock, normalizedGramPanchayat, normalizedVillage]);

  const sessionsQuery = useSessionSearch({
    district: debouncedFilters.district || undefined,
    block: debouncedFilters.block || undefined,
    gramPanchayat: debouncedFilters.gramPanchayat || undefined,
    village: debouncedFilters.village || undefined,
  });
  const normalizedDistrict = district.trim().toLowerCase();
  const normalizedBlockKey = normalizedBlock.trim().toLowerCase();
  const normalizedGramPanchayatKey = normalizedGramPanchayat.trim().toLowerCase();
  const normalizedVillageKey = normalizedVillage.trim().toLowerCase();
  const exactMatchedSession = useMemo(() => {
    if (!normalizedDistrict || !normalizedBlockKey || !normalizedGramPanchayatKey || !normalizedVillageKey) return undefined;
    const sessions = sessionsQuery.data ?? [];
    return sessions.find((session) => {
      const context = session.context;
      return (
        context.district.trim().toLowerCase() === normalizedDistrict
        && context.block.trim().toLowerCase() === normalizedBlockKey
        && context.gramPanchayat.trim().toLowerCase() === normalizedGramPanchayatKey
        && context.village.trim().toLowerCase() === normalizedVillageKey
      );
    });
  }, [
    normalizedBlockKey,
    normalizedDistrict,
    normalizedGramPanchayatKey,
    normalizedVillageKey,
    sessionsQuery.data,
  ]);

  useEffect(() => {
    if (selectedSessionId) return;
    if (!formCode || !district || !normalizedBlock || !normalizedGramPanchayat || !normalizedVillage) return;
    const resolvedSessionId = exactMatchedSession?.id;
    if (!resolvedSessionId) return;

    router.replace(`/fill/${formCode}?sessionId=${resolvedSessionId}`);
  }, [
    district,
    exactMatchedSession?.id,
    formCode,
    normalizedBlock,
    normalizedGramPanchayat,
    normalizedVillage,
    router,
    selectedSessionId,
  ]);

  if (!formCode || !form) {
    return <FillPageError message="Invalid form code in route." />;
  }

  const shouldShowNoSessionMatchNotice =
    !selectedSessionId
    && Boolean(district && normalizedBlock && normalizedGramPanchayat && normalizedVillage)
    && !sessionsQuery.isLoading
    && !exactMatchedSession;

  const searchDistrict = effectiveDistrict;
  const searchBlock = normalizedBlock;
  const searchGramPanchayat =
    selectedSessionId && sessionContext ? sessionContext.gramPanchayat : normalizedGramPanchayat;
  const searchVillage =
    selectedSessionId && sessionContext ? sessionContext.village : normalizedVillage;

  const searchPanel = (
    <SessionSearchPanel
      district={searchDistrict}
      onDistrictChange={(value) => {
        setDistrict(value);
        setBlock("");
        setGramPanchayat("");
        setVillage("");
        router.replace(`/fill/${formCode}`);
      }}
      districts={districtQuery.data ?? []}
      block={searchBlock}
      onBlockChange={(value) => {
        setBlock(value);
        setGramPanchayat("");
        setVillage("");
        router.replace(`/fill/${formCode}`);
      }}
      blocks={availableBlocks}
      gramPanchayat={searchGramPanchayat}
      onGramPanchayatChange={(value) => {
        setGramPanchayat(value);
        setVillage("");
        router.replace(`/fill/${formCode}`);
      }}
      gramPanchayats={availableGramPanchayats}
      gramPopoverOpen={gramPopoverOpen}
      setGramPopoverOpen={setGramPopoverOpen}
      village={searchVillage}
      onVillageChange={(value) => {
        setVillage(value);
        router.replace(`/fill/${formCode}`);
      }}
      villages={availableVillages}
      villagePopoverOpen={villagePopoverOpen}
      setVillagePopoverOpen={setVillagePopoverOpen}
    />
  );

  if (!selectedSessionId) {
    const previewContext = makePreviewContext(district, block, gramPanchayat, village);

    return (
      <div className="min-h-screen bg-background">
        <main className="mx-auto max-w-[1240px] pb-24">
          <FillPageHeader
            sessionId=""
            form={form}
            context={previewContext}
            progress={{ answered: 0, totalVisible: 0, percent: 0 }}
            saveState="idle"
          />

          <div className="mt-4">{searchPanel}</div>
          {shouldShowNoSessionMatchNotice ? (
            <div className="mt-3 border border-destructive/40 bg-destructive/10 px-4 py-2 text-xs text-destructive">
              No session found for this district/block/gram panchayat/village. Create or update a session first.
            </div>
          ) : null}

          <div className="pointer-events-none mt-4 space-y-4 opacity-60 blur-[1.5px]">
            <SessionMetaBar context={previewContext} disabled />
            <FormNoteCallout note={form.note} />
            <FormTable
              form={form}
              answers={[]}
              onAnswerChange={() => {}}
              disabled
            />
          </div>

          <div className="mt-4 flex justify-end border border-border bg-card px-4 py-4">
            <FillFormNavControls sessionId="" formCode={form.code} variant="footer" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <ActiveFillSession
      key={`${selectedSessionId}-${formCode}`}
      sessionId={selectedSessionId}
      formCode={formCode}
      form={form}
      topContent={searchPanel}
    />
  );
}
