"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import type { AdminFormProgressItem } from "@/lib/api/endpoints/admin";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const chartConfig = {
  avgPercent: { label: "Avg progress %", color: "hsl(var(--primary))" },
  entryCount: { label: "Entries", color: "hsl(var(--chart-2))" },
} satisfies ChartConfig;

type FormProgressChartProps = {
  data?: AdminFormProgressItem[];
};

export function FormProgressChart({ data }: FormProgressChartProps) {
  const chartData = (data ?? []).filter((row) => row.entryCount > 0);

  return (
    <Card className="border-border/80">
      <CardHeader>
        <CardTitle>Form progress</CardTitle>
        <CardDescription>Average completion by form code (A–O)</CardDescription>
      </CardHeader>
      <CardContent>
        {data === undefined ? (
          <Skeleton className="h-[280px] w-full" />
        ) : chartData.length === 0 ? (
          <p className="py-12 text-center text-sm text-muted-foreground">
            No entries match the current filters.
          </p>
        ) : (
          <ChartContainer config={chartConfig} className="h-[280px] w-full">
            <BarChart data={chartData} margin={{ left: 8, right: 8 }}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="formCode" tickLine={false} axisLine={false} />
              <YAxis yAxisId="left" tickLine={false} axisLine={false} width={32} />
              <YAxis
                yAxisId="right"
                orientation="right"
                tickLine={false}
                axisLine={false}
                width={32}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar
                yAxisId="left"
                dataKey="avgPercent"
                fill="var(--color-avgPercent)"
                radius={4}
              />
              <Bar
                yAxisId="right"
                dataKey="entryCount"
                fill="var(--color-entryCount)"
                radius={4}
              />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
