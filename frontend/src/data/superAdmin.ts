export const platformMetrics = {
  kpis: [
    {
      label: "Total tenants",
      value: "42",
      delta: "+3 this week",
      trend: "up",
    },
    {
      label: "Active users",
      value: "318",
      delta: "+12 in 7 days",
      trend: "up",
    },
    {
      label: "API usage today",
      value: "18,320",
      delta: "65% of quota",
      trend: "up",
    },
    {
      label: "Automation failures",
      value: "4",
      delta: "1 open incident",
      trend: "down",
    },
  ],
  systemHealth: [
    {
      service: "n8n Workflow runtime",
      status: "healthy",
      lastChecked: "2 min ago",
      detail: "All 24 flows executed within expected thresholds.",
    },
    {
      service: "PageSpeed API quota",
      status: "warning",
      lastChecked: "5 min ago",
      detail: "Daily quota at 80%. Reminder email sent.",
    },
    {
      service: "Gemini AI adapter",
      status: "healthy",
      lastChecked: "Just now",
      detail: "Latency avg 320ms.",
    },
  ],
  activity: [
    {
      time: "12 min ago",
      text: "Abhijeet impersonated tenant Nexylomedia HQ",
    },
    {
      time: "1 h ago",
      text: "Acme Retail upgraded to Growth plan",
    },
    {
      time: "3 h ago",
      text: "Automation rotated Gemini API key for Luna Cosmetics",
    },
  ],
};

export const tenantSummaries = [
  {
    id: "tenant-001",
    name: "Nexylomedia HQ",
    plan: "Enterprise",
    status: "Active",
    users: 24,
    apiCalls: 128400,
    aiTokens: 312000,
    mrr: 499,
    createdAt: "2024-02-12",
  },
  {
    id: "tenant-002",
    name: "Acme Retail",
    plan: "Growth (trial)",
    status: "Trial",
    users: 8,
    apiCalls: 24800,
    aiTokens: 46000,
    mrr: 0,
    createdAt: "2024-08-19",
    trialEndsAt: "2024-11-20",
  },
  {
    id: "tenant-003",
    name: "Luna Cosmetics",
    plan: "Starter",
    status: "Active",
    users: 5,
    apiCalls: 12100,
    aiTokens: 18500,
    mrr: 129,
    createdAt: "2024-06-14",
  },
];

export const tenantDetailMock = {
  id: "tenant-001",
  name: "Nexylomedia HQ",
  plan: {
    name: "Enterprise",
    renewalDate: "2025-01-12",
    monthlyCost: 499,
  },
  contacts: [
    { name: "Abhijeet Ghosh", role: "Owner", email: "abhijeet@nexylomedia.com" },
    { name: "Priya Sharma", role: "Manager", email: "priya@nexylomedia.com" },
  ],
  usageTrend: {
    apiCalls: [6800, 7200, 7500, 7900, 8200, 8600],
    aiTokens: [52000, 54500, 57200, 59000, 61300, 64800],
  },
  integrations: [
    { name: "PageSpeed API", status: "connected" },
    { name: "Gemini AI", status: "connected" },
    { name: "Google Ads", status: "pending" },
  ],
  recentLogs: [
    { timestamp: "35 min ago", severity: "info", message: "Automation job completed" },
    { timestamp: "3 h ago", severity: "warning", message: "PageSpeed quota hit 75%" },
    { timestamp: "Yesterday", severity: "info", message: "New user invited: Jordan Lee" },
  ],
};

export const invoiceHistory = [
  {
    invoiceId: "INV-2025-001",
    tenant: "Nexylomedia HQ",
    amount: 499,
    status: "Paid",
    issuedAt: "2025-11-01",
  },
  {
    invoiceId: "INV-2025-002",
    tenant: "Acme Retail",
    amount: 199,
    status: "Open",
    issuedAt: "2025-11-08",
  },
  {
    invoiceId: "INV-2025-003",
    tenant: "Luna Cosmetics",
    amount: 129,
    status: "Paid",
    issuedAt: "2025-10-22",
  },
];

export const platformFeatureMatrix = [
  {
    feature: "SEO Autopilot",
    tenants: [
      { name: "Nexylomedia HQ", enabled: true },
      { name: "Acme Retail", enabled: true },
      { name: "Luna Cosmetics", enabled: false },
    ],
  },
  {
    feature: "Prospect Radar",
    tenants: [
      { name: "Nexylomedia HQ", enabled: true },
      { name: "Acme Retail", enabled: false },
      { name: "Luna Cosmetics", enabled: false },
    ],
  },
  {
    feature: "Campaign Manager",
    tenants: [
      { name: "Nexylomedia HQ", enabled: true },
      { name: "Acme Retail", enabled: true },
      { name: "Luna Cosmetics", enabled: true },
    ],
  },
];

