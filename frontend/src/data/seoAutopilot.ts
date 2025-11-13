export const seoKpis = [
  {
    title: "SEO Health Score",
    description: "Average across all monitored domains this week.",
    value: "88",
    change: "+4%",
    trend: "up" as const,
    sparkline: [72, 74, 78, 80, 82, 85, 88],
  },
  {
    title: "Core Web Vitals",
    description: "Pages passing CWV thresholds (LCP, FID, CLS).",
    value: "76%",
    change: "+9%",
    trend: "up" as const,
    sparkline: [58, 60, 63, 67, 70, 73, 76],
  },
  {
    title: "Resolved issues",
    description: "Tickets closed by automations in last 7 days.",
    value: "124",
    change: "+28%",
    trend: "up" as const,
    sparkline: [48, 52, 64, 78, 94, 107, 124],
  },
  {
    title: "High-severity alerts",
    description: "Items needing human review right now.",
    value: "6",
    change: "-3",
    trend: "down" as const,
    sparkline: [12, 11, 10, 9, 8, 7, 6],
  },
];

export const seoFocus = [
  {
    id: "focus-1",
    metric: "Largest detected issue",
    value: "Render-blocking JS on /pricing",
    action: "Autofix scheduled tonight. Review post-run.",
  },
  {
    id: "focus-2",
    metric: "Emerging opportunity",
    value: "SERP gap: 'workflow automation pricing'",
    action: "Playbook drafted — send to content team.",
  },
  {
    id: "focus-3",
    metric: "Technical debt",
    value: "970 orphaned pages detected",
    action: "Auto-redirect plan ready, awaiting approval.",
  },
];

export const autopilotRuns = [
  {
    id: "run-1",
    workflow: "Nightly PageSpeed sweep",
    status: "Success",
    duration: "12m 04s",
    runAt: "Today · 03:00 AM",
  },
  {
    id: "run-2",
    workflow: "Structured data validator",
    status: "Warning",
    duration: "05m 42s",
    runAt: "Today · 01:30 AM",
  },
  {
    id: "run-3",
    workflow: "Backlink toxicity checker",
    status: "Failed",
    duration: "—",
    runAt: "Yesterday · 11:00 PM",
  },
];

export const seoPlaybooks = [
  {
    id: "playbook-1",
    name: "Web vitals remediation",
    description: "Auto-prioritize CLS regressions with rollback plan.",
    difficulty: "Medium",
    automation: "Enabled",
  },
  {
    id: "playbook-2",
    name: "Keyword expansion sprint",
    description: "Blend Market Research with Search Console data.",
    difficulty: "High",
    automation: "Semi-automated",
  },
  {
    id: "playbook-3",
    name: "Broken link purge",
    description: "Detect, patch, and notify content owners.",
    difficulty: "Low",
    automation: "Fully automated",
  },
];

export const seoAlerts = [
  {
    id: "alert-1",
    severity: "High",
    title: "INP exceeded 200ms on /enterprise",
    detected: "22 minutes ago",
    owners: ["Automation", "Content"],
  },
  {
    id: "alert-2",
    severity: "Medium",
    title: "Keyword cannibalization: workflow automation tools",
    detected: "1 hour ago",
    owners: ["SEO Lead"],
  },
  {
    id: "alert-3",
    severity: "Low",
    title: "New backlink from partner domain",
    detected: "2 hours ago",
    owners: ["PR"],
  },
];

export const seoRecommendations = [
  {
    id: "rec-1",
    title: "Enable instant rollbacks for CLS alerts",
    impact: "High",
    effort: "Low",
    team: "Engineering",
  },
  {
    id: "rec-2",
    title: "Spin up Market Research deep dive on 'automation ROI'",
    impact: "Medium",
    effort: "Medium",
    team: "Research",
  },
  {
    id: "rec-3",
    title: "Schedule competitor comparison report",
    impact: "Medium",
    effort: "Low",
    team: "SEO Ops",
  },
];

