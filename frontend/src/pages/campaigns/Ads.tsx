import { useState } from "react";
import { FiCopy, FiDownload, FiPlay } from "react-icons/fi";
import AppShell from "../../layouts/AppShell";
import Card from "../../components/ui/Card";
import DataTable from "../../components/ui/DataTable";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Modal from "../../components/ui/Modal";
import TextInput from "../../components/ui/TextInput";
import Select from "../../components/ui/Select";
import { adVariants } from "../../data/campaigns";

type CampaignPageProps = {
  onNavigate?: (route: string) => void;
};

const AdsBuilderPage = ({ onNavigate }: CampaignPageProps) => {
  const [configureOpen, setConfigureOpen] = useState(false);

  return (
    <AppShell
      title="Ads builder"
      description="Manage cross-channel creatives, test variants, and ship updates fast."
      breadcrumbs={[
        { label: "Org Admin", href: "#" },
        { label: "Campaigns", href: "#" },
        { label: "Ads" },
      ]}
      rightAccessory={
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="ghost" size="sm" icon={<FiDownload />}>
            Export creative brief
          </Button>
          <Button variant="primary" size="sm" icon={<FiPlay />} onClick={() => setConfigureOpen(true)}>
            Launch test
          </Button>
        </div>
      }
      onNavigate={onNavigate}
    >
      <Card
        title="Ad variants"
        subtitle="Performance sampled from live channels."
        action={
          <Badge variant="info" dot>
            Auto-sync enabled
          </Badge>
        }
      >
        <DataTable
          columns={[
            { key: "name", header: "Variant" },
            { key: "channel", header: "Channel" },
            { key: "status", header: "Status" },
            { key: "ctr", header: "CTR" },
            { key: "spend", header: "Spend" },
            {
              key: "actions",
              header: "",
              render: () => (
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" icon={<FiCopy />} onClick={() => setConfigureOpen(true)}>
                    Clone
                  </Button>
                  <Button variant="ghost" size="sm" icon={<FiPlay />} onClick={() => setConfigureOpen(true)}>
                    Launch
                  </Button>
                </div>
              ),
            },
          ]}
          data={adVariants}
        />
      </Card>

      <Card
        title="Creative components"
        subtitle="Blocks ready for reuse."
      >
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              component: "Headline bank",
              detail: "12 high-performing headlines tagged by persona.",
            },
            {
              component: "Visual library",
              detail: "18 approved assets with dark/light variants.",
            },
            {
              component: "CTA experiments",
              detail: "5 call-to-action variants ranked by conversion.",
            },
          ].map((item) => (
            <div
              key={item.component}
              className="rounded-2xl border border-border bg-bg p-4 dark:border-slate-700 dark:bg-slate-900"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-muted dark:text-slate-400">
                {item.component}
              </p>
              <p className="mt-2 text-sm text-slate-900 dark:text-slate-100">{item.detail}</p>
            </div>
          ))}
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="mt-4"
          onClick={() => onNavigate?.("marketing-dashboard")}
        >
          Sync with Market Research
        </Button>
      </Card>

      <Modal
        open={configureOpen}
        onClose={() => setConfigureOpen(false)}
        title="Configure ad variant"
        description="Update targeting, creative, and automation budget guardrails."
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfigureOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setConfigureOpen(false)}>
              Save variant
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <TextInput label="Variant name" placeholder="Automation ROI - carousel" />
          <Select label="Channel" defaultValue="linkedin">
            <option value="linkedin">LinkedIn</option>
            <option value="youtube">YouTube</option>
            <option value="google">Google Ads</option>
          </Select>
          <TextInput label="Daily budget" placeholder="$500" />
        </div>
      </Modal>
    </AppShell>
  );
};

export default AdsBuilderPage;

