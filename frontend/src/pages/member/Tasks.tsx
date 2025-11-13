import { useMemo, useState } from "react";
import { FiFilter, FiPlus, FiTrendingUp } from "react-icons/fi";
import MemberShell from "../../layouts/MemberShell";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Modal from "../../components/ui/Modal";
import TextInput from "../../components/ui/TextInput";
import Select from "../../components/ui/Select";
import DataTable from "../../components/ui/DataTable";
import { memberTasks } from "../../data/member";

type MemberPageProps = {
  onNavigate?: (route: string) => void;
};

const statusFilters = ["All", "In progress", "Blocked", "Queued"];

const TasksPage = ({ onNavigate }: MemberPageProps) => {
  const [filter, setFilter] = useState("All");
  const [createOpen, setCreateOpen] = useState(false);

  const filteredTasks = useMemo(() => {
    if (filter === "All") return memberTasks;
    return memberTasks.filter((task) => task.status === filter);
  }, [filter]);

  return (
    <MemberShell
      title="Tasks & activity"
      description="Stay on top of personal deliverables across automations, campaigns, and shared playbooks."
      breadcrumbs={[
        { label: "My workspace", href: "#" },
        { label: "Tasks" },
      ]}
      rightAccessory={
        <Button variant="primary" size="sm" icon={<FiPlus />} onClick={() => setCreateOpen(true)}>
          New task
        </Button>
      }
      onNavigate={onNavigate}
      activeRoute="member-tasks"
    >
      <Card
        title="Task filters"
        subtitle="Focus on what matters right now."
        action={
          <Button variant="ghost" size="sm" icon={<FiFilter />}>
            Quick filters
          </Button>
        }
      >
        <div className="flex flex-wrap items-center gap-2">
          {statusFilters.map((status) => (
            <button
              key={status}
              type="button"
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                filter === status
                  ? "bg-primary text-primary-foreground shadow-subtle"
                  : "bg-bg text-muted hover:bg-primary/10 hover:text-primary dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-primary/20"
              }`}
              onClick={() => setFilter(status)}
            >
              {status}
            </button>
          ))}
        </div>
      </Card>

      <Card
        title="Task queue"
        subtitle="Drag-and-drop interactions coming soon — for now review your pipeline."
        action={
          <Badge variant="info" dot>
            3 automation hand-offs
          </Badge>
        }
      >
        <DataTable
          columns={[
            {
              key: "title",
              header: "Task",
              render: (item: (typeof filteredTasks)[number]) => (
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {item.title}
                  </p>
                  <p className="text-xs text-muted dark:text-slate-400">
                    {item.tags.join(" · ")}
                  </p>
                </div>
              ),
            },
            {
              key: "due",
              header: "Due",
            },
            {
              key: "status",
              header: "Status",
              render: (item: (typeof filteredTasks)[number]) => (
                <Badge variant={item.status === "Blocked" ? "danger" : "secondary"} dot>
                  {item.status}
                </Badge>
              ),
            },
            {
              key: "priority",
              header: "Priority",
              render: (item: (typeof filteredTasks)[number]) => (
                <Badge variant={item.priority === "High" ? "danger" : "default"}>
                  {item.priority}
                </Badge>
              ),
            },
          ]}
          data={filteredTasks}
          emptyState="All tasks completed — nice work!"
        />
      </Card>

      <Card
        title="Progress summary"
        subtitle="Tracked automatically from your automations and manual updates."
      >
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { label: "Automation-assisted", value: "62%", detail: "11 of 18 tasks" },
            { label: "Manual effort", value: "38%", detail: "7 of 18 tasks" },
            { label: "Average completion time", value: "1.6 days", detail: "-10% vs last week" },
          ].map((metric) => (
            <div
              key={metric.label}
              className="rounded-2xl border border-border bg-bg p-4 dark:border-slate-700 dark:bg-slate-900"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-muted dark:text-slate-400">
                {metric.label}
              </p>
              <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">
                {metric.value}
              </p>
              <p className="mt-1 text-xs text-muted dark:text-slate-400">{metric.detail}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card
        title="Workflow nudges"
        subtitle="Automated suggestions to keep execution tight."
        action={
          <Button variant="ghost" size="sm" icon={<FiTrendingUp />}>
            View historical impact
          </Button>
        }
      >
        <ul className="space-y-3">
          <li className="rounded-2xl border border-border bg-bg px-4 py-3 text-sm text-muted dark:border-slate-700 dark:bg-slate-900">
            • Move “Approve outreach copy” before tomorrow’s automation run to avoid delays.
          </li>
          <li className="rounded-2xl border border-border bg-bg px-4 py-3 text-sm text-muted dark:border-slate-700 dark:bg-slate-900">
            • Enable Slack reminders for tasks tagged “SEO” to get real-time alerts.
          </li>
          <li className="rounded-2xl border border-border bg-bg px-4 py-3 text-sm text-muted dark:border-slate-700 dark:bg-slate-900">
            • Archive completed tasks every Friday to keep your workspace lean.
          </li>
        </ul>
      </Card>

      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Create new task"
        description="Draft a task to add into your personal queue. Automation hooks coming soon."
        footer={
          <>
            <Button variant="ghost" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setCreateOpen(false)}>
              Save draft
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <TextInput label="Title" placeholder="Review automation summary" autoFocus />
          <Select label="Status" defaultValue="In progress">
            <option value="In progress">In progress</option>
            <option value="Queued">Queued</option>
            <option value="Blocked">Blocked</option>
          </Select>
          <TextInput label="Due date" placeholder="2025-11-15" type="date" />
        </div>
      </Modal>
    </MemberShell>
  );
};

export default TasksPage;

