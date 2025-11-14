# Phase A — Project & SEO Autopilot Domain Model

## Goals
- Track projects per tenant with clear ownership and lifecycle status.
- Capture member-submitted domains and org-admin approvals in a single workflow.
- Persist discovered site pages and PageSpeed/SEO audits for downstream automation.
- Normalize data so BullMQ workers can enqueue scans, audits, and fix-generation jobs with minimal joins.

## Core Entities

### Project
- `id` (`uuid`, PK)
- `tenant` (`Tenant`, many-to-one, indexed)
- `slug` (`nvarchar`, unique per tenant)
- `name` (`nvarchar`)
- `status` (`enum`: `active`, `paused`, `archived`)
- `description` (`nvarchar`, nullable)
- `createdBy` (`User`, many-to-one)
- `createdAt` / `updatedAt`

### ProjectDomain
- `id` (`uuid`, PK)
- `project` (`Project`, many-to-one, indexed)
- `host` (`nvarchar`, lowercased, unique per tenant+host)
- `status` (`enum`: `pending`, `approved`, `rejected`, `suspended`)
- `isPrimary` (`boolean`, default false)
- `verificationToken` (`nvarchar`, nullable) — issued on submission
- `submittedBy` (`User`, many-to-one, eager)
- `approvedBy` (`User`, many-to-one, nullable)
- `approvedAt` (`datetime`, nullable)
- `notes` (`nvarchar`, nullable) — reviewer feedback
- `createdAt` / `updatedAt`

### SitePage
- `id` (`uuid`, PK)
- `project` (`Project`, many-to-one, indexed)
- `domain` (`ProjectDomain`, many-to-one, nullable for legacy pages)
- `urlPath` (`nvarchar`, stores path/query, indexed)
- `fullUrl` (`nvarchar`, unique per project)
- `origin` (`enum`: `sitemap`, `robots`, `manual`)
- `httpStatus` (`int`, nullable)
- `checksum` (`nvarchar`, nullable) — content hash for change detection
- `lastDiscoveredAt` / `lastCrawledAt`
- `isIndexed` (`boolean`, default true)
- `metadata` (`jsonb`) — title, meta tags snapshot
- Soft-delete flag for stale pages (future)

### SeoAudit
- `id` (`uuid`, PK)
- `project` (`Project`, many-to-one, indexed)
- `page` (`SitePage`, many-to-one, nullable when project-level audit)
- `type` (`enum`: `pagespeed`, `seo`, `lighthouse`)
- `status` (`enum`: `pending`, `queued`, `running`, `completed`, `failed`)
- `trigger` (`enum`: `manual`, `scheduled`, `auto_regression`)
- `runner` (`enum`: `mock`, `live`)
- `score` (`decimal`, nullable)
- `rawResult` (`jsonb`) — vendor payload
- `summary` (`nvarchar`, nullable) — quick findings
- `jobId` (`nvarchar`, nullable) — BullMQ reference
- `startedAt` / `completedAt`

### SeoIssue
- `id` (`uuid`, PK)
- `audit` (`SeoAudit`, many-to-one, cascade delete)
- `code` (`nvarchar`, indexed) — e.g. `pagespeed:first_contentful_paint`
- `severity` (`enum`: `info`, `low`, `medium`, `high`, `critical`)
- `category` (`enum`: `performance`, `accessibility`, `seo`, `best_practices`)
- `description` (`nvarchar`)
- `metricValue` (`decimal`, nullable)
- `threshold` (`decimal`, nullable)
- `recommendation` (`nvarchar`)
- `status` (`enum`: `open`, `in_progress`, `resolved`, `ignored`)
- `resolvedAt` (`datetime`, nullable)

### SeoFix
- `id` (`uuid`, PK)
- `issue` (`SeoIssue`, one-to-one or many-to-one when multiple suggestions)
- `provider` (`enum`: `gpt`, `gemini`, `mock`, `manual`)
- `content` (`jsonb`) — structured fix instructions/snippets
- `createdBy` (`User`, nullable) — when manual edit supplied
- `createdAt`

## Queue Channels
- `seo:discovery` — seeds sitemap/robots crawl jobs (`ProjectDomain` → `SitePage`).
- `seo:pagespeed` — runs PageSpeed audits (`SitePage` → `SeoAudit`).
- `seo:fixes` — invokes AI fix generators (`SeoIssue` → `SeoFix`).

Workers store BullMQ `jobId` on `SeoAudit` / `SeoFix` rows and update status fields as they progress.

## API Surface (Draft)
- `POST /api/projects` — create project (org admin).
- `GET /api/projects` — list tenant projects with domain counts.
- `POST /api/projects/:projectId/domains` — member submission (`status=pending`).
- `PATCH /api/projects/:projectId/domains/:domainId` — approval/rejection (org admin).
- `POST /api/seo/projects/:projectId/discovery` — enqueue sitemap crawl.
- `POST /api/seo/pages/:pageId/audits` — enqueue PageSpeed audit.
- `GET /api/seo/audits` — list audits with status filters.
- `GET /api/seo/audits/:auditId/issues` — detail issues + fix recommendations.

All routes require `requireAuth`, `requireTenantContext`, and role guard (`org_admin` for approvals, `member` allowed for submissions & manual triggers when permitted).

## Notes & Open Questions
- Need migration strategy (TypeORM `synchronize=false`); prefer generated migrations checked into `src/migrations`.
- Decide whether `SitePage.metadata` uses SQL `json` (MSSQL `nvarchar(max)`) vs. relational tables — JSON blob acceptable for Phase A.
- Evaluate storing PageSpeed raw payloads in Azure Blob/MinIO for large bodies; Phase A keeps in database with size limits.
- Consider `ProjectUser` join table for project-specific permissions in later phases.
- Placeholder mocks: when API key missing, queues enqueue `runner=mock` and workers generate deterministic fixture payloads.

## Implementation Checklist
- ✅ Add entities (`Project`, `ProjectDomain`, `SitePage`, `SeoAudit`, `SeoIssue`, `SeoFix`) and repositories.
- ✅ Register entities + `src/migrations/*.ts` glob in `AppDataSource`.
- ✅ Create initial migration `20251114000100-PhaseAProjectsSeo` covering new tables, indexes, and foreign keys.
- ✅ Expose `/api/projects` + `/api/projects/:id/domains` routes for creation, listing, submissions, and approvals.
- ⏳ Queue worker scaffolding & SEO job orchestration (next milestone).


