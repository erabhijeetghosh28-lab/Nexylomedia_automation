export const campaignKpis = [
  {
    title: "Active campaigns",
    description: "Cross-channel campaigns currently running.",
    value: "12",
    change: "+2",
    trend: "up" as const,
    sparkline: [6, 7, 8, 9, 10, 11, 12],
  },
  {
    title: "Spend vs plan",
    description: "Budget utilization for the month.",
    value: "92%",
    change: "-3%",
    trend: "down" as const,
    sparkline: [88, 89, 90, 91, 93, 94, 92],
  },
  {
    title: "Pipeline influenced",
    description: "Impact attributed to active campaigns.",
    value: "$480k",
    change: "+$60k",
    trend: "up" as const,
    sparkline: [280, 310, 340, 370, 410, 430, 480],
  },
  {
    title: "Creative readiness",
    description: "Assets approved for upcoming launches.",
    value: "18",
    change: "+5",
    trend: "up" as const,
    sparkline: [8, 9, 11, 12, 14, 16, 18],
  },
];

export const campaignSchedule = [
  {
    id: "camp-1",
    name: "Automation ROI blitz",
    channel: "LinkedIn",
    status: "Live",
    start: "Nov 10",
    end: "Nov 24",
  },
  {
    id: "camp-2",
    name: "Prospect Radar webinar",
    channel: "Email + Social",
    status: "Scheduled",
    start: "Nov 17",
    end: "Nov 21",
  },
  {
    id: "camp-3",
    name: "SEO Autopilot relaunch",
    channel: "Paid search",
    status: "Planning",
    start: "Dec 2",
    end: "Dec 15",
  },
];

export const adVariants = [
  {
    id: "ad-1",
    name: "Automation ROI - carousel",
    channel: "LinkedIn",
    status: "Live",
    ctr: "2.1%",
    spend: "$1.8k",
  },
  {
    id: "ad-2",
    name: "Prospect Radar - video",
    channel: "YouTube",
    status: "Testing",
    ctr: "1.4%",
    spend: "$950",
  },
  {
    id: "ad-3",
    name: "Market Research - search",
    channel: "Google Ads",
    status: "Paused",
    ctr: "3.6%",
    spend: "$0",
  },
];

export const budgetAllocations = [
  {
    id: "alloc-1",
    channel: "Paid search",
    planned: "$12,000",
    actual: "$10,200",
    variance: "-$1,800",
  },
  {
    id: "alloc-2",
    channel: "Paid social",
    planned: "$9,000",
    actual: "$9,400",
    variance: "+$400",
  },
  {
    id: "alloc-3",
    channel: "Content syndication",
    planned: "$5,000",
    actual: "$3,900",
    variance: "-$1,100",
  },
];

export const performanceHighlights = [
  {
    id: "perf-1",
    metric: "Best performing message",
    detail: "“Automate onboarding workflows in days” delivered +32% CTR.",
  },
  {
    id: "perf-2",
    metric: "Top persona response",
    detail: "Growth Operators with automation ROI proof saw +18% demos.",
  },
  {
    id: "perf-3",
    metric: "Creative to iterate",
    detail: "Ads referencing Market Research snapshots underperformed.",
  },
];

