import Card from "../../components/ui/Card";
import DataTable from "../../components/ui/DataTable";
import { auditLogMock } from "../../data/superAdmin";

const AuditLogsPage = () => {
  return (
    <div className="space-y-6">
      <Card
        title="Admin activity logs"
        subtitle="Searchable record of privileged actions"
      >
        <DataTable
          columns={[
            { key: "timestamp", header: "Timestamp" },
            { key: "actor", header: "Actor" },
            { key: "action", header: "Action" },
            { key: "ip", header: "IP address" },
          ]}
          data={auditLogMock}
        />
      </Card>
    </div>
  );
};

export default AuditLogsPage;


