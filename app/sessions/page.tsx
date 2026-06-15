"use client";

import Link from "next/link";
import { ArrowRight, PencilLine, Plus } from "lucide-react";

import Header from "@/components/Header";
import { useSessions } from "@/hooks/api/use-sessions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

function formatSurveyDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleDateString();
}

export default function SessionsPage() {
  const sessionsQuery = useSessions();
  const sessions = sessionsQuery.data ?? [];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto mt-6 max-w-[1100px] pb-24">
        <section className="border border-border bg-card p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Sessions</h1>
              <p className="text-sm text-muted-foreground">
                View and edit survey sessions.
              </p>
            </div>
            <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Link href="/new-session">
                <Plus className="size-4" />
                New Session
              </Link>
            </Button>
          </div>

          {sessionsQuery.isLoading ? (
            <p className="text-sm text-muted-foreground">Loading sessions...</p>
          ) : null}

          {sessionsQuery.isError ? (
            <p className="text-sm text-destructive">
              Could not load sessions. Check backend connection.
            </p>
          ) : null}

          {!sessionsQuery.isLoading && sessions.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No sessions found. Create one to get started.
            </p>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2">
            {sessions.map(session => (
              <article key={session.id} className="border border-border bg-background p-4">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <h2 className="text-base font-semibold text-foreground">{session.title}</h2>
                  <Badge variant="outline">Active</Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {session.context.block} · GP {session.context.gramPanchayat} ·{" "}
                  {session.context.village}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Survey Date: {formatSurveyDate(session.context.surveyDate)}
                </p>

                <div className="mt-4 flex gap-2">
                  <Button asChild className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
                    <Link href={`/?sessionId=${session.id}`}>
                      Open
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="flex-1">
                    <Link href={`/session/${session.id}/edit`}>
                      <PencilLine className="size-4" />
                      Edit
                    </Link>
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
