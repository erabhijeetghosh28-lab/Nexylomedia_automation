# Backend Implementation Plan (Local Dev)

This plan reflects the latest workflow decisions:

- **Org Admins** manage projects (one project = one domain) and configure shared API keys.
- **Members/Individuals** can submit domains for approval and execute tool workflows scoped to their assigned projects.
- Every backend module is project-aware and enforces role-based access.
- All services run locally via `infra/docker-compose.local.yml` (MSSQL, Redis, MinIO, n8n, Mailhog, backend).

---

## Phase A — Project & SEO Autopilot Core
1. Project + domain management (Org Admin UI, member submissions, approval flow).
2. Robots.txt / sitemap discovery → persist site pages per project.
3. PageSpeed runner (mock by default, live when API key present), audit storage.
4. GPT/Gemini fix generator (mock fallback).
5. `/api/seo/...` routes + BullMQ workers, role-protected.

## Phase B — Prospect Radar
1. CSV upload & validation, per-project storage.
2. AI enrichment + scoring jobs (mock/GPT).
3. Member submission queue & Org Admin approval.
4. Prospect APIs, dashboards, n8n webhook for imports.

## Phase C — Marketing Research
1. Keyword explorer, competitor analysis, persona endpoints (mock/Gemini).
2. Persist insights per project.
3. Role-aware access (Org admin vs member views).

## Phase D — Campaigns & Ads
1. Campaign CRUD, analytics adapters, project scoping.
2. Ads builder (AI copy generator, templates, provider stub).
3. Role controls (Org admin manages campaigns, members execute tasks).

## Phase E — Content & Influencer Ops
1. Content calendar CRUD, publishing workflow, comments/approvals.
2. Influencer roster import, search/filter, brief generation.
3. Member “My tasks” integration per project.

## Phase F — DAM & Reporting
1. Asset uploads via MinIO signed URLs, tagging, permissions.
2. HTML → PDF report generation, MinIO storage, schedules.
3. Expose endpoints for downloading/sharing reports.

## Phase G — Automations, n8n & DX
1. n8n webhook endpoints (SEO, prospect, reports) + sample flows.
2. Harden worker scripts, logging, error handling.
3. Fixtures (mock PageSpeed, prospects, GPT responses).
4. README-local.md, docs/local-dev.md, integration tests, GitHub CI.

---

### Global Requirements
- TypeORM entities & migrations for multi-tenant org → project → sitePage hierarchy.
- JWT-based auth, role middleware, tenant context resolver used by every route.
- Configuration via `.env` (mock-friendly defaults), documented in README-local.md.
- Queue workers use Redis (BullMQ) and respect project context.
- All endpoints return project-scoped data and enforce Org Admin vs Member permissions.

### Dev Workflow Snapshot
1. `cp .env.example .env` and fill secrets.
2. `docker-compose -f infra/docker-compose.local.yml up -d`.
3. `cd packages/backend && npm install && npm run dev`.
4. `npm run worker` (separate terminal).
5. Optional: import n8n flows (`packages/n8n-flows`) at http://localhost:5678.

