"use client";

import { useEffect, useMemo, useState } from "react";

import Header from "@/components/Header";
import { ActivityTimelineChart } from "@/components/admin/activity-timeline-chart";
import { AdminFiltersBar } from "@/components/admin/admin-filters-bar";
import { AdminKpiGrid } from "@/components/admin/admin-kpi-grid";
import { CompletionStatusChart } from "@/components/admin/completion-status-chart";
import { FormProgressChart } from "@/components/admin/form-progress-chart";
import { GeographyChart } from "@/components/admin/geography-chart";
import { MiningSplitChart } from "@/components/admin/mining-split-chart";
import { ProgressBucketsChart } from "@/components/admin/progress-buckets-chart";
import { SessionsProgressTable } from "@/components/admin/sessions-progress-table";
import type { AdminFilters } from "@/lib/api/endpoints/admin";
import {
  useAdminDashboard,
  useAdminSessions,
} from "@/hooks/api/use-admin-analytics";

export default function AdminPage() {
  const [filters, setFilters] = useState<AdminFilters>({});
  const [debouncedFilters, setDebouncedFilters] = useState<AdminFilters>({});
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFilters(filters);
    }, 350);
    return () => clearTimeout(timer);
  }, [filters]);

  const dashboardQuery = useAdminDashboard(debouncedFilters);
  const sessionsQuery = useAdminSessions(debouncedFilters, page, 10);

  const completedCount = useMemo(
    () =>
      (dashboardQuery.data?.formProgress ?? []).reduce(
        (sum, row) => sum + row.completedCount,
        0,
      ),
    [dashboardQuery.data?.formProgress],
  );

  const totalPages = sessionsQuery.data?.pagination?.totalPages ?? 1;

  return (
    <div className="min-h-screen bg-muted/30">
      <Header />

      <main className="mx-auto max-w-[1400px] px-4 py-6 pb-24">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-foreground">
            Admin analytics
          </h1>
          <p className="text-sm text-muted-foreground">
            Global survey progress across sessions, forms, and geography.
          </p>
        </div>

        <div className="space-y-6">
          <AdminFiltersBar
            filters={filters}
            onChange={(next) => {
              setFilters(next);
              setPage(1);
            }}
          />

          {dashboardQuery.isError ? (
            <p className="text-sm text-destructive">
              Could not load dashboard data. Check backend connection and admin token.
            </p>
          ) : null}

          <AdminKpiGrid
            kpis={dashboardQuery.data?.kpis}
            completedCount={completedCount}
          />

          <div className="grid gap-6 xl:grid-cols-2">
            <FormProgressChart data={dashboardQuery.data?.formProgress} />
            <CompletionStatusChart
              formProgress={dashboardQuery.data?.formProgress}
            />
            <ProgressBucketsChart data={dashboardQuery.data?.progressBuckets} />
            <ActivityTimelineChart data={dashboardQuery.data?.timeline} />
            <GeographyChart data={dashboardQuery.data?.geography} />
            <MiningSplitChart data={dashboardQuery.data?.miningSplit} />
          </div>

          <SessionsProgressTable
            rows={sessionsQuery.data?.items}
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      </main>
    </div>
  );
}