export const auditLogMock = [
  {
    timestamp: "12 min ago",
    actor: "abhijeet@platform.io",
    action: "Impersonated tenant Nexylomedia HQ",
    ip: "127.0.0.1",
  },
  {
    timestamp: "1 h ago",
    actor: "automation@platform.io",
    action: "Rotated Gemini API key for Luna Cosmetics",
    ip: "10.0.0.6",
  },
  {
    timestamp: "Yesterday",
    actor: "abhijeet@platform.io",
    action: "Disabled Ads Integration for Acme Retail",
    ip: "127.0.0.1",
  },
];

export const superAdminDashboard = {
  kpis: [
    { label: "Total tenants", value: "28", change: "+3", trend: "up" },
    { label: "Active users", value: "412", change: "+26", trend: "up" },
    { label: "API usage (24h)", value: "68k", change: "+12%", trend: "neutral" },
    { label: "Automation failures", value: "2", change: "-4", trend: "down" },
  ],
  systemHealth: [
    {
      name: "n8n Workflow Engine",
      status: "Operational",
      detail: "Heartbeat 3m ago",
    },
    {
      name: "PageSpeed quota",
      status: "72% used",
      detail: "Resets in 12h",
    },
    {
      name: "AI tokens",
      status: "420k / 600k",
      detail: "70% usage",
    },
  ],
  recentActivity: [
    {
      time: "25m ago",
      badge: "New tenant",
      message: "Northwind Retail joined on the Growth plan.",
    },
    {
      time: "2h ago",
      badge: "Alert",
      message: "Acme Logistics: automation flow failed 3 times.",
    },
    {
      time: "5h ago",
      badge: "Billing",
      message: "Invoice INV-2025-1102 marked as overdue (Signal Studio).",
    },
  ],
};

export const superAdminTenants = [
  {
    id: "tn-001",
    name: "Nexylomedia HQ",
    plan: "Enterprise",
    status: "Active",
    users: 32,
    lastActive: "10m ago",
    usage: { api: "182k", automations: 430, aiTokens: "120k" },
  },
  {
    id: "tn-002",
    name: "Acme Retail",
    plan: "Growth",
    status: "Active",
    users: 14,
    lastActive: "47m ago",
    usage: { api: "52k", automations: 32, aiTokens: "21k" },
  },
  {
    id: "tn-003",
    name: "Signal Studio",
    plan: "Starter",
    status: "Delinquent",
    users: 6,
    lastActive: "8h ago",
    usage: { api: "980", automations: 5, aiTokens: "1.5k" },
  },
];

export const tenantFeatureMatrix = [
  {
    key: "seo_autopilot",
    label: "SEO Autopilot",
    tenants: ["tn-001", "tn-002"],
  },
  {
    key: "marketing_research",
    label: "Market Research AI",
    tenants: ["tn-001"],
  },
  {
    key: "prospect_radar",
    label: "Prospect Radar",
    tenants: ["tn-002", "tn-003"],
  },
  {
    key: "campaign_management",
    label: "Campaign Management",
    tenants: [],
  },
];

export const billingOverview = {
  plans: [
    { name: "Starter", price: 49, tenants: 9 },
    { name: "Growth", price: 149, tenants: 12 },
    { name: "Enterprise", price: 399, tenants: 7 },
  ],
  invoices: [
    {
      id: "INV-2025-1102",
      tenant: "Signal Studio",
      amount: "$399",
      status: "Overdue",
      issued: "21 days ago",
      due: "7 days ago",
    },
    {
      id: "INV-2025-1107",
      tenant: "Acme Retail",
      amount: "$149",
      status: "Paid",
      issued: "5 days ago",
      due: "In 25 days",
    },
  ],
};

export const auditLogEntries = [
  {
    time: "12m ago",
    actor: "abhijeet@nexylomedia.com",
    tenant: "Nexylomedia HQ",
    action: "Enabled Market Research AI feature flag",
  },
  {
    time: "3h ago",
    actor: "support@platform.io",
    tenant: "Signal Studio",
    action: "Impersonated tenant to investigate automation failures",
  },
  {
    time: "1d ago",
    actor: "billing@platform.io",
    tenant: "Signal Studio",
    action: "Marked invoice INV-2025-1102 as overdue",
  },
];

export const systemServiceStatus = [
  {
    name: "Flask API",
    status: "Operational",
    detail: "Avg response 142ms",
  },
  {
    name: "n8n Workflow Engine",
    status: "Operational",
    detail: "5 jobs running",
  },
  {
    name: "SQL Database",
    status: "Operational",
    detail: "All replicas healthy",
  },
  {
    name: "Notification Worker",
    status: "Degraded",
    detail: "Retry queue building up",
  },
];


