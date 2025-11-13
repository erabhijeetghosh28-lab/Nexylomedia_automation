import Card from "../../components/ui/Card";
import Toggle from "../../components/ui/Toggle";
import Badge from "../../components/ui/Badge";

const integrations = [
  {
    name: "Google PageSpeed",
    status: "healthy",
    tenantsConnected: 34,
  },
  {
    name: "Gemini AI",
    status: "healthy",
    tenantsConnected: 28,
  },
  {
    name: "Google Ads",
    status: "warning",
    tenantsConnected: 12,
  },
];

const IntegrationsPage = () => {
  return (
    <div className="space-y-6">
      <Card title="Global integrations" subtitle="Manage platform-wide connectors">
        <div className="grid gap-4">
          {integrations.map((integration) => (
            <div
              key={integration.name}
              className="rounded-2xl border border-border bg-bg px-4 py-4 dark:border-slate-700 dark:bg-slate-900"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {integration.name}
                  </p>
                  <p className="text-xs text-muted dark:text-slate-400">
                    Connected tenants: {integration.tenantsConnected}
                  </p>
                </div>
                <Badge
                  variant={integration.status === "healthy" ? "success" : "warning"}
                  dot
                >
                  {integration.status}
                </Badge>
              </div>
              <div className="mt-3">
                <Toggle
                  checked
                  label="Enabled"
                  description="Allow tenants to connect"
                  onChange={() => {}}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default IntegrationsPage;


