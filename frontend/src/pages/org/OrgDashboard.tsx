import {
  FiArrowUpRight,
  FiCalendar,
  FiDownload,
  FiGlobe,
  FiTarget,
} from "react-icons/fi";
import AppShell from "../../layouts/AppShell";
import KpiCard from "../../components/ui/KpiCard";
import Sparkline from "../../components/ui/Sparkline";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Timeline from "../../components/ui/Timeline";
import DataTable from "../../components/ui/DataTable";
import Badge from "../../components/ui/Badge";
import { activityTimeline, orgKpis, quickActions } from "../../data/org";

const mockPages = [
  {
    url: "/services/digital-marketing",
    score: 87,
    issues: 5,
    lastAudit: "3h ago",
    strategy: "Mobile + Desktop",
  },
  {
    url: "/blog/seo-trends-2025",
    score: 92,
    issues: 2,
    lastAudit: "Yesterday",
    strategy: "Mobile",
  },
  {
    url: "/pricing",
    score: 74,
    issues: 9,
    lastAudit: "2 days ago",
    strategy: "Desktop",
  },
];

const mockCampaigns = [
  {
    name: "Holiday Prospecting",
    channel: "LinkedIn",
    status: "Active",
    spend: "$4.8k",
  },
  {
    name: "SEO Fix Sprint",
    channel: "Automation",
    status: "Scheduled",
    spend: "$0",
  },
  {
    name: "Lead Nurture",
    channel: "Email",
    status: "Draft",
    spend: "$920",
  },
];

type OrgPageProps = {
  onNavigate?: (route: string) => void;
};

const OrgDashboard = ({ onNavigate }: OrgPageProps) => {
  return (
    <AppShell
      title="Org Dashboard"
      description="Health indicators, recent activity, and shortcuts tailored for Nexylomedia HQ. Stay on top of audits, campaigns, and team actions."
      breadcrumbs={[
        { label: "Org Admin", href: "#" },
        { label: "Overview" },
      ]}
      activeNav="org-dashboard"
      rightAccessory={
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="ghost" size="sm" icon={<FiDownload />}>
            Export summary
          </Button>
          <Button variant="primary" size="sm" icon={<FiGlobe />}>
            Switch workspace
          </Button>
        </div>
      }
      onNavigate={onNavigate}
    >
      <section className="grid gap-6 lg:grid-cols-4">
        {orgKpis.map((kpi) => (
          <KpiCard
            key={kpi.title}
            title={kpi.title}
            description={kpi.description}
            value={kpi.value}
            change={kpi.change}
            trend={kpi.trend}
            sparkline={<Sparkline values={kpi.sparkline} />}
            icon={<FiArrowUpRight />}
          />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <Card
          title="Quick actions"
          subtitle="Jump into the most common workflows"
          className="xl:col-span-1"
        >
          <div className="grid gap-3">
            {quickActions.map((action) => (
              <button
                key={action.title}
                type="button"
                className="flex w-full items-center justify-between rounded-2xl border border-border bg-bg px-4 py-3 text-left transition hover:border-primary/40 hover:bg-primary/5 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800/60"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {action.title}
                  </p>
                  <p className="text-xs text-muted dark:text-slate-400">
                    {action.description}
                  </p>
                </div>
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary dark:bg-primary/20">
                  <FiTarget />
                </span>
              </button>
            ))}
          </div>
        </Card>

        <Card
          title="Recent activity"
          subtitle="Audits, campaigns, and automation events"
          className="xl:col-span-1"
          padded={false}
        >
          <div className="px-6 py-6">
            <Timeline items={activityTimeline} />
          </div>
        </Card>

        <Card
          title="Upcoming schedule"
          subtitle="Content calendar & campaign milestones"
          className="xl:col-span-1"
        >
          <div className="space-y-4">
            {[
              {
                title: "Campaign review standup",
                time: "Today · 4:30 PM",
                description: "Align on creative assets for Holiday Prospecting.",
              },
              {
                title: "Content approvals due",
                time: "Tomorrow · 10:00 AM",
                description: "5 posts awaiting approval in Content Calendar.",
              },
              {
                title: "Automation deploy window",
                time: "Friday · 2:00 PM",
                description:
                  "Launching new n8n flow for SEO fix notifications.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="flex items-start gap-3 rounded-2xl border border-dashed border-border bg-bg p-4 dark:border-slate-700 dark:bg-slate-900"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-lg text-primary dark:bg-primary/20">
                  <FiCalendar />
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {item.title}
                  </p>
                  <p className="text-xs text-primary">{item.time}</p>
                  <p className="text-xs text-muted dark:text-slate-400">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card
          title="Priority pages"
          subtitle="Recent audits ordered by severity"
          action={
            <Button variant="ghost" size="sm">
              View all pages
            </Button>
          }
        >
          <DataTable
            columns={[
              {
                key: "url",
                header: "Page",
                render: (item: (typeof mockPages)[number]) => (
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {item.url}
                    </p>
                    <p className="text-xs text-muted dark:text-slate-400">
                      Last audit {item.lastAudit}
                    </p>
                  </div>
                ),
              },
              {
                key: "score",
                header: "Score",
                render: (item: (typeof mockPages)[number]) => (
                  <Badge
                    variant={
                      item.score >= 90
                        ? "success"
                        : item.score >= 80
                          ? "warning"
                          : "danger"
                    }
                  >
                    {item.score}
                  </Badge>
                ),
              },
              {
                key: "issues",
                header: "Issues",
                align: "center" as const,
              },
              {
                key: "strategy",
                header: "Strategy",
              },
            ]}
            data={mockPages}
          />
        </Card>

        <Card
          title="Campaign health"
          subtitle="Running & planned initiatives"
          action={
            <Button variant="ghost" size="sm">
              Manage campaigns
            </Button>
          }
        >
          <DataTable
            columns={[
              {
                key: "name",
                header: "Name",
                render: (item: (typeof mockCampaigns)[number]) => (
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {item.name}
                    </p>
                    <p className="text-xs text-muted dark:text-slate-400">
                      Channel: {item.channel}
                    </p>
                  </div>
                ),
              },
              {
                key: "status",
                header: "Status",
                render: (item: (typeof mockCampaigns)[number]) => (
                  <Badge
                    variant={
                      item.status === "Active"
                        ? "success"
                        : item.status === "Scheduled"
                          ? "info"
                          : "warning"
                    }
                    dot
                  >
                    {item.status}
                  </Badge>
                ),
              },
              {
                key: "spend",
                header: "Spend",
                align: "right" as const,
              },
            ]}
            data={mockCampaigns}
          />
        </Card>
      </section>
    </AppShell>
  );
};

export default OrgDashboard;


