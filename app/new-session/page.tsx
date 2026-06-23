"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import Header from "@/components/Header";
import { useCreateSession } from "@/hooks/api/use-sessions";
import { buildSessionTitle } from "@/lib/session-title";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type NewSessionFormValues = {
  district: string;
  block: string;
  gramPanchayat: string;
  village: string;
  surveyDate: string;
  totalPopulation: number;
  totalHouseholds: number;
  distanceFromNearestMine: number;
  scHouseholds: number;
  stHouseholds: number;
  miningAffectedArea: "direct" | "indirect";
  surveyorName: string;
  surveyorNameNIT: string;
};

const today = new Date().toISOString().slice(0, 10);

export default function NewSessionPage() {
  const router = useRouter();
  const createSessionMutation = useCreateSession();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<NewSessionFormValues>({
    defaultValues: {
      district: "",
      block: "",
      gramPanchayat: "",
      village: "",
      surveyDate: today,
      distanceFromNearestMine: 0,
      totalPopulation: 0,
      totalHouseholds: 0,
      scHouseholds: 0,
      stHouseholds: 0,
      miningAffectedArea: "direct",
      surveyorName: "",
      surveyorNameNIT: "",
    },
  });

  const district = useWatch({ control, name: "district" });
  const block = useWatch({ control, name: "block" });
  const gramPanchayat = useWatch({ control, name: "gramPanchayat" });
  const village = useWatch({ control, name: "village" });
  const surveyDate = useWatch({ control, name: "surveyDate" });

  const sessionTitlePreview =
    district && block && gramPanchayat && village && surveyDate
      ? buildSessionTitle({ district, block, gramPanchayat, village, surveyDate })
      : "District Block GP Village - Month Year";

  const onSubmit = handleSubmit(async (values) => {
    try {
      const created = await createSessionMutation.mutateAsync({
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
      toast.success("Session created successfully.");
      router.push(`/?sessionId=${created.id}`);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Could not create session.";
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
              <h1 className="text-2xl font-semibold text-foreground">Create New Session</h1>
              <p className="text-sm text-muted-foreground">
                Fill core survey metadata to initialize a new DMFT session.
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/">
                <ArrowLeft className="size-4" />
                Back
              </Link>
            </Button>
          </div>

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
                {errors.district ? (
                  <p className="mt-1 text-xs text-destructive">{errors.district.message}</p>
                ) : null}
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-foreground">Block</label>
                <Input {...register("block", { required: "Block is required." })} />
                {errors.block ? (
                  <p className="mt-1 text-xs text-destructive">{errors.block.message}</p>
                ) : null}
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
                {errors.gramPanchayat ? (
                  <p className="mt-1 text-xs text-destructive">
                    {errors.gramPanchayat.message}
                  </p>
                ) : null}
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-foreground">Village</label>
                <Input {...register("village", { required: "Village is required." })} />
                {errors.village ? (
                  <p className="mt-1 text-xs text-destructive">{errors.village.message}</p>
                ) : null}
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
                {errors.distanceFromNearestMine ? (
                  <p className="mt-1 text-xs text-destructive">{errors.distanceFromNearestMine.message}</p>
                ) : null}
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
                {errors.surveyorName ? (
                  <p className="mt-1 text-xs text-destructive">
                    {errors.surveyorName.message}
                  </p>
                ) : null}
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
                {errors.surveyorNameNIT ? (
                  <p className="mt-1 text-xs text-destructive">
                    {errors.surveyorNameNIT.message}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="mt-2 flex justify-end">
              <Button
                type="submit"
                disabled={createSessionMutation.isPending}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {createSessionMutation.isPending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="size-4" />
                    Create Session
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
