"use client";

import { ArrowRight, FileText } from "lucide-react";
import { useRouter } from "next/navigation";

import Header from "@/components/Header";
import { FORMS } from "@/components/forms/forms";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

function FormCard({
  code,
  titleEn,
  titleHi,
  onOpenForm,
}: {
  code: string;
  titleEn: string;
  titleHi: string;
  onOpenForm: (formCode: string) => void;
}) {
  return (
    <article className="border border-border bg-card p-4">
      <div className="mb-3 flex items-center justify-between">
        <Badge variant="outline" className="border-border bg-muted font-semibold">
          Form {code}
        </Badge>
        <FileText className="size-4 text-muted-foreground" />
      </div>
      <h3 className="text-sm font-semibold text-foreground">{titleEn}</h3>
      <p className="mt-1 text-[13px] text-muted-foreground">{titleHi}</p>

      <Button
        type="button"
        onClick={() => onOpenForm(code)}
        className="mt-4 w-full bg-primary text-primary-foreground hover:bg-primary/90"
      >
        Open Form
        <ArrowRight className="size-3.5" />
      </Button>
    </article>
  );
}

export default function Home() {
  const router = useRouter();
  const handleOpenForm = (formCode: string) => {
    router.push(`/fill/${formCode}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto mt-6 max-w-[1240px] pb-24">
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Forms ({FORMS.length})</h2>
            <p className="text-xs text-muted-foreground">
              Open a form and select session context there
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {FORMS.map((form) => (
              <FormCard
                key={form.code}
                code={form.code}
                titleEn={form.title.en}
                titleHi={form.title.hi}
                onOpenForm={handleOpenForm}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
