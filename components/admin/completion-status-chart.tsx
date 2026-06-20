"use client";

import { Cell, Pie, PieChart } from "recharts";

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
  notStarted: { label: "Not started", color: "hsl(var(--chart-4))" },
  inProgress: { label: "In progress", color: "hsl(var(--chart-2))" },
  completed: { label: "Completed", color: "hsl(var(--chart-1))" },
} satisfies ChartConfig;

type CompletionStatusChartProps = {
  formProgress?: AdminFormProgressItem[];
};

export function CompletionStatusChart({
  formProgress,
}: CompletionStatusChartProps) {
  const totals = (formProgress ?? []).reduce(
    (acc, row) => ({
      notStarted: acc.notStarted + row.notStartedCount,
      inProgress: acc.inProgress + row.inProgressCount,
      completed: acc.completed + row.completedCount,
    }),
    { notStarted: 0, inProgress: 0, completed: 0 },
  );

  const chartData = [
    { status: "notStarted", label: "Not started", value: totals.notStarted },
    { status: "inProgress", label: "In progress", value: totals.inProgress },
    { status: "completed", label: "Completed", value: totals.completed },
  ].filter((row) => row.value > 0);

  const total = chartData.reduce((sum, row) => sum + row.value, 0);

  return (
    <Card className="border-border/80">
      <CardHeader>
        <CardTitle>Completion status</CardTitle>
        <CardDescription>Share of entries by progress state</CardDescription>
      </CardHeader>
      <CardContent>
        {formProgress === undefined ? (
          <Skeleton className="mx-auto h-[240px] w-[240px] rounded-full" />
        ) : total === 0 ? (
          <p className="py-12 text-center text-sm text-muted-foreground">
            No entries match the current filters.
          </p>
        ) : (
          <ChartContainer config={chartConfig} className="mx-auto h-[260px] max-w-[320px]">
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent nameKey="label" />} />
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="label"
                innerRadius={56}
                outerRadius={88}
                paddingAngle={2}
              >
                {chartData.map((entry) => (
                  <Cell
                    key={entry.status}
                    fill={`var(--color-${entry.status})`}
                  />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
