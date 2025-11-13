import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import DataTable from "../../components/ui/DataTable";
import TextInput from "../../components/ui/TextInput";
import { tenantSummaries } from "../../data/superAdmin";

const TenantsPage = () => {
  return (
    <div className="space-y-6">
      <Card
        title="Tenant catalogue"
        subtitle="Search, sort, and take quick actions on organizations."
        action={
          <div className="flex flex-wrap items-center gap-2">
            <TextInput placeholder="Search tenant..." className="w-64" />
            <Button variant="ghost" size="sm">
              Filters
            </Button>
            <Button variant="primary" size="sm">
              Add tenant
            </Button>
          </div>
        }
      >
        <DataTable
          columns={[
            { key: "name", header: "Tenant" },
            { key: "plan", header: "Plan" },
            { key: "status", header: "Status" },
            { key: "users", header: "Users", align: "center" as const },
            {
              key: "apiCalls",
              header: "API Calls",
              align: "right" as const,
            },
            {
              key: "aiTokens",
              header: "AI Tokens",
              align: "right" as const,
            },
          ]}
          data={tenantSummaries}
        />
      </Card>
    </div>
  );
};

export default TenantsPage;


