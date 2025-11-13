export const memberKpis = [
  {
    title: "Tasks completed",
    description: "Last 7 days across assigned automations.",
    value: "18",
    change: "+4 vs prior",
    trend: "up" as const,
    sparkline: [6, 8, 9, 11, 12, 14, 18],
  },
  {
    title: "Saved hours",
    description: "Automation time saved this week.",
    value: "6h 20m",
    change: "+1h",
    trend: "up" as const,
    sparkline: [2, 2.5, 3, 3.2, 4.5, 5.2, 6.33],
  },
  {
    title: "Active automations",
    description: "Running personal workflows right now.",
    value: "7",
    change: "+1",
    trend: "up" as const,
    sparkline: [4, 4, 5, 5, 6, 6, 7],
  },
  {
    title: "Focus score",
    description: "Deep work vs meetings ratio.",
    value: "82%",
    change: "+6%",
    trend: "up" as const,
    sparkline: [58, 60, 66, 70, 74, 79, 82],
  },
];

export const memberTasks = [
  {
    id: "task-1",
    title: "Review SEO issues for /pricing",
    due: "Today · 5:00 PM",
    status: "In progress",
    priority: "High",
    assignee: "You",
    tags: ["SEO", "Critical"],
  },
  {
    id: "task-2",
    title: "Approve automated outreach copy",
    due: "Tomorrow · 11:00 AM",
    status: "Blocked",
    priority: "Medium",
    assignee: "You",
    tags: ["Prospect Radar"],
  },
  {
    id: "task-3",
    title: "Publish Market Research snapshot",
    due: "Fri · 3:00 PM",
    status: "Queued",
    priority: "Low",
    assignee: "You",
    tags: ["Reporting"],
  },
];

export const memberTimeline = [
  {
    id: "tm-1",
    title: "Automation 'Prospect Sync' executed",
    description: "23 contacts enriched from HubSpot.",
    timestamp: "15 minutes ago",
    status: "success" as const,
  },
  {
    id: "tm-2",
    title: "Content calendar reminder",
    description: "Blog draft for '2025 automation trends' ready for review.",
    timestamp: "1 hour ago",
    status: "info" as const,
  },
  {
    id: "tm-3",
    title: "PageSpeed alert",
    description: "CLS regression detected on /services/automation.",
    timestamp: "Yesterday",
    status: "warning" as const,
  },
];

export const memberRecommendations = [
  {
    id: "rec-1",
    title: "Enable nightly backlink monitor",
    description:
      "Automatically capture new referring domains and push to Prospect Radar.",
    impact: "Medium",
    effort: "Low",
  },
  {
    id: "rec-2",
    title: "Activate smart alerts for Core Web Vitals",
    description:
      "Get Slack notifications when LCP crosses 2.5s for priority pages.",
    impact: "High",
    effort: "Low",
  },
  {
    id: "rec-3",
    title: "Generate outreach snippets from Market Research",
    description:
      "Use the latest persona insights to personalize upcoming campaigns.",
    impact: "Medium",
    effort: "Medium",
  },
];

export const memberInsights = [
  {
    id: "insight-1",
    metric: "Top converting persona",
    value: "Growth Operators · 6.5% CVR",
    context: "Driven by automation wizards campaign last week.",
  },
  {
    id: "insight-2",
    metric: "Best performing channel",
    value: "SEO Sprints",
    context: "Organic traffic up 22% vs last month.",
  },
  {
    id: "insight-3",
    metric: "Time saver",
    value: "Prospect Radar sync",
    context: "Saved 3h 40m of manual prospecting this week.",
  },
];

export const automationRuns = [
  {
    id: "auto-1",
    name: "Prospect Radar sync",
    state: "Running",
    schedule: "Every 2 hours",
    lastRun: "12 minutes ago",
  },
  {
    id: "auto-2",
    name: "SEO snapshot summary",
    state: "Idle",
    schedule: "Daily at 6am",
    lastRun: "Today · 6:02 AM",
  },
  {
    id: "auto-3",
    name: "Campaign draft generator",
    state: "Paused",
    schedule: "Manual trigger",
    lastRun: "2 days ago",
  },
];

