"use client";

import {
  Activity,
  ClipboardList,
  FileStack,
  Layers,
  Percent,
  TrendingUp,
} from "lucide-react";

import type { AdminDashboardKpis } from "@/lib/api/endpoints/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type AdminKpiGridProps = {
  kpis?: AdminDashboardKpis;
};

const cards = [
  {
    key: "totalSessions" as const,
    label: "Sessions",
    icon: Layers,
    sub: "With matching entries",
  },
  {
    key: "totalEntries" as const,
    label: "Entries",
    icon: ClipboardList,
    sub: "Survey form records",
  },
  {
    key: "avgProgressPercent" as const,
    label: "Avg progress",
    icon: Percent,
    sub: "Across all entries",
    suffix: "%",
  },
  {
    key: "formsTouched" as const,
    label: "Forms touched",
    icon: FileStack,
    sub: (kpis: AdminDashboardKpis) => `of ${kpis.totalForms} forms`,
  },
  {
    key: "entriesUpdatedLast7Days" as const,
    label: "7-day activity",
    icon: Activity,
    sub: "Entries updated",
  },
  {
    key: "completionRate" as const,
    label: "Completion rate",
    icon: TrendingUp,
    sub: "Entries at 100%",
    computed: (kpis: AdminDashboardKpis, completedCount?: number) => {
      if (!kpis.totalEntries) return "0%";
      const rate = Math.round(
        ((completedCount ?? 0) / kpis.totalEntries) * 100,
      );
      return `${rate}%`;
    },
  },
];

export function AdminKpiGrid({
  kpis,
  completedCount,
}: AdminKpiGridProps & { completedCount?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {cards.map((card) => {
        const Icon = card.icon;
        const value =
          card.key === "completionRate"
            ? kpis
              ? card.computed?.(kpis, completedCount)
              : "—"
            : kpis
              ? `${kpis[card.key as keyof AdminDashboardKpis] ?? 0}${card.suffix ?? ""}`
              : "—";
        const subText =
          typeof card.sub === "function"
            ? kpis
              ? card.sub(kpis)
              : "—"
            : card.sub;

        return (
          <Card key={card.key} className="border-border/80">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.label}
              </CardTitle>
              <Icon className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold tabular-nums">
                {kpis ? value : "—"}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{subText}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
