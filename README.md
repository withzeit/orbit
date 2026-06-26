# Orbit

A life organizer app — workspaces, projects, and tasks to manage different areas of your life and business.

## Stack

| Layer | Tech |
|-------|------|
| Frontend | React, Vite, Tailwind CSS, TanStack Router & Query |
| Backend | Node.js, Fastify, Sequelize |
| Database | PostgreSQL |
| Monorepo | pnpm workspaces + Turborepo |

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

### 4. Run development servers

```bash
pnpm dev
```

- **Web:** http://localhost:5173
- **API:** http://localhost:3001/api/v1/health

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
|---------|-------------|
| `pnpm dev` | Start all apps in dev mode |
| `pnpm build` | Build all apps |
| `pnpm typecheck` | Run TypeScript across the monorepo |
| `pnpm lint` | Lint all packages |

## Roadmap

- [x] Phase 0 — Monorepo scaffold, health check, deploy-ready config
- [ ] Phase 1 — Auth (httpOnly cookies)
- [ ] Phase 2 — Workspaces & projects
- [ ] Phase 3 — Tasks & kanban
- [ ] Phase 4 — Polish & tests
