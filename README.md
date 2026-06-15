# DMFT Survey Collection — Frontend

Next.js frontend for the DMFT baseline survey collection tool. Product spec lives in [`.cursor/PRD.mdc`](.cursor/PRD.mdc).

## Repo layout

| Package | Path | Port |
| --- | --- | --- |
| **This repo** (frontend) | `app/` | `3000` |
| Backend API (sibling) | `../api` | `3001` |

## Stack

- **Next.js 16** App Router
- **TanStack React Query v5** — server state (`components/providers/query-provider.tsx`)
- **axios** — HTTP client with API envelope unwrapping (`lib/api/client.ts`)
- **shadcn/ui** (radix-lyra) + Tailwind CSS v4
- **sonner** — toasts

## Getting started

```bash
# 1. Install dependencies
pnpm install

# 2. Configure environment
cp .env.example .env.local

# 3. Start backend (separate terminal, sibling repo)
cd ../api && docker compose -f db.yml up -d && pnpm dev

# 4. Start frontend
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). API runs at [http://localhost:3001](http://localhost:3001).

## Environment

| Variable | Default | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | `http://localhost:3001` | Express API base URL (axios) |

## API client usage

```ts
import { apiGet, apiPost } from "@/lib/api/client";

// Public read
const sessions = await apiGet("/api/v1/sessions");

// Session detail
const session = await apiGet(`/api/v1/sessions/${id}`);
```

TanStack Query keys are centralized in `lib/api/query-keys.ts`.

## Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Dev server on port 3000 |
| `pnpm build` | Production build |
| `pnpm typecheck` | TypeScript check |
| `pnpm lint` | ESLint |

## shadcn/ui

Configured in [`components.json`](components.json). Add components:

```bash
pnpm dlx shadcn@latest add <component>
```

Components live in `components/ui/`.

## Backend status

The sessions and session-entries APIs are ready:
- `POST/GET /api/v1/sessions`
- `GET /api/v1/sessions/:id`
- `GET/POST /api/v1/sessions/:id/entries`
- `GET/PATCH/DELETE /api/v1/sessions/:id/entries/:entryId`
- `POST /api/v1/sessions/:id/entries/:entryId/submit`
