export const marketingKpis = [
  {
    title: "Ideas generated",
    description: "AI-assisted campaign concepts this week.",
    value: "42",
    change: "+12",
    trend: "up" as const,
    sparkline: [12, 15, 18, 22, 28, 35, 42],
  },
  {
    title: "Validated personas",
    description: "Personas refreshed with latest insights.",
    value: "6",
    change: "+2",
    trend: "up" as const,
    sparkline: [2, 3, 3, 4, 4, 5, 6],
  },
  {
    title: "Competitor alerts",
    description: "New high-impact moves detected.",
    value: "3",
    change: "-1",
    trend: "down" as const,
    sparkline: [6, 6, 5, 4, 4, 3, 3],
  },
  {
    title: "Campaign ideas shortlisted",
    description: "Ready for execution review.",
    value: "9",
    change: "+3",
    trend: "up" as const,
    sparkline: [2, 2, 3, 4, 5, 6, 9],
  },
];

export const personaInsights = [
  {
    id: "persona-1",
    name: "Growth Operators",
    painPoints: "Need faster activation of multi-channel campaigns.",
    triggers: "ROI proof, automation depth, integration ease.",
    topChannels: ["LinkedIn", "Slack communities", "Automation forums"],
  },
  {
    id: "persona-2",
    name: "Marketing Analysts",
    painPoints: "Manual reporting, disconnected data sources.",
    triggers: "Unified dashboards, export-ready insights.",
    topChannels: ["Email newsletters", "Product hunt", "YouTube explainers"],
  },
  {
    id: "persona-3",
    name: "Agency Directors",
    painPoints: "Scaling deliverables without adding headcount.",
    triggers: "Automation templates, collaboration workflows.",
    topChannels: ["LinkedIn", "Partner webinars", "Industry podcasts"],
  },
];

export const trendSignals = [
  {
    id: "trend-1",
    topic: "AI-assisted content briefs",
    velocity: "High",
    change: "+38% mentions",
    recommendation: "Include in next sprint. Prepare comparison of brief quality gains.",
  },
  {
    id: "trend-2",
    topic: "Workflow automation ROI calculators",
    velocity: "Medium",
    change: "+21% interest",
    recommendation: "Launch interactive calculator for website.",
  },
  {
    id: "trend-3",
    topic: "Prospect personalization via market research",
    velocity: "High",
    change: "+44% discussions",
    recommendation: "Bundle Market Research data into Prospect Radar sequences.",
  },
];

export const competitorMoves = [
  {
    id: "comp-1",
    company: "AutomataHQ",
    move: "Rolled out Zapier + Notion integration for playbooks.",
    impact: "Medium",
    response: "Highlight native automation depth in upcoming ads.",
  },
  {
    id: "comp-2",
    company: "FlowForge",
    move: "Published ROI case study targeting agencies.",
    impact: "High",
    response: "Ship competing case study featuring agencies using Prospect Radar.",
  },
  {
    id: "comp-3",
    company: "NimbleOps",
    move: "Launched keyword monitoring widget.",
    impact: "Low",
    response: "Add widget to SEO Autopilot roadmap under quick wins.",
  },
];

export const ideaBacklog = [
  {
    id: "idea-1",
    title: "Automation ROI masterclass",
    channel: "Webinar",
    persona: "Growth Operators",
    status: "Ready for review",
  },
  {
    id: "idea-2",
    title: "Prospect personalization guide",
    channel: "E-book",
    persona: "Marketing Analysts",
    status: "Drafting",
  },
  {
    id: "idea-3",
    title: "Agency automation starter kit",
    channel: "Email series",
    persona: "Agency Directors",
    status: "Idea",
  },
];

