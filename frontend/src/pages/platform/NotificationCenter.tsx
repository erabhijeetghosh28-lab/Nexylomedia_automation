import { FiFilter, FiSettings } from "react-icons/fi";
import AppShell from "../../layouts/AppShell";
import Card from "../../components/ui/Card";
import DataTable from "../../components/ui/DataTable";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Toggle from "../../components/ui/Toggle";
import { notificationFeed } from "../../data/platform";

type PlatformPageProps = {
  onNavigate?: (route: string) => void;
};

const NotificationCenterPage = ({ onNavigate }: PlatformPageProps) => {
  return (
    <AppShell
      title="Notification center"
      description="Cross-platform alerts with fine-grained preferences."
      breadcrumbs={[
        { label: "Org Admin", href: "#" },
        { label: "Platform Ops", href: "#" },
        { label: "Notification center" },
      ]}
      rightAccessory={
        <Button variant="ghost" size="sm" icon={<FiFilter />}>
          Filter feed
        </Button>
      }
      onNavigate={onNavigate}
    >
      <Card
        title="Live feed"
        subtitle="Aggregated from automations, campaigns, and Member workspace."
        action={
          <Badge variant="info" dot>
            Realtime stream
          </Badge>
        }
      >
        <DataTable
          columns={[
            { key: "type", header: "Type" },
            { key: "message", header: "Message" },
            { key: "time", header: "Time" },
            {
              key: "severity",
              header: "Severity",
            },
          ]}
          data={notificationFeed}
        />
      </Card>

      <Card
        title="Preferences"
        subtitle="Control which surfaces receive alerts."
        action={
          <Button variant="ghost" size="sm" icon={<FiSettings />} onClick={() => onNavigate?.("member-dashboard")}>
            Manage personal settings
          </Button>
        }
      >
        <div className="grid gap-3 md:grid-cols-2">
          <Toggle checked label="Slack: #automation-alerts" description="High severity alerts" />
          <Toggle checked label="Email digest" description="Daily summary at 7am" />
          <Toggle checked={false} label="SMS fallback" description="Escalate when no response" />
          <Toggle checked label="In-app reminders" description="Show in Member workspace" />
        </div>
      </Card>
    </AppShell>
  );
};

export default NotificationCenterPage;

