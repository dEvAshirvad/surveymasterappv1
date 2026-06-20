"use client";

import Link from "next/link";

import type { AdminSessionProgressRow } from "@/lib/api/endpoints/admin";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type SessionsProgressTableProps = {
  rows?: AdminSessionProgressRow[];
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString();
}

export function SessionsProgressTable({
  rows,
  page,
  totalPages,
  onPageChange,
}: SessionsProgressTableProps) {
  return (
    <Card className="border-border/80">
      <CardHeader>
        <CardTitle>Sessions</CardTitle>
        <CardDescription>Progress overview with drill-down links</CardDescription>
      </CardHeader>
      <CardContent>
        {rows === undefined ? (
          <Skeleton className="h-[240px] w-full" />
        ) : !rows.length ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No sessions match the current filters.
          </p>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Session</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Entries</TableHead>
                  <TableHead>Forms</TableHead>
                  <TableHead className="min-w-[160px]">Progress</TableHead>
                  <TableHead>Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.sessionId}>
                    <TableCell>
                      <Link
                        href={`/admin/sessions/${row.sessionId}`}
                        className="font-medium text-primary hover:underline"
                      >
                        {row.title}
                      </Link>
                      <p className="text-xs text-muted-foreground">
                        Survey {formatDate(row.surveyDate)}
                      </p>
                    </TableCell>
                    <TableCell className="text-sm">
                      {row.district}
                      <br />
                      <span className="text-muted-foreground">
                        {row.block} · {row.gramPanchayat}
                      </span>
                    </TableCell>
                    <TableCell>{row.entryCount}</TableCell>
                    <TableCell>{row.formsTouched}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={row.avgProgressPercent} className="h-2" />
                        <span className="w-10 text-right text-xs tabular-nums">
                          {row.avgProgressPercent}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(row.lastUpdatedAt)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {totalPages > 1 ? (
              <Pagination className="mt-4">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(event) => {
                        event.preventDefault();
                        if (page > 1) onPageChange(page - 1);
                      }}
                    />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#" isActive>
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(event) => {
                        event.preventDefault();
                        if (page < totalPages) onPageChange(page + 1);
                      }}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            ) : null}
          </>
        )}
      </CardContent>
    </Card>
  );
}
