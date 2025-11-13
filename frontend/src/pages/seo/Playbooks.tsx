import { useState } from "react";
import { FiCopy, FiDownload, FiEdit, FiPlay } from "react-icons/fi";
import AppShell from "../../layouts/AppShell";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import DataTable from "../../components/ui/DataTable";
import Modal from "../../components/ui/Modal";
import TextInput from "../../components/ui/TextInput";
import Select from "../../components/ui/Select";
import { seoPlaybooks } from "../../data/seoAutopilot";

type SeoPageProps = {
  onNavigate?: (route: string) => void;
};

const PlaybooksPage = ({ onNavigate }: SeoPageProps) => {
  const [selectedPlaybook, setSelectedPlaybook] = useState<string | null>(null);

  const handleClone = (id: string) => {
    setSelectedPlaybook(id);
  };

  return (
    <AppShell
      title="SEO Playbooks"
      description="Blueprints that combine automations, tasks, and monitoring. Clone or customize them to accelerate execution."
      breadcrumbs={[
        { label: "Org Admin", href: "#" },
        { label: "SEO Autopilot", href: "#" },
        { label: "Playbooks" },
      ]}
      rightAccessory={
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="ghost" size="sm" icon={<FiDownload />}>
            Export library
          </Button>
          <Button variant="primary" size="sm" icon={<FiEdit />} onClick={() => setSelectedPlaybook("new")}>
            New playbook
          </Button>
        </div>
      }
      onNavigate={onNavigate}
    >
      <Card
        title="Available playbooks"
        subtitle="Sorted by impact on traffic & conversion."
        action={
          <Badge variant="success" dot>
            3 pending approvals
          </Badge>
        }
      >
        <DataTable
          columns={[
            { key: "name", header: "Name" },
            { key: "description", header: "What it does" },
            { key: "difficulty", header: "Difficulty" },
            { key: "automation", header: "Automation level" },
            {
              key: "actions",
              header: "",
              render: (item: (typeof seoPlaybooks)[number]) => (
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" icon={<FiCopy />} onClick={() => handleClone(item.id)}>
                    Clone
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={<FiPlay />}
                    onClick={() => onNavigate?.("member-automations")}
                  >
                    Preview run
                  </Button>
                </div>
              ),
            },
          ]}
          data={seoPlaybooks}
        />
      </Card>

      <section className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <Card title="Playbook categories" subtitle="Organized by outcome.">
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                title: "Technical hygiene",
                items: ["CWV remediation", "Broken link purge", "Schema validator"],
              },
              {
                title: "Growth sprints",
                items: ["Keyword expansion", "Automation nurture follow-up", "Topic cluster builder"],
              },
              {
                title: "Authority",
                items: ["Backlink clean-up", "Partner outreach", "Brand monitoring"],
              },
            ].map((category) => (
              <div
                key={category.title}
                className="rounded-2xl border border-border bg-bg p-4 dark:border-slate-700 dark:bg-slate-900"
              >
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {category.title}
                </p>
                <ul className="mt-2 space-y-1 text-xs text-muted dark:text-slate-400">
                  {category.items.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Governance" subtitle="Manage who can publish and run playbooks.">
          <div className="space-y-4">
            <Badge variant="info">Approval workflow</Badge>
            <p className="text-xs text-muted dark:text-slate-400">
              Playbooks require Org Admin approval before automations go live. Members can draft but
              not deploy.
            </p>
            <Button variant="ghost" size="sm" onClick={() => onNavigate?.("team")}>
              Manage reviewers
            </Button>
          </div>
        </Card>
      </section>

      <Modal
        open={Boolean(selectedPlaybook)}
        onClose={() => setSelectedPlaybook(null)}
        title="Playbook configuration"
        description="Set ownership, severity, and automation toggles before publishing."
        footer={
          <>
            <Button variant="ghost" onClick={() => setSelectedPlaybook(null)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setSelectedPlaybook(null)}>
              Save draft
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <TextInput label="Playbook title" defaultValue="Web vitals remediation" />
          <Select label="Owner" defaultValue="seo">
            <option value="seo">SEO Lead</option>
            <option value="engineering">Engineering</option>
            <option value="content">Content</option>
          </Select>
          <Select label="Automation level" defaultValue="auto">
            <option value="manual">Manual with recommendations</option>
            <option value="semi">Semi-automated (review required)</option>
            <option value="auto">Fully automated</option>
          </Select>
        </div>
      </Modal>
    </AppShell>
  );
};

export default PlaybooksPage;

