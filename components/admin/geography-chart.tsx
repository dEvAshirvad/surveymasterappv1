"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import type { AdminGeographyItem } from "@/lib/api/endpoints/admin";
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
  entryCount: { label: "Entries", color: "hsl(var(--chart-3))" },
} satisfies ChartConfig;

type GeographyChartProps = {
  data?: AdminGeographyItem[];
};

export function GeographyChart({ data }: GeographyChartProps) {
  const chartData = (data ?? [])
    .slice(0, 10)
    .map((row) => ({
      ...row,
      label: `${row.district} · ${row.block}`,
    }));

  return (
    <Card className="border-border/80">
      <CardHeader>
        <CardTitle>Geography</CardTitle>
        <CardDescription>Top districts and blocks by entry volume</CardDescription>
      </CardHeader>
      <CardContent>
        {data === undefined ? (
          <Skeleton className="h-[280px] w-full" />
        ) : chartData.length === 0 ? (
          <p className="py-12 text-center text-sm text-muted-foreground">
            No geographic data for the current filters.
          </p>
        ) : (
          <ChartContainer config={chartConfig} className="h-[280px] w-full">
            <BarChart data={chartData} layout="vertical" margin={{ left: 8 }}>
              <CartesianGrid horizontal={false} />
              <XAxis type="number" tickLine={false} axisLine={false} />
              <YAxis
                type="category"
                dataKey="label"
                tickLine={false}
                axisLine={false}
                width={120}
                tick={{ fontSize: 11 }}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar
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
