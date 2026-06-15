import {
  Building2,
  CircleHelp,
  CircleUserRound,
} from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

export default function Header() {
  return (
    <header className="border-b border-border bg-[var(--survey-surface)]">
      <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex size-8 items-center justify-center bg-primary text-primary-foreground">
            <Building2 className="size-4" />
          </div>
          <div className="leading-tight">
            <p className="text-[13px] font-semibold text-foreground">
              DMFT Baseline Survey — Chhattisgarh
            </p>
            <p className="text-[11px] text-muted-foreground">
              Mineral Resources Dept
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-3 text-muted-foreground">
          <Link href="/sessions">
          <Button>
            Sessions
          </Button>
          </Link>
          <button
            aria-label="Help"
            className="inline-flex size-7 items-center justify-center border border-border hover:bg-muted"
          >
            <CircleHelp className="size-4" />
          </button>
          <button
            aria-label="Profile"
            className="inline-flex size-7 items-center justify-center border border-border hover:bg-muted"
          >
            <CircleUserRound className="size-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
