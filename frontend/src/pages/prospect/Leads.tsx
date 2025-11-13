import { useState } from "react";
import { FiDownload, FiFilter, FiUserPlus } from "react-icons/fi";
import AppShell from "../../layouts/AppShell";
import Card from "../../components/ui/Card";
import DataTable from "../../components/ui/DataTable";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Modal from "../../components/ui/Modal";
import TextInput from "../../components/ui/TextInput";
import Select from "../../components/ui/Select";
import { prospectLeads } from "../../data/prospect";

type ProspectPageProps = {
  onNavigate?: (route: string) => void;
};

const LeadsPage = ({ onNavigate }: ProspectPageProps) => {
  const [createOpen, setCreateOpen] = useState(false);
  const [filter, setFilter] = useState<"All" | "High" | "Medium">("All");

  const filteredLeads =
    filter === "All" ? prospectLeads : prospectLeads.filter((lead) => lead.fit === filter);

  return (
    <AppShell
      title="Lead universe"
      description="Search, filter, and assign leads captured by Prospect Radar automations."
      breadcrumbs={[
        { label: "Org Admin", href: "#" },
        { label: "Prospect Radar", href: "#" },
        { label: "Leads" },
      ]}
      rightAccessory={
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="ghost" size="sm" icon={<FiDownload />}>
            Export leads
          </Button>
          <Button variant="primary" size="sm" icon={<FiUserPlus />} onClick={() => setCreateOpen(true)}>
            Add lead
          </Button>
        </div>
      }
      onNavigate={onNavigate}
    >
      <Card
        title="Filters"
        subtitle="Refine your view."
        action={
          <Button variant="ghost" size="sm" icon={<FiFilter />}>
            Advanced filters
          </Button>
        }
      >
        <div className="flex flex-wrap items-center gap-2">
          {(["All", "High", "Medium"] as const).map((option) => (
            <button
              key={option}
              type="button"
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                filter === option
                  ? "bg-primary text-primary-foreground shadow-subtle"
                  : "bg-bg text-muted hover:bg-primary/10 hover:text-primary dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-primary/20"
              }`}
              onClick={() => setFilter(option)}
            >
              {option} fit
            </button>
          ))}
        </div>
      </Card>

      <Card
        title="Lead table"
        subtitle="Syncs automatically with CRM and Outreach."
        action={
          <Badge variant="info" dot>
            3 new today
          </Badge>
        }
      >
        <DataTable
          columns={[
            { key: "name", header: "Lead" },
            { key: "company", header: "Company" },
            { key: "stage", header: "Stage" },
            { key: "fit", header: "Fit" },
            { key: "owner", header: "Owner" },
          ]}
          data={filteredLeads}
        />
      </Card>

      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Add lead"
        description="Create a lead manually or import via CSV. Automation scoring runs instantly."
        footer={
          <>
            <Button variant="ghost" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setCreateOpen(false)}>
              Save lead
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <TextInput label="Name" placeholder="Casey Rivera" />
          <TextInput label="Company" placeholder="GrowthFlow" />
          <Select label="Fit" defaultValue="High">
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </Select>
        </div>
      </Modal>
    </AppShell>
  );
};

export default LeadsPage;

