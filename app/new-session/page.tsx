"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import Header from "@/components/Header";
import { useCreateSession } from "@/hooks/api/use-sessions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type NewSessionFormValues = {
  title: string;
  district: string;
  block: string;
  gramPanchayat: string;
  village: string;
  surveyDate: string;
  totalPopulation: number;
  totalHouseholds: number;
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
    formState: { errors },
  } = useForm<NewSessionFormValues>({
    defaultValues: {
      title: "",
      district: "",
      block: "",
      gramPanchayat: "",
      village: "",
      surveyDate: today,
      totalPopulation: 1200,
      totalHouseholds: 250,
      scHouseholds: 40,
      stHouseholds: 60,
      miningAffectedArea: "direct",
      surveyorName: "",
      surveyorNameNIT: "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      const created = await createSessionMutation.mutateAsync({
        title: values.title,
        context: {
          district: values.district,
          block: values.block,
          gramPanchayat: values.gramPanchayat,
          village: values.village,
          surveyDate: values.surveyDate,
          totalPopulation: Number(values.totalPopulation),
          totalHouseholds: Number(values.totalHouseholds),
          scHouseholds: Number(values.scHouseholds),
          stHouseholds: Number(values.stHouseholds),
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
              <Input
                placeholder="Korba Block 3 — March 2026"
                {...register("title", { required: "Session title is required." })}
              />
              {errors.title ? (
                <p className="mt-1 text-xs text-destructive">{errors.title.message}</p>
              ) : null}
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
                  Total Population
                </label>
                <Input
                  type="number"
                  min={1}
                  {...register("totalPopulation", {
                    required: true,
                    valueAsNumber: true,
                    min: 1,
                  })}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-foreground">
                  Total Households
                </label>
                <Input
                  type="number"
                  min={1}
                  {...register("totalHouseholds", {
                    required: true,
                    valueAsNumber: true,
                    min: 1,
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
                  min={1}
                  {...register("scHouseholds", {
                    required: true,
                    valueAsNumber: true,
                    min: 1,
                  })}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-foreground">
                  ST Households
                </label>
                <Input
                  type="number"
                  min={1}
                  {...register("stHouseholds", {
                    required: true,
                    valueAsNumber: true,
                    min: 1,
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
