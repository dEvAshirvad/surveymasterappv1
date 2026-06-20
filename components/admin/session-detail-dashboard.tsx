"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import type { AdminSessionDrillDown } from "@/lib/api/endpoints/admin";
import { AdminKpiGrid } from "@/components/admin/admin-kpi-grid";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

const chartConfig = {
  avgPercent: { label: "Avg progress %", color: "hsl(var(--primary))" },
} satisfies ChartConfig;

type SessionDetailDashboardProps = {
  data?: AdminSessionDrillDown;
};

function formatDateTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
}

export function SessionDetailDashboard({
  data,
}: SessionDetailDashboardProps) {
  const chartData = (data?.formProgress ?? []).filter((row) => row.entryCount > 0);
  const completedCount = (data?.formProgress ?? []).reduce(
    (sum, row) => sum + (row.avgPercent >= 100 ? row.entryCount : 0),
    0,
  );

  const dashboardKpis = data
    ? {
        totalSessions: 1,
        totalEntries: data.kpis.entryCount,
        avgProgressPercent: data.kpis.avgProgressPercent,
        formsTouched: data.kpis.formsTouched,
        totalForms: data.kpis.totalForms,
        entriesUpdatedLast7Days: 0,
      }
    : undefined;

  return (
    <div className="space-y-6">
      {data === undefined ? (
        <Skeleton className="h-24 w-full" />
      ) : (
        <div className="rounded-lg border border-border bg-card p-4">
          <h2 className="text-xl font-semibold">{data.session.title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {data.session.context.district} · {data.session.context.block} ·{" "}
            {data.session.context.gramPanchayat} · {data.session.context.village}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Survey date: {data.session.context.surveyDate} · Mining:{" "}
            {data.session.context.miningAffectedArea}
          </p>
        </div>
      )}

      <AdminKpiGrid kpis={dashboardKpis} completedCount={completedCount} />

      <Card className="border-border/80">
        <CardHeader>
          <CardTitle>Per-form progress</CardTitle>
          <CardDescription>Average completion for each form in this session</CardDescription>
        </CardHeader>
        <CardContent>
          {data === undefined ? (
            <Skeleton className="h-[280px] w-full" />
          ) : chartData.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted-foreground">
              No entries in this session yet.
            </p>
          ) : (
            <ChartContainer config={chartConfig} className="h-[280px] w-full">
              <BarChart data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="formCode" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} width={32} domain={[0, 100]} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="avgPercent"
                  fill="var(--color-avgPercent)"
                  radius={4}
                />
              </BarChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>

      <Card className="border-border/80">
        <CardHeader>
          <CardTitle>Entries</CardTitle>
          <CardDescription>All form entries in this session</CardDescription>
        </CardHeader>
        <CardContent>
          {data === undefined ? (
            <Skeleton className="h-[200px] w-full" />
          ) : !data.entries.length ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No entries in this session yet.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Form</TableHead>
                  <TableHead>Surveyor</TableHead>
                  <TableHead className="min-w-[160px]">Progress</TableHead>
                  <TableHead>Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.entries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="font-medium">Form {entry.formCode}</TableCell>
                    <TableCell>{entry.surveyorName || "—"}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={entry.percent} className="h-2" />
                        <span className="w-10 text-right text-xs tabular-nums">
                          {entry.percent}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDateTime(entry.updatedAt)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
