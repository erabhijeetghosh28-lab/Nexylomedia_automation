import { FiDownload, FiMail } from "react-icons/fi";
import AppShell from "../../layouts/AppShell";
import Card from "../../components/ui/Card";
import DataTable from "../../components/ui/DataTable";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import { influencerRoster } from "../../data/platform";

type PlatformPageProps = {
  onNavigate?: (route: string) => void;
};

const InfluencerManagerPage = ({ onNavigate }: PlatformPageProps) => {
  return (
    <AppShell
      title="Influencer manager"
      description="Track creators, manage collaborations, and sync deliverables."
      breadcrumbs={[
        { label: "Org Admin", href: "#" },
        { label: "Platform Ops", href: "#" },
        { label: "Influencer manager" },
      ]}
      rightAccessory={
        <Button variant="ghost" size="sm" icon={<FiDownload />}>
          Export roster
        </Button>
      }
      onNavigate={onNavigate}
    >
      <Card
        title="Roster overview"
        subtitle="Automation keeps statuses fresh and tasks aligned."
        action={
          <Badge variant="info" dot>
            Slack alerts enabled
          </Badge>
        }
      >
        <DataTable
          columns={[
            { key: "name", header: "Creator" },
            { key: "channel", header: "Channel" },
            { key: "reach", header: "Reach" },
            { key: "status", header: "Status" },
            { key: "nextCollab", header: "Next collab" },
          ]}
          data={influencerRoster}
        />
      </Card>

      <Card
        title="Collaboration workflow"
        subtitle="Automations keep the process moving."
      >
        <ul className="space-y-3 text-xs text-muted dark:text-slate-400">
          <li className="rounded-2xl border border-border bg-bg px-3 py-2 dark:border-slate-700 dark:bg-slate-900">
            • Kickoff form triggers asset requests via DAM.
          </li>
          <li className="rounded-2xl border border-border bg-bg px-3 py-2 dark:border-slate-700 dark:bg-slate-900">
            • Reminder automations notify creators 3 days before publish.
          </li>
          <li className="rounded-2xl border border-border bg-bg px-3 py-2 dark:border-slate-700 dark:bg-slate-900">
            • Performance automatically feeds Analytics hub for recap.
          </li>
        </ul>
        <Button
          variant="ghost"
          size="sm"
          icon={<FiMail />}
          className="mt-4"
          onClick={() => onNavigate?.("platform-notifications")}
        >
          Manage notifications
        </Button>
      </Card>
    </AppShell>
  );
};

export default InfluencerManagerPage;

