import { useState } from "react";
import { FiCalendar, FiCheckCircle, FiPlus } from "react-icons/fi";
import AppShell from "../../layouts/AppShell";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Modal from "../../components/ui/Modal";
import TextInput from "../../components/ui/TextInput";
import Select from "../../components/ui/Select";
import { campaignSchedule } from "../../data/campaigns";

type CampaignPageProps = {
  onNavigate?: (route: string) => void;
};

const PlannerPage = ({ onNavigate }: CampaignPageProps) => {
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <AppShell
      title="Campaign planner"
      description="Stage upcoming launches, align creative, and sync tasks with Member workspace."
      breadcrumbs={[
        { label: "Org Admin", href: "#" },
        { label: "Campaigns", href: "#" },
        { label: "Planner" },
      ]}
      rightAccessory={
        <Button variant="primary" size="sm" icon={<FiPlus />} onClick={() => setCreateOpen(true)}>
          New campaign
        </Button>
      }
      onNavigate={onNavigate}
    >
      <Card
        title="Calendar view"
        subtitle="Visualize key dates across programs."
        action={
          <Badge variant="info" dot>
            Synced with Content Calendar
          </Badge>
        }
      >
        <div className="grid gap-4 md:grid-cols-3">
          {campaignSchedule.map((campaign) => (
            <div
              key={campaign.id}
              className="rounded-2xl border border-border bg-bg p-4 dark:border-slate-700 dark:bg-slate-900"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-muted dark:text-slate-400">
                {campaign.status}
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
                {campaign.name}
              </p>
              <p className="mt-1 text-xs text-muted dark:text-slate-400">
                {campaign.channel}
              </p>
              <p className="mt-2 text-xs text-muted dark:text-slate-400">
                {campaign.start} → {campaign.end}
              </p>
            </div>
          ))}
        </div>
        <Button
          variant="ghost"
          size="sm"
          icon={<FiCalendar />}
          className="mt-4"
          onClick={() => onNavigate?.("campaign-dashboard")}
        >
          Back to dashboard
        </Button>
      </Card>

      <Card
        title="Task orchestration"
        subtitle="Automations push key deliverables to owners."
      >
        <ul className="space-y-3 text-xs text-muted dark:text-slate-400">
          <li className="rounded-2xl border border-border bg-bg px-3 py-2 dark:border-slate-700 dark:bg-slate-900">
            • Creative brief auto-generated for Automation ROI blitz.
          </li>
          <li className="rounded-2xl border border-border bg-bg px-3 py-2 dark:border-slate-700 dark:bg-slate-900">
            • Integrate Market Research persona refresh before webinar.
          </li>
          <li className="rounded-2xl border border-border bg-bg px-3 py-2 dark:border-slate-700 dark:bg-slate-900">
            • Prospect Radar follow-up tasks queued for registrants.
          </li>
        </ul>
        <Button
          variant="ghost"
          size="sm"
          icon={<FiCheckCircle />}
          className="mt-4"
          onClick={() => onNavigate?.("member-tasks")}
        >
          View tasks
        </Button>
      </Card>

      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="New campaign"
        description="Define campaign basics; automations will scaffold deliverables."
        footer={
          <>
            <Button variant="ghost" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setCreateOpen(false)}>
              Save campaign
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <TextInput label="Campaign name" placeholder="Automation ROI blitz" />
          <Select label="Primary channel" defaultValue="paid-social">
            <option value="paid-social">Paid social</option>
            <option value="paid-search">Paid search</option>
            <option value="email">Email</option>
            <option value="events">Events</option>
          </Select>
          <TextInput label="Kickoff date" type="date" />
        </div>
      </Modal>
    </AppShell>
  );
};

export default PlannerPage;

