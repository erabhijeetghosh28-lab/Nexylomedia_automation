import { useState } from "react";
import { FiCopy, FiEdit3, FiZap } from "react-icons/fi";
import AppShell from "../../layouts/AppShell";
import Card from "../../components/ui/Card";
import DataTable from "../../components/ui/DataTable";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Modal from "../../components/ui/Modal";
import TextInput from "../../components/ui/TextInput";
import Select from "../../components/ui/Select";
import Toggle from "../../components/ui/Toggle";
import { prospectSequences } from "../../data/prospect";

type ProspectPageProps = {
  onNavigate?: (route: string) => void;
};

const SequencesPage = ({ onNavigate }: ProspectPageProps) => {
  const [configureOpen, setConfigureOpen] = useState(false);

  return (
    <AppShell
      title="Sequences"
      description="Design and automate outbound sequences using Market Research intelligence."
      breadcrumbs={[
        { label: "Org Admin", href: "#" },
        { label: "Prospect Radar", href: "#" },
        { label: "Sequences" },
      ]}
      rightAccessory={
        <Button variant="primary" size="sm" icon={<FiZap />} onClick={() => setConfigureOpen(true)}>
          New sequence
        </Button>
      }
      onNavigate={onNavigate}
    >
      <Card
        title="Sequence library"
        subtitle="Monitor performance and manage automation state."
        action={
          <Badge variant="info" dot>
            Auto-personalization from Market Research enabled
          </Badge>
        }
      >
        <DataTable
          columns={[
            { key: "name", header: "Sequence" },
            { key: "status", header: "Status" },
            { key: "replyRate", header: "Reply rate" },
            { key: "steps", header: "Steps" },
            { key: "nextStep", header: "Next step" },
            {
              key: "actions",
              header: "",
              render: () => (
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" icon={<FiEdit3 />} onClick={() => setConfigureOpen(true)}>
                    Edit
                  </Button>
                  <Button variant="ghost" size="sm" icon={<FiCopy />} onClick={() => setConfigureOpen(true)}>
                    Clone
                  </Button>
                </div>
              ),
            },
          ]}
          data={prospectSequences}
        />
      </Card>

      <Card
        title="Personalization tokens"
        subtitle="Automatically injected from Market Research personas."
      >
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              token: "{{persona_problem}}",
              usage: "Highlights a key pain point per persona.",
            },
            {
              token: "{{recent_signal}}",
              usage: "Pulls latest trend mention or trigger.",
            },
            {
              token: "{{roi_stat}}",
              usage: "Uses automation ROI proof tailored to industry.",
            },
          ].map((item) => (
            <div
              key={item.token}
              className="rounded-2xl border border-border bg-bg p-4 dark:border-slate-700 dark:bg-slate-900"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-muted dark:text-slate-400">
                {item.token}
              </p>
              <p className="mt-2 text-sm text-slate-900 dark:text-slate-100">{item.usage}</p>
            </div>
          ))}
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="mt-4"
          onClick={() => onNavigate?.("marketing-trends")}
        >
          Update trend tokens
        </Button>
      </Card>

      <Modal
        open={configureOpen}
        onClose={() => setConfigureOpen(false)}
        title="Configure sequence"
        description="Adjust targeting, templates, and automation settings."
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfigureOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setConfigureOpen(false)}>
              Save sequence
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <TextInput label="Sequence name" placeholder="Ops leader nurture" />
          <Select label="Persona" defaultValue="growth">
            <option value="growth">Growth Operators</option>
            <option value="analyst">Marketing Analysts</option>
            <option value="agency">Agency Directors</option>
          </Select>
          <Toggle
            checked
            label="Enable AI personalization"
            description="Inject persona insights into email copy."
          />
        </div>
      </Modal>
    </AppShell>
  );
};

export default SequencesPage;

