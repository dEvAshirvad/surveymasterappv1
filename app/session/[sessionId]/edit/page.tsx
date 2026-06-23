"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import Header from "@/components/Header";
import { useSessionDetail, useUpdateSession } from "@/hooks/api/use-sessions";
import { buildSessionTitle } from "@/lib/session-title";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type SessionEditFormValues = {
  district: string;
  block: string;
  gramPanchayat: string;
  village: string;
  surveyDate: string;
  totalPopulation: number;
  distanceFromNearestMine: number;
  totalHouseholds: number;
  scHouseholds: number;
  stHouseholds: number;
  miningAffectedArea: "direct" | "indirect";
  surveyorName: string;
  surveyorNameNIT: string;
};

function toDateInputValue(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  return date.toISOString().slice(0, 10);
}

export default function SessionEditPage() {
  const router = useRouter();
  const params = useParams<{ sessionId: string }>();
  const sessionId = params.sessionId;

  const sessionQuery = useSessionDetail(sessionId);
  const updateSessionMutation = useUpdateSession(sessionId);

  const {
    register,
    reset,
    handleSubmit,
    control,
  } = useForm<SessionEditFormValues>({
    defaultValues: {
      district: "",
      block: "",
      gramPanchayat: "",
      village: "",
      surveyDate: "",
      totalPopulation: 0,
      totalHouseholds: 0,
      scHouseholds: 0,
      distanceFromNearestMine: 0,
      stHouseholds: 0,
      miningAffectedArea: "direct",
      surveyorName: "",
      surveyorNameNIT: "",
    },
  });

  useEffect(() => {
    if (!sessionQuery.data) return;
    const session = sessionQuery.data;
    reset({
      district: session.context.district,
      block: session.context.block,
      gramPanchayat: session.context.gramPanchayat,
      village: session.context.village,
      surveyDate: toDateInputValue(session.context.surveyDate),
      distanceFromNearestMine: session.context.distanceFromNearestMine,
      totalPopulation: Number(session.context.totalPopulation),
      totalHouseholds: Number(session.context.totalHouseholds),
      scHouseholds: Number(session.context.scHouseholds),
      stHouseholds: Number(session.context.stHouseholds),
      miningAffectedArea: session.context.miningAffectedArea,
      surveyorName: session.context.surveyorName,
      surveyorNameNIT: session.context.surveyorNameNIT,
    });
  }, [reset, sessionQuery.data]);

  const district = useWatch({ control, name: "district" });
  const block = useWatch({ control, name: "block" });
  const gramPanchayat = useWatch({ control, name: "gramPanchayat" });
  const village = useWatch({ control, name: "village" });
  const surveyDate = useWatch({ control, name: "surveyDate" });

  const sessionTitlePreview =
    district && block && gramPanchayat && village && surveyDate
      ? buildSessionTitle({ district, block, gramPanchayat, village, surveyDate })
      : sessionQuery.data?.title ?? "District Block GP Village - Month Year";

  const onSubmit = handleSubmit(async values => {
    try {
      await updateSessionMutation.mutateAsync({
        context: {
          district: values.district,
          block: values.block,
          gramPanchayat: values.gramPanchayat,
          village: values.village,
          surveyDate: values.surveyDate,
          distanceFromNearestMine: Number(values.distanceFromNearestMine) || 0,
          totalPopulation: Number(values.totalPopulation) || 0,
          totalHouseholds: Number(values.totalHouseholds) || 0,
          scHouseholds: Number(values.scHouseholds) || 0,
          stHouseholds: Number(values.stHouseholds) || 0,
          miningAffectedArea: values.miningAffectedArea,
          surveyorName: values.surveyorName,
          surveyorNameNIT: values.surveyorNameNIT,
        },
      });
      toast.success("Session updated successfully.");
      router.push(`/sessions`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not update session.";
      toast.error(message);
    }
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto mt-6 max-w-[980px] pb-24">
        <section className="border border-border bg-card p-5">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Edit Session</h1>
              <p className="text-sm text-muted-foreground">
                Update session context metadata. Title is regenerated automatically.
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/sessions">
                <ArrowLeft className="size-4" />
                Back
              </Link>
            </Button>
          </div>

          {sessionQuery.isLoading ? (
            <p className="text-sm text-muted-foreground">Loading session...</p>
          ) : null}

          {sessionQuery.isError ? (
            <p className="text-sm text-destructive">
              Could not load session detail.
            </p>
          ) : null}

          <form onSubmit={onSubmit} className="grid gap-4">
            <div>
              <label className="mb-1 block text-xs font-semibold text-foreground">
                Session Title
              </label>
              <Input value={sessionTitlePreview} readOnly disabled className="bg-muted/40" />
              <p className="mt-1 text-xs text-muted-foreground">
                Generated automatically from district, block, gram panchayat, village, and survey date.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-semibold text-foreground">District</label>
                <Input {...register("district", { required: "District is required." })} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-foreground">Block</label>
                <Input {...register("block", { required: "Block is required." })} />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-semibold text-foreground">
                  Gram Panchayat
                </label>
                <Input
                  {...register("gramPanchayat", {
                    required: "Gram Panchayat is required.",
                  })}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-foreground">Village</label>
                <Input {...register("village", { required: "Village is required." })} />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-semibold text-foreground">
                  Survey Date
                </label>
                <Input type="date" {...register("surveyDate", { required: true })} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-foreground">
                  Mining Affected Area
                </label>
                <select
                  className="h-8 w-full border border-input bg-transparent px-2.5 text-xs outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50"
                  {...register("miningAffectedArea", { required: true })}
                >
                  <option value="direct">direct</option>
                  <option value="indirect">indirect</option>
                </select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-semibold text-foreground">
                  Distance from Nearest Mine (in km)
                </label>
                <Input type="number" min={0} {...register("distanceFromNearestMine", { required: true })} />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-semibold text-foreground">
                  Total Population
                </label>
                <Input
                  type="number"
                  min={0}
                  {...register("totalPopulation", {
                    valueAsNumber: true,
                    min: 0,
                  })}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-foreground">
                  Total Households
                </label>
                <Input
                  type="number"
                  min={0}
                  {...register("totalHouseholds", {
                    valueAsNumber: true,
                    min: 0,
                  })}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-semibold text-foreground">
                  SC Households
                </label>
                <Input
                  type="number"
                  min={0}
                  {...register("scHouseholds", {
                    valueAsNumber: true,
                    min: 0,
                  })}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-foreground">
                  ST Households
                </label>
                <Input
                  type="number"
                  min={0}
                  {...register("stHouseholds", {
                    valueAsNumber: true,
                    min: 0,
                  })}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-semibold text-foreground">
                  Surveyor Name
                </label>
                <Input
                  {...register("surveyorName", {
                    required: "Surveyor name is required.",
                  })}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-foreground">
                  Surveyor Name (NIT)
                </label>
                <Input
                  {...register("surveyorNameNIT", {
                    required: "NIT surveyor name is required.",
                  })}
                />
              </div>
            </div>

            <div className="mt-2 flex justify-end">
              <Button
                type="submit"
                disabled={updateSessionMutation.isPending || sessionQuery.isLoading}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {updateSessionMutation.isPending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="size-4" />
                    Save Session
                  </>
                )}
              </Button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}
