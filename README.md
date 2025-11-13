# Nexylomedia Automation – Reboot

Fresh rebuild of the Nexylomedia Automation platform. This repository now contains:

- **backend/** – Flask API skeleton with configuration scaffolding
- **frontend/** – Vite + React + TypeScript application prepared for Tailwind-driven UI
- **n8n/** – Existing workflow assets (unchanged)

## Quick start

### Backend (Flask)

```bash
python -m venv .venv
.venv\Scripts\activate  # Windows PowerShell
pip install -r requirements.txt
python app.py
```

The backend currently exposes a single `GET /api/health` endpoint and will be expanded in later phases.

### Frontend (Vite + React + Tailwind)

```bash
cd frontend
npm install
npm run dev
```

Open <http://localhost:5173>. A preview switcher (top-right on ≥lg screens) lets you toggle between:

- Component Library showcase (design tokens + primitives)
- Org Admin suite: dashboard, team/users, organization settings, integrations, feature flags, usage & quotas

## Project structure

```
backend/
  __init__.py         # Flask application factory
  api/                # Blueprint namespace (empty for now)
  utils/              # Backend utilities placeholder
frontend/
  src/
    components/       # Reusable UI components (phase 2+)
    layouts/          # AppShell and layout primitives
    pages/            # Route-level pages (to be populated)
    styles/           # Global styles & theming
    data/             # Mock/demo data
    lib/              # Shared hooks & helpers
n8n/                  # Existing automation workflows
config.py             # Shared configuration for backend
requirements.txt      # Backend Python dependencies
```

## Roadmap

1. **Phase 1 (complete)** – Frontend scaffolding + Tailwind theming
2. **Phase 2 (complete)** – App shell, component library showcase
3. **Phase 3 (in progress)** – Feature-specific dashboards (Org Admin suite ready)
4. **Next** – Super Admin surfaces, SEO Autopilot, Market Research, Prospect Radar, etc.

---

When you finish a feature slice, run `npm run lint` / `npm run build` in the frontend and relevant tests in the backend before committing. Each user request labelled “done” will trigger a repo commit + push.


