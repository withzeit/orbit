# Orbit

A life organizer app — workspaces, projects, and tasks to manage different areas of your life and business.

## Stack

| Layer    | Tech                                               |
| -------- | -------------------------------------------------- |
| Frontend | React, Vite, Tailwind CSS, TanStack Router & Query |
| Backend  | Node.js, Fastify, Sequelize                        |
| Database | PostgreSQL                                         |
| Monorepo | pnpm workspaces + Turborepo                        |

## Prerequisites

- Node.js 20+
- pnpm 9+
- Docker (for local Postgres)

## Getting started

### 1. Install dependencies

```bash
pnpm install
```

### 2. Start Postgres

```bash
docker compose up -d
```

### 3. Configure environment

```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
```

### 4. Run migrations

```bash
pnpm --filter @orbit/api db:migrate
```

For local testing before Phase 1 auth is merged, seed a dev user and JWT:

```bash
pnpm --filter @orbit/api dev:seed
```

Paste the printed `document.cookie` line in your browser console, then open the dashboard.

### 5. Run development servers

```bash
pnpm dev
```

- **Web:** [http://localhost:5173](http://localhost:5173)
- **API:** [http://localhost:3001/api/v1/health](http://localhost:3001/api/v1/health) (Vite proxies `/api` to the API in dev)
- **Dashboard:** [http://localhost:5173/dashboard](http://localhost:5173/dashboard) (requires auth cookie)

## Project structure

```
orbit/
├── apps/
│   ├── api/          # Fastify API
│   └── web/          # React SPA
├── packages/
│   └── shared/       # Shared types & Zod schemas
├── docker-compose.yml
└── turbo.json
```

## Phase 2 — Workspaces & projects API

All routes require auth (`access_token` httpOnly cookie via Phase 1 JWT).

| Method | Path | Description |
| ------ | ---- | ----------- |
| GET | `/api/v1/workspaces` | List workspaces for current user |
| POST | `/api/v1/workspaces` | Create workspace |
| GET | `/api/v1/workspaces/:id` | Get workspace |
| PATCH | `/api/v1/workspaces/:id` | Update workspace |
| DELETE | `/api/v1/workspaces/:id` | Delete workspace (cascades projects) |
| GET | `/api/v1/workspaces/:workspaceId/projects` | List projects |
| POST | `/api/v1/workspaces/:workspaceId/projects` | Create project |
| PATCH | `/api/v1/projects/:id` | Update project |
| DELETE | `/api/v1/projects/:id` | Delete project |

Shared Zod schemas: `packages/shared/src/workspace.ts`, `packages/shared/src/project.ts`.

## Migration ordering (Phase 1–3)

1. Phase 1 — `users` (or `20250629110000-create-users.cjs` from Phase 2 if auth not merged yet)
2. Phase 2 — `workspaces`, then `projects`
3. Phase 3 — `tasks` (FK to `projects` and `users`)

## Merge notes

### Phase 1 (Auth)

- Call `createDefaultPersonalWorkspace(models, userId)` after register or first login (`apps/api/src/lib/default-workspace.ts`).
- Reuse `authenticate` in `apps/api/src/lib/authenticate.ts` (expects JWT `{ sub: userId }`).
- If Phase 1 adds its own `users` migration, drop the duplicate from Phase 2 and renumber workspace/project migrations.

### Phase 3 (Tasks)

**Schema contract — do not change without coordination:**

| Model | Fields |
| ----- | ------ |
| Workspace | `id`, `user_id`, `name`, `slug`, `type` (`personal` \| `business` \| `custom`), timestamps |
| Project | `id`, `workspace_id`, `name`, `color`, `sort_order`, timestamps |

- Add `tasks` table with FK to `projects.id` and `users.id`.
- Reuse `assertProjectOwnership` from `apps/api/src/lib/ownership.ts`.
- Register task routes in `app.ts` alongside workspace/project routes.
- Frontend: link kanban from project rows when Phase 3 merges.

## Deployment

### Database — Neon

1. Create a project at [neon.tech](https://neon.tech)
2. Copy the connection string → `DATABASE_URL` on Railway

### API — Railway

1. Connect this repo and set root directory to `apps/api` (or deploy from monorepo with build command)
2. Set environment variables:
   - `DATABASE_URL` — from Neon
   - `JWT_SECRET` — long random string
   - `CORS_ORIGIN` — your Vercel URL (e.g. `https://orbit-xxx.vercel.app`)
   - `NODE_ENV=production`
   - `DATABASE_SSL=true` (for Neon)
3. Start command: `node dist/server.js`
4. Build command: `pnpm install && pnpm --filter @orbit/api build`

### Web — Vercel

1. Import repo, set root directory to `apps/web`
2. Set `VITE_API_URL` to your Railway API URL
3. Deploy

After first deploy, update Railway `CORS_ORIGIN` to match your Vercel production URL.

## Scripts

| Command | Description |
| ------- | ----------- |
| `pnpm dev` | Start all apps in dev mode |
| `pnpm build` | Build all apps |
| `pnpm typecheck` | Run TypeScript across the monorepo |
| `pnpm lint` | Lint all packages |
| `pnpm --filter @orbit/api db:migrate` | Run database migrations |
| `pnpm --filter @orbit/api dev:seed` | Seed demo user for local auth testing |

## Auth (Phase 1)

After migrations, create a demo user:

```bash
pnpm --filter @orbit/api db:migrate
pnpm --filter @orbit/api dev:seed
```

Demo credentials: `demo@orbit.app` / `demo1234`

Auth endpoints (under `/api/v1/auth`): `POST /register`, `POST /login`, `POST /refresh`, `POST /logout`, `GET /me`.

## Roadmap

- [x] Phase 0 — Monorepo scaffold, health check, deploy-ready config
- [x] Phase 1 — Auth (httpOnly cookies)
- [x] Phase 2 — Workspaces & projects
- [x] Phase 3 — Tasks & kanban
- [ ] Phase 4 — Polish & tests
