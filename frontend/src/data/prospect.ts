export const prospectKpis = [
  {
    title: "Qualified leads",
    description: "Last 7 days across automations and manual adds.",
    value: "128",
    change: "+22",
    trend: "up" as const,
    sparkline: [48, 56, 62, 74, 88, 106, 128],
  },
  {
    title: "Meetings booked",
    description: "Meetings sourced from Prospect Radar sequences.",
    value: "18",
    change: "+5",
    trend: "up" as const,
    sparkline: [6, 8, 9, 11, 12, 15, 18],
  },
  {
    title: "Sequence health",
    description: "Average reply rate across live sequences.",
    value: "21%",
    change: "+3%",
    trend: "up" as const,
    sparkline: [12, 13, 14, 17, 18, 20, 21],
  },
  {
    title: "Pipeline coverage",
    description: "Open opportunities vs target for quarter.",
    value: "112%",
    change: "+8%",
    trend: "up" as const,
    sparkline: [84, 88, 93, 99, 105, 108, 112],
  },
];

export const prospectLeads = [
  {
    id: "lead-1",
    name: "Avery Chen",
    company: "FluxOps",
    stage: "Discovery",
    fit: "High",
    owner: "Nexylo SDR",
  },
  {
    id: "lead-2",
    name: "Jordan Park",
    company: "BrightStack",
    stage: "Qualified",
    fit: "Medium",
    owner: "Automation bot",
  },
  {
    id: "lead-3",
    name: "Lena Ortiz",
    company: "ScaleForge",
    stage: "Contacted",
    fit: "High",
    owner: "You",
  },
];

export const prospectSequences = [
  {
    id: "seq-1",
    name: "Agency automation intro",
    status: "Running",
    replyRate: "26%",
    steps: 5,
    nextStep: "Day 3: Social touch",
  },
  {
    id: "seq-2",
    name: "Ops leader nurture",
    status: "Paused",
    replyRate: "18%",
    steps: 7,
    nextStep: "Awaiting refresh",
  },
  {
    id: "seq-3",
    name: "Inbound webinar follow-up",
    status: "Draft",
    replyRate: "—",
    steps: 4,
    nextStep: "Needs personalization",
  },
];

export const pipelineStages = [
  {
    id: "stage-1",
    name: "Discovery",
    opportunities: 24,
    value: "$140k",
    velocity: "6 days",
  },
  {
    id: "stage-2",
    name: "Evaluation",
    opportunities: 18,
    value: "$220k",
    velocity: "9 days",
  },
  {
    id: "stage-3",
    name: "Proposal",
    opportunities: 9,
    value: "$310k",
    velocity: "12 days",
  },
  {
    id: "stage-4",
    name: "Closed Won",
    opportunities: 6,
    value: "$190k",
    velocity: "—",
  },
];

export const handoffTasks = [
  {
    id: "handoff-1",
    title: "Assign strategist for FluxOps evaluation",
    due: "Today 4:00 PM",
    priority: "High",
  },
  {
    id: "handoff-2",
    title: "Send automation ROI calculator to ScaleForge",
    due: "Tomorrow 11:00 AM",
    priority: "Medium",
  },
  {
    id: "handoff-3",
    title: "Review outreach copy for agencies sequence",
    due: "Friday 3:00 PM",
    priority: "Low",
  },
];

