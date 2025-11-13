import Card from "../../components/ui/Card";
import DataTable from "../../components/ui/DataTable";
import { invoiceHistory } from "../../data/superAdmin";

const BillingPage = () => {
  return (
    <div className="space-y-6">
      <Card
        title="Invoice history"
        subtitle="Charges generated across all tenants"
      >
        <DataTable
          columns={[
            { key: "invoiceId", header: "Invoice" },
            { key: "tenant", header: "Tenant" },
            {
              key: "amount",
              header: "Amount",
              align: "right" as const,
              render: (invoice) => `$${invoice.amount}`,
            },
            { key: "status", header: "Status" },
            { key: "issuedAt", header: "Issued at" },
          ]}
          data={invoiceHistory}
        />
      </Card>
    </div>
  );
};

export default BillingPage;


