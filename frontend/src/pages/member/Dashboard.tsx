import { FiCalendar, FiCheckCircle, FiCompass, FiZap } from "react-icons/fi";
import MemberShell from "../../layouts/MemberShell";
import KpiCard from "../../components/ui/KpiCard";
import Sparkline from "../../components/ui/Sparkline";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Timeline from "../../components/ui/Timeline";
import Badge from "../../components/ui/Badge";
import DataTable from "../../components/ui/DataTable";
import {
  memberKpis,
  memberTasks,
  memberTimeline,
  memberRecommendations,
} from "../../data/member";

type MemberPageProps = {
  onNavigate?: (route: string) => void;
};

const MemberDashboard = ({ onNavigate }: MemberPageProps) => {
  return (
    <MemberShell
      title="My workspace"
      description="Track your focus, automations, and priorities. Everything in this hub reflects your personal responsibilities across Nexylomedia."
      breadcrumbs={[
        { label: "My workspace", href: "#" },
        { label: "Overview" },
      ]}
      rightAccessory={
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="ghost" size="sm" icon={<FiCalendar />}>
            Plan my day
          </Button>
          <Button variant="primary" size="sm" icon={<FiZap />}>
            Launch focus mode
          </Button>
        </div>
      }
      onNavigate={onNavigate}
      activeRoute="member-dashboard"
    >
      <section className="grid gap-6 lg:grid-cols-4">
        {memberKpis.map((kpi) => (
          <KpiCard
            key={kpi.title}
            title={kpi.title}
            description={kpi.description}
            value={kpi.value}
            change={kpi.change}
            trend={kpi.trend}
            sparkline={<Sparkline values={kpi.sparkline} />}
            icon={<FiCheckCircle />}
          />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[2fr,1fr]">
        <Card
          title="Today’s focus"
          subtitle="Knock out the work that moves the metrics."
          action={
            <Button
              variant="ghost"
              size="sm"
              icon={<FiCompass />}
              onClick={() => onNavigate?.("member-insights")}
            >
              View insights
            </Button>
          }
        >
          <DataTable
            columns={[
              {
                key: "title",
                header: "Task",
                render: (item: (typeof memberTasks)[number]) => (
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {item.title}
                    </p>
                    <p className="text-xs text-muted dark:text-slate-400">
                      {item.due}
                    </p>
                  </div>
                ),
              },
              {
                key: "status",
                header: "Status",
                render: (item: (typeof memberTasks)[number]) => (
                  <Badge variant="info">{item.status}</Badge>
                ),
              },
              {
                key: "priority",
                header: "Priority",
              },
            ]}
            data={memberTasks}
            emptyState="Nothing on deck — great job!"
          />
        </Card>

        <Card
          title="Latest activity"
          subtitle="Automations, alerts, and reminders"
          className="xl:col-span-1"
        >
          <Timeline items={memberTimeline} />
        </Card>
      </section>

      <Card
        title="Suggested next steps"
        subtitle="Keep momentum by acting on the highest leverage recommendations."
      >
        <div className="grid gap-4 md:grid-cols-3">
          {memberRecommendations.map((rec) => (
            <div
              key={rec.id}
              className="rounded-2xl border border-border bg-bg p-4 dark:border-slate-700 dark:bg-slate-900"
            >
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {rec.title}
              </p>
              <p className="mt-2 text-xs text-muted dark:text-slate-400">
                {rec.description}
              </p>
              <div className="mt-4 flex items-center justify-between text-xs text-muted dark:text-slate-400">
                <span>Impact: {rec.impact}</span>
                <span>Effort: {rec.effort}</span>
              </div>
              <Button variant="ghost" size="sm" className="mt-4 w-full">
                Add to plan
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </MemberShell>
  );
};

export default MemberDashboard;

