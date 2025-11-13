export const orgKpis = [
  {
    title: "SEO Health Score",
    description: "Average across all monitored domains this week.",
    value: "82",
    change: "+6%",
    trend: "up" as const,
    sparkline: [62, 68, 71, 74, 77, 82, 84],
  },
  {
    title: "Leads This Week",
    description: "Prospect Radar + manual imports combined.",
    value: "128",
    change: "+18%",
    trend: "up" as const,
    sparkline: [40, 52, 64, 80, 96, 112, 128],
  },
  {
    title: "Active Campaigns",
    description: "Campaigns running across social & ads.",
    value: "9",
    change: "-1 campaign",
    trend: "down" as const,
    sparkline: [8, 8, 9, 10, 11, 10, 9],
  },
  {
    title: "Content Scheduled",
    description: "Upcoming 14 days in Content Calendar.",
    value: "23",
    change: "+5 posts",
    trend: "up" as const,
    sparkline: [12, 15, 17, 18, 20, 21, 23],
  },
];

export const activityTimeline = [
  {
    id: "1",
    title: "Page audit completed",
    description:
      "Nexylomedia.com/blog/seo-tactics scored 92 with 3 actionable fixes.",
    timestamp: "2h ago",
    status: "success" as const,
  },
  {
    id: "2",
    title: "Leads import",
    description: "42 leads imported from CSV by Priya Sharma.",
    timestamp: "4h ago",
    status: "info" as const,
  },
  {
    id: "3",
    title: "Campaign launch",
    description: "Product Awareness campaign went live on Meta Ads.",
    timestamp: "Yesterday",
    status: "success" as const,
  },
  {
    id: "4",
    title: "PageSpeed quota warning",
    description: "Reached 80% of PageSpeed API daily limit.",
    timestamp: "Yesterday",
    status: "warning" as const,
  },
];

export const quickActions = [
  {
    title: "Run audit",
    description: "Benchmark a domain across mobile & desktop",
    icon: "audit",
  },
  {
    title: "Import leads",
    description: "Pull prospects into CRM pipeline",
    icon: "leads",
  },
  {
    title: "Create campaign",
    description: "Define goals, audience, assets, and channel mix",
    icon: "campaign",
  },
  {
    title: "Generate report",
    description: "Auto-compose SEO + campaign summary for clients",
    icon: "report",
  },
];

export const teamMembers = [
  {
    name: "Abhijeet Ghosh",
    email: "abhijeet@nexylomedia.com",
    role: "Owner",
    lastActive: "2h ago",
    status: "online" as const,
  },
  {
    name: "Priya Sharma",
    email: "priya@nexylomedia.com",
    role: "Manager",
    lastActive: "1h ago",
    status: "online" as const,
  },
  {
    name: "Carlos Rivera",
    email: "carlos@nexylomedia.com",
    role: "Member",
    lastActive: "6h ago",
    status: "busy" as const,
  },
  {
    name: "Mia Chen",
    email: "mia@nexylomedia.com",
    role: "Analyst",
    lastActive: "1 day ago",
    status: "offline" as const,
  },
];

export const integrations = [
  {
    name: "Google PageSpeed",
    status: "connected" as const,
    description: "Core web vitals and lighthouse scoring",
    lastChecked: "15 minutes ago",
  },
  {
    name: "Google Ads",
    status: "connected" as const,
    description: "Campaign spend and performance sync",
    lastChecked: "43 minutes ago",
  },
  {
    name: "Gemini AI",
    status: "connected" as const,
    description: "AI insights and content ideation",
    lastChecked: "6 minutes ago",
  },
  {
    name: "Meta Ads",
    status: "disconnected" as const,
    description: "Ad account syncing for Facebook & Instagram",
    lastChecked: "—",
  },
];

export const featureModules = [
  {
    key: "seo",
    name: "SEO Autopilot",
    description: "Audit pages, track vitals, and generate AI fixes.",
    enabled: true,
  },
  {
    key: "prospect",
    name: "Prospect Radar",
    description: "Discover and score leads from multiple sources.",
    enabled: true,
  },
  {
    key: "campaigns",
    name: "Campaign Management",
    description: "Plan cross-channel campaigns and assign tasks.",
    enabled: true,
  },
  {
    key: "ads",
    name: "Ads Integration",
    description: "Connect and optimize paid media campaigns.",
    enabled: false,
  },
  {
    key: "content",
    name: "Content Calendar",
    description: "Plan, approve, and schedule content across channels.",
    enabled: true,
  },
];

export const quotaUsage = [
  {
    label: "PageSpeed runs",
    value: 420,
    max: 500,
    helper: "Reset in 12 hours · 84% used",
    color: "primary" as const,
  },
  {
    label: "AI tokens",
    value: 62_000,
    max: 100_000,
    helper: "Shared across Gemini/Groq prompts",
    color: "success" as const,
  },
  {
    label: "Automation jobs",
    value: 118,
    max: 200,
    helper: "n8n executions triggered this month",
    color: "warning" as const,
  },
  {
    label: "Seats in use",
    value: 18,
    max: 25,
    helper: "Invited team members",
    color: "danger" as const,
  },
];


