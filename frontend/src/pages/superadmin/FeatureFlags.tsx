import Card from "../../components/ui/Card";
import Toggle from "../../components/ui/Toggle";
import { platformFeatureMatrix } from "../../data/superAdmin";

const SuperAdminFeatureFlags = () => {
  return (
    <div className="space-y-6">
      {platformFeatureMatrix.map((feature) => (
        <Card
          key={feature.feature}
          title={feature.feature}
          subtitle="Tenant-specific availability"
        >
          <div className="grid gap-3">
            {feature.tenants.map((tenant) => (
              <Toggle
                key={tenant.name}
                checked={tenant.enabled}
                label={tenant.name}
                description={tenant.enabled ? "Enabled" : "Disabled"}
                onChange={() => {}}
              />
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
};

export default SuperAdminFeatureFlags;


