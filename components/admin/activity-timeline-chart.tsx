"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import type { AdminTimelineItem } from "@/lib/api/endpoints/admin";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const chartConfig = {
  entriesCreated: { label: "Created", color: "hsl(var(--chart-1))" },
  entriesUpdated: { label: "Updated", color: "hsl(var(--chart-2))" },
} satisfies ChartConfig;

type ActivityTimelineChartProps = {
  data?: AdminTimelineItem[];
};

export function ActivityTimelineChart({ data }: ActivityTimelineChartProps) {
  const chartData = (data ?? []).map((row) => ({
    ...row,
    label: row.date.slice(5),
  }));
  const total = chartData.reduce(
    (sum, row) => sum + row.entriesCreated + row.entriesUpdated,
    0,
  );

  return (
    <Card className="border-border/80">
      <CardHeader>
        <CardTitle>Activity timeline</CardTitle>
        <CardDescription>Entries created vs updated (last 30 days)</CardDescription>
      </CardHeader>
      <CardContent>
        {data === undefined ? (
          <Skeleton className="h-[240px] w-full" />
        ) : total === 0 ? (
          <p className="py-12 text-center text-sm text-muted-foreground">
            No recent activity in the last 30 days.
          </p>
        ) : (
          <ChartContainer config={chartConfig} className="h-[240px] w-full">
            <AreaChart data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                minTickGap={24}
              />
              <YAxis tickLine={false} axisLine={false} width={32} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="entriesCreated"
                stackId="a"
                fill="var(--color-entriesCreated)"
                stroke="var(--color-entriesCreated)"
                fillOpacity={0.35}
              />
              <Area
                type="monotone"
                dataKey="entriesUpdated"
                stackId="b"
                fill="var(--color-entriesUpdated)"
                stroke="var(--color-entriesUpdated)"
                fillOpacity={0.35}
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
