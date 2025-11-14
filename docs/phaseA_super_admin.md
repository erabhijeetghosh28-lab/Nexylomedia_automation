## Phase A.1 — Super Admin Control Plane

### Goals
- Give product owners full visibility and control over tenant usage, billing, quotas, and feature access.
- Enforce limits on what org admins can provision (users, projects, domains, automations) based on plan/quotas defined by the super admin.
- Provide per-tenant toggles for modules/integrations and a single source of truth for billing state.
- Keep member/org-admin experience scoped to their tenant while honoring the budgets set by the super admin.

### Key Concepts

#### TenantPlan
- `id` (`uuid`, PK)
- `code` (`nvarchar`, unique) — e.g. `starter`, `growth`, `enterprise`
- `name` (`nvarchar`)
- `description` (`nvarchar`)
- `monthlyPrice` (`decimal(10,2)`)
- `annualPrice` (`decimal(10,2)`)
- `currency` (`nvarchar(8)`)
- `isActive` (`bit`)

#### TenantQuota
- `id` (`uuid`, PK)
- `tenant` (`Tenant`, unique, FK)
- `plan` (`TenantPlan`, nullable) — manual overrides allowed
- `maxProjects` (`int`, nullable) — `NULL` = unlimited
- `maxDomains` (`int`, nullable)
- `maxMembers` (`int`, nullable)
- `maxOrgAdmins` (`int`, nullable)
- `maxAutomationsPerMonth` (`int`, nullable)
- `featureFlags` (`json`) — per-module toggles (seo, prospect, campaigns, etc.)
- `billingStatus` (`enum`: `trial`, `active`, `past_due`, `suspended`, `cancelled`)
- `trialEndsAt` (`datetime2`, nullable)
- `currentPeriodEndsAt` (`datetime2`, nullable)
- `notes` (`nvarchar(max)`, nullable) — internal admin notes
- `createdAt` / `updatedAt`

#### TenantUsage (aggregated)
- `id` (`uuid`, PK)
- `tenant` (`Tenant`, unique FK)
- `projectCount` (`int`)
- `domainCount` (`int`)
- `memberCount` (`int`)
- `orgAdminCount` (`int`)
- `automationRunsThisMonth` (`int`)
- `lastCalculatedAt` (`datetime2`)

Usage rows updated periodically (triggers, background job) to support dashboards and enforcement.

### Backend Enhancements

1. **Entities & Repositories**
   - `TenantPlan`, `TenantQuota`, `TenantUsage`
   - Migration to create tables & indexes.

2. **Super Admin API**
   - `GET /api/admin/tenants` → list with usage + plan summary.
   - `GET /api/admin/tenants/:id` → detailed quota, billing, usage history.
   - `PATCH /api/admin/tenants/:id/quota` → update limits/features.
   - `POST /api/admin/tenants` → provision new tenant + org admin invite.
   - `POST /api/admin/plans` → manage plan definitions.
   - `GET /api/admin/billing` → aggregated billing metrics (MRR, churn, etc.).

3. **Middleware Enforcement**
   - Update project/domain/user creation flows to check `TenantQuota` limits:
     - before creating a project: ensure `projectCount < maxProjects` (if set).
     - before creating a domain: ensure `domainCount < maxDomains`.
     - before inviting members/org admins: verify seat limits.
     - before enqueuing automations: check monthly allowance.
   - Return HTTP `402` or `403` with friendly message when over limit.

4. **Org Admin Experience**
   - API responses include remaining allowances (e.g. `maxProjects`, `projectsUsed`, `projectsRemaining`).
   - Surfaces warnings in the org admin UI when nearing limits.

### Frontend Enhancements

1. **Super Admin Portal**
   - Separate router namespace `/admin` guarded by `role === "super_admin"`.
   - Dashboard cards: total tenants, active vs suspended, MRR, trial expirations, top usage outliers.
   - Tenant list table with plan, usage bars, feature toggles, quick actions (suspend, extend trial, upgrade plan).
   - Tenant detail view: quotas (editable), usage charts, billing history, notes, actions (reset API keys, resend invite).
   - Plan management screens: create/update plan definitions, assign to tenants.
   - Integration toggles (global + per tenant).

2. **Org Admin / Member**
   - Access to `/projects` etc. remains, but displays quota info (e.g. “2/5 projects used”).
   - If over limit or suspended, show CTA to contact support or upgrade.

### Data Flow Summary
1. Super admin creates/updates quotas in control plane → stored in `TenantQuota`.
2. When org admins create resources, backend enforcement checks quota vs `TenantUsage`.
3. Nightly or event-driven job rolls up counts into `TenantUsage`.
4. Frontend fetches both quota & usage data to visualize and gate features.

### Additional Considerations
- **Billing Integration**: store external customer IDs (Stripe, Paddle) in `TenantQuota` for invoice links.
- **Audit Logs**: capture all super admin changes to quotas/plans for traceability.
- **Alerts**: background job to email/SaaS notifications when usage exceeds thresholds (e.g., 90% of allowed domains).
- **Tenant Suspension**: `billingStatus = suspended` triggers middleware to block non-admin actions.

### Implementation Plan
1. **Design** (this document) ✅
2. **Backend**:
   - Entities/migrations
   - Admin routes & middleware enforcement
   - Usage aggregation job
3. **Frontend**:
   - Super admin layouts, routing
   - Tenant dashboards + plan editing forms
   - Quota banners in org admin UI

--- 
This doc supplements `phaseA_data_model.md` and guides the super-admin expansion (Phase A.1).


