import { FiDownload, FiPlusCircle } from "react-icons/fi";
import AppShell from "../../layouts/AppShell";
import Card from "../../components/ui/Card";
import DataTable from "../../components/ui/DataTable";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import { contentSchedule } from "../../data/platform";

type PlatformPageProps = {
  onNavigate?: (route: string) => void;
};

const ContentCalendarPage = ({ onNavigate }: PlatformPageProps) => {
  return (
    <AppShell
      title="Content calendar"
      description="Coordinate editorial output across channels with automation hooks."
      breadcrumbs={[
        { label: "Org Admin", href: "#" },
        { label: "Platform Ops", href: "#" },
        { label: "Content calendar" },
      ]}
      rightAccessory={
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="ghost" size="sm" icon={<FiDownload />}>
            Export schedule
          </Button>
          <Button variant="primary" size="sm" icon={<FiPlusCircle />} onClick={() => onNavigate?.("campaign-planner")}>
            Add to planner
          </Button>
        </div>
      }
      onNavigate={onNavigate}
    >
      <Card
        title="Upcoming content"
        subtitle="Auto-synced with Campaigns, SEO Autopilot, and DAM."
        action={
          <Badge variant="info" dot>
            Member workspace tasks assigned
          </Badge>
        }
      >
        <DataTable
          columns={[
            { key: "title", header: "Asset" },
            { key: "status", header: "Status" },
            { key: "due", header: "Due" },
            { key: "channel", header: "Channel" },
            { key: "owner", header: "Owner" },
          ]}
          data={contentSchedule}
        />
      </Card>

      <Card
        title="Workflow automations"
        subtitle="Automations trigger on each phase."
      >
        <ul className="space-y-3 text-xs text-muted dark:text-slate-400">
          <li className="rounded-2xl border border-border bg-bg px-3 py-2 dark:border-slate-700 dark:bg-slate-900">
            • Draft stage triggers AI outline, assigns reviewers.
          </li>
          <li className="rounded-2xl border border-border bg-bg px-3 py-2 dark:border-slate-700 dark:bg-slate-900">
            • Publish stage pushes to DAM, schedules cross-channel posts.
          </li>
          <li className="rounded-2xl border border-border bg-bg px-3 py-2 dark:border-slate-700 dark:bg-slate-900">
            • After publish, analytics snapshot generated automatically.
          </li>
        </ul>
      </Card>
    </AppShell>
  );
};

export default ContentCalendarPage;

