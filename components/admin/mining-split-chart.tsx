"use client";

import { Cell, Pie, PieChart } from "recharts";

import type { AdminMiningSplitItem } from "@/lib/api/endpoints/admin";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const chartConfig = {
  direct: { label: "Direct", color: "hsl(var(--chart-1))" },
  indirect: { label: "Indirect", color: "hsl(var(--chart-5))" },
} satisfies ChartConfig;

type MiningSplitChartProps = {
  data?: AdminMiningSplitItem[];
};

export function MiningSplitChart({ data }: MiningSplitChartProps) {
  const chartData = (data ?? []).map((row) => ({
    ...row,
    label: row.area === "direct" ? "Direct" : "Indirect",
  }));
  const total = chartData.reduce((sum, row) => sum + row.entryCount, 0);

  return (
    <Card className="border-border/80">
      <CardHeader>
        <CardTitle>Mining impact split</CardTitle>
        <CardDescription>Direct vs indirect mining-affected entries</CardDescription>
      </CardHeader>
      <CardContent>
        {data === undefined ? (
          <Skeleton className="mx-auto h-[240px] w-[240px] rounded-full" />
        ) : total === 0 ? (
          <p className="py-12 text-center text-sm text-muted-foreground">
            No entries match the current filters.
          </p>
        ) : (
          <ChartContainer config={chartConfig} className="mx-auto h-[260px] max-w-[320px]">
            <PieChart>
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    nameKey="label"
                    formatter={(value, _name, item) => {
                      const payload = item.payload as AdminMiningSplitItem & {
                        label: string;
                      };
                      return [
                        `${value} entries · ${payload.avgPercent}% avg`,
                        payload.label,
                      ];
                    }}
                  />
                }
              />
              <Pie
                data={chartData}
                dataKey="entryCount"
                nameKey="label"
                innerRadius={56}
                outerRadius={88}
                paddingAngle={2}
              >
                {chartData.map((entry) => (
                  <Cell key={entry.area} fill={`var(--color-${entry.area})`} />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
