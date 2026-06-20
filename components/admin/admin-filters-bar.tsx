"use client";

import { RotateCcw } from "lucide-react";

import { FORMS } from "@/components/forms/forms";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { AdminFilters } from "@/lib/api/endpoints/admin";
import {
  useSessionBlockOptions,
  useSessionDistrictOptions,
  useSessionGramPanchayatOptions,
} from "@/hooks/api/use-sessions";

type AdminFiltersBarProps = {
  filters: AdminFilters;
  onChange: (filters: AdminFilters) => void;
};

export function AdminFiltersBar({ filters, onChange }: AdminFiltersBarProps) {
  const districtsQuery = useSessionDistrictOptions();
  const blocksQuery = useSessionBlockOptions(filters.district);
  const gpsQuery = useSessionGramPanchayatOptions(
    filters.district,
    filters.block,
  );

  const update = (patch: Partial<AdminFilters>) => {
    onChange({ ...filters, ...patch });
  };

  const reset = () => onChange({});

  return (
    <div className="grid gap-4 rounded-lg border border-border bg-card p-4 md:grid-cols-2 xl:grid-cols-4">
      <div className="space-y-2">
        <Label>District</Label>
        <Select
          value={filters.district ?? "all"}
          onValueChange={(value) =>
            update({
              district: value === "all" ? undefined : value,
              block: undefined,
              gramPanchayat: undefined,
            })
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All districts" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All districts</SelectItem>
            {(districtsQuery.data ?? []).map((district) => (
              <SelectItem key={district} value={district}>
                {district}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Block</Label>
        <Select
          value={filters.block ?? "all"}
          onValueChange={(value) =>
            update({
              block: value === "all" ? undefined : value,
              gramPanchayat: undefined,
            })
          }
          disabled={!filters.district}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All blocks" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All blocks</SelectItem>
            {(blocksQuery.data ?? []).map((block) => (
              <SelectItem key={block} value={block}>
                {block}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Gram Panchayat</Label>
        <Select
          value={filters.gramPanchayat ?? "all"}
          onValueChange={(value) =>
            update({
              gramPanchayat: value === "all" ? undefined : value,
            })
          }
          disabled={!filters.district || !filters.block}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All GPs" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All GPs</SelectItem>
            {(gpsQuery.data ?? []).map((gp) => (
              <SelectItem key={gp} value={gp}>
                {gp}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Form</Label>
        <Select
          value={filters.formCode ?? "all"}
          onValueChange={(value) =>
            update({ formCode: value === "all" ? undefined : value })
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All forms" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All forms</SelectItem>
            {FORMS.map((form) => (
              <SelectItem key={form.code} value={form.code}>
                Form {form.code}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="admin-from">From</Label>
        <Input
          id="admin-from"
          type="date"
          value={filters.from?.slice(0, 10) ?? ""}
          onChange={(event) =>
            update({
              from: event.target.value
                ? new Date(event.target.value).toISOString()
                : undefined,
            })
          }
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="admin-to">To</Label>
        <Input
          id="admin-to"
          type="date"
          value={filters.to?.slice(0, 10) ?? ""}
          onChange={(event) =>
            update({
              to: event.target.value
                ? new Date(event.target.value).toISOString()
                : undefined,
            })
          }
        />
      </div>

      <div className="flex items-end md:col-span-2 xl:col-span-2">
        <Button type="button" variant="outline" onClick={reset}>
          <RotateCcw className="size-4" />
          Reset filters
        </Button>
      </div>
    </div>
  );
}
