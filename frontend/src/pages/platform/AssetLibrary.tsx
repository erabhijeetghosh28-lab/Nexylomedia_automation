import { FiDownload, FiUploadCloud } from "react-icons/fi";
import AppShell from "../../layouts/AppShell";
import Card from "../../components/ui/Card";
import DataTable from "../../components/ui/DataTable";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import { assetLibrary } from "../../data/platform";

type PlatformPageProps = {
  onNavigate?: (route: string) => void;
};

const AssetLibraryPage = ({ onNavigate }: PlatformPageProps) => {
  return (
    <AppShell
      title="Digital asset manager"
      description="Central hub for campaign-ready assets synced with all surfaces."
      breadcrumbs={[
        { label: "Org Admin", href: "#" },
        { label: "Platform Ops", href: "#" },
        { label: "Asset library" },
      ]}
      rightAccessory={
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="ghost" size="sm" icon={<FiDownload />}>
            Export manifest
          </Button>
          <Button variant="primary" size="sm" icon={<FiUploadCloud />} onClick={() => onNavigate?.("campaign-ads")}>
            Upload asset
          </Button>
        </div>
      }
      onNavigate={onNavigate}
    >
      <Card
        title="Asset inventory"
        subtitle="Metadata stays in sync across Campaigns and Member workspace."
        action={
          <Badge variant="info" dot>
            Version control enabled
          </Badge>
        }
      >
        <DataTable
          columns={[
            { key: "name", header: "Asset" },
            { key: "type", header: "Type" },
            {
              key: "tags",
              header: "Tags",
              render: (item: (typeof assetLibrary)[number]) => item.tags.join(", "),
            },
            { key: "updated", header: "Updated" },
          ]}
          data={assetLibrary}
        />
      </Card>

      <Card
        title="Usage automations"
        subtitle="Assets notify when reused or need refresh."
      >
        <ul className="space-y-3 text-xs text-muted dark:text-slate-400">
          <li className="rounded-2xl border border-border bg-bg px-3 py-2 dark:border-slate-700 dark:bg-slate-900">
            • Automatic rights check before publishing externally.
          </li>
          <li className="rounded-2xl border border-border bg-bg px-3 py-2 dark:border-slate-700 dark:bg-slate-900">
            • Send update tasks to Member workspace when asset stale &gt; 30 days.
          </li>
          <li className="rounded-2xl border border-border bg-bg px-3 py-2 dark:border-slate-700 dark:bg-slate-900">
            • Push asset analytics to Platform analytics hub weekly.
          </li>
        </ul>
      </Card>
    </AppShell>
  );
};

export default AssetLibraryPage;

