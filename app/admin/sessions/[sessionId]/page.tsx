"use client";

import Link from "next/link";
import { use } from "react";
import { ArrowLeft } from "lucide-react";

import Header from "@/components/Header";
import { SessionDetailDashboard } from "@/components/admin/session-detail-dashboard";
import { Button } from "@/components/ui/button";
import { useAdminSessionDrillDown } from "@/hooks/api/use-admin-analytics";

type AdminSessionPageProps = {
  params: Promise<{ sessionId: string }>;
};

export default function AdminSessionPage({ params }: AdminSessionPageProps) {
  const { sessionId } = use(params);
  const drillDownQuery = useAdminSessionDrillDown(sessionId);

  return (
    <div className="min-h-screen bg-muted/30">
      <Header />

      <main className="mx-auto max-w-[1400px] px-4 py-6 pb-24">
        <div className="mb-6 flex items-center gap-3">
          <Button asChild variant="outline" size="sm">
            <Link href="/admin">
              <ArrowLeft className="size-4" />
              Back to overview
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">
              Session drill-down
            </h1>
            <p className="text-sm text-muted-foreground">
              Per-form progress and entry audit for one session.
            </p>
          </div>
        </div>

        {drillDownQuery.isError ? (
          <p className="text-sm text-destructive">
            Could not load session analytics. The session may not exist.
          </p>
        ) : null}

        <SessionDetailDashboard data={drillDownQuery.data} />
      </main>
    </div>
  );
}
