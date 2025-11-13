import { useMemo, useState } from "react";
import { FiDownload, FiFilter, FiZap } from "react-icons/fi";
import AppShell from "../../layouts/AppShell";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import DataTable from "../../components/ui/DataTable";
import Badge from "../../components/ui/Badge";
import Modal from "../../components/ui/Modal";
import TextInput from "../../components/ui/TextInput";
import Select from "../../components/ui/Select";
import { personaInsights } from "../../data/marketing";

type MarketingPageProps = {
  onNavigate?: (route: string) => void;
};

const PersonaPage = ({ onNavigate }: MarketingPageProps) => {
  const [segmentFilter, setSegmentFilter] = useState("All");
  const [generateOpen, setGenerateOpen] = useState(false);

  const filteredPersonas = useMemo(() => {
    if (segmentFilter === "All") {
      return personaInsights;
    }
    return personaInsights.filter((persona) => persona.name.includes(segmentFilter));
  }, [segmentFilter]);

  return (
    <AppShell
      title="Persona intelligence"
      description="Deep insights refreshed continuously. Export persona cards or sync with Prospect Radar."
      breadcrumbs={[
        { label: "Org Admin", href: "#" },
        { label: "Market Research", href: "#" },
        { label: "Personas" },
      ]}
      rightAccessory={
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="ghost" size="sm" icon={<FiDownload />}>
            Export personas
          </Button>
          <Button variant="primary" size="sm" icon={<FiZap />} onClick={() => setGenerateOpen(true)}>
            Generate persona
          </Button>
        </div>
      }
      onNavigate={onNavigate}
    >
      <Card
        title="Persona segments"
        subtitle="Filter by focus area."
        action={
          <Button variant="ghost" size="sm" icon={<FiFilter />}>
            Advanced filters
          </Button>
        }
      >
        <div className="flex flex-wrap items-center gap-2">
          {["All", "Growth", "Analysts", "Agencies"].map((segment) => (
            <button
              key={segment}
              type="button"
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                segmentFilter === segment
                  ? "bg-secondary text-secondary-foreground shadow-subtle"
                  : "bg-bg text-muted hover:bg-secondary/10 hover:text-secondary dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-secondary/20"
              }`}
              onClick={() => setSegmentFilter(segment)}
            >
              {segment}
            </button>
          ))}
        </div>
      </Card>

      <Card
        title="Persona library"
        subtitle="Each persona maintains motivations, objections, and winning plays."
        action={
          <Badge variant="info" dot>
            Sync with Prospect Radar
          </Badge>
        }
      >
        <DataTable
          columns={[
            { key: "name", header: "Persona" },
            { key: "painPoints", header: "Pain points" },
            { key: "triggers", header: "Triggers" },
            {
              key: "topChannels",
              header: "Top channels",
              render: (item: (typeof filteredPersonas)[number]) => item.topChannels.join(", "),
            },
          ]}
          data={filteredPersonas}
        />
      </Card>

      <Modal
        open={generateOpen}
        onClose={() => setGenerateOpen(false)}
        title="Generate persona"
        description="AI will combine research with CRM data to build a fresh persona."
        footer={
          <>
            <Button variant="ghost" onClick={() => setGenerateOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setGenerateOpen(false)}>
              Generate
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <TextInput label="Persona focus" placeholder="Ops leader evaluating automation" />
          <Select label="Region" defaultValue="global">
            <option value="global">Global</option>
            <option value="na">North America</option>
            <option value="eu">Europe</option>
            <option value="apac">APAC</option>
          </Select>
          <TextInput
            label="Key sources"
            placeholder="Upload transcripts, add RSS feed, include CRM account ids"
          />
        </div>
      </Modal>
    </AppShell>
  );
};

export default PersonaPage;

