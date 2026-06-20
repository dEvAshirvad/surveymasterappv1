"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import type { AdminProgressBucket } from "@/lib/api/endpoints/admin";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const chartConfig = {
  count: { label: "Entries", color: "hsl(var(--primary))" },
} satisfies ChartConfig;

type ProgressBucketsChartProps = {
  data?: AdminProgressBucket[];
};

export function ProgressBucketsChart({ data }: ProgressBucketsChartProps) {
  const chartData = (data ?? []).map((row) => ({
    ...row,
    label: `${row.bucket}%`,
  }));
  const total = chartData.reduce((sum, row) => sum + row.count, 0);

  return (
    <Card className="border-border/80">
      <CardHeader>
        <CardTitle>Progress distribution</CardTitle>
        <CardDescription>Histogram of entry completion percentages</CardDescription>
      </CardHeader>
      <CardContent>
        {data === undefined ? (
          <Skeleton className="h-[240px] w-full" />
        ) : total === 0 ? (
          <p className="py-12 text-center text-sm text-muted-foreground">
            No entries match the current filters.
          </p>
        ) : (
          <ChartContainer config={chartConfig} className="h-[240px] w-full">
            <BarChart data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="label" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} width={32} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="count" fill="var(--color-count)" radius={4} />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
