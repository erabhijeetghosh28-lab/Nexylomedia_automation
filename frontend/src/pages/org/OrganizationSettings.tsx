import { FiGlobe, FiImage, FiSave, FiSettings } from "react-icons/fi";
import AppShell from "../../layouts/AppShell";
import Card from "../../components/ui/Card";
import TextInput from "../../components/ui/TextInput";
import Select from "../../components/ui/Select";
import Button from "../../components/ui/Button";
import Toggle from "../../components/ui/Toggle";

type OrgPageProps = {
  onNavigate?: (route: string) => void;
};

const OrganizationSettings = ({ onNavigate }: OrgPageProps) => {
  return (
    <AppShell
      title="Organization Settings"
      description="Configure branding, timezone, contact details, and billing preferences for Nexylomedia HQ."
      breadcrumbs={[
        { label: "Org Admin", href: "#" },
        { label: "Settings" },
      ]}
      activeNav="settings"
      rightAccessory={
        <Button variant="primary" size="sm" icon={<FiSave />}>
          Save changes
        </Button>
      }
      onNavigate={onNavigate}
    >
      <section className="grid gap-6 lg:grid-cols-2">
        <Card
          title="Branding"
          subtitle="Upload logo and define accent color"
          action={
            <Button variant="ghost" size="sm" icon={<FiImage />}>
              Upload logo
            </Button>
          }
        >
          <div className="space-y-4">
            <TextInput
              label="Organization name"
              placeholder="Nexylomedia HQ"
              defaultValue="Nexylomedia HQ"
            />
            <TextInput
              label="Accent color"
              type="color"
              defaultValue="#4f46e5"
              className="h-12 w-24 cursor-pointer"
            />
            <label className="flex items-center gap-4 rounded-2xl border border-dashed border-border bg-bg px-4 py-3 text-sm text-muted dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
              <input type="checkbox" defaultChecked />
              Apply branding across client reports and public dashboards
            </label>
          </div>
        </Card>

        <Card
          title="Regional settings"
          subtitle="Timezone, reporting currency, locale"
          action={
            <Button variant="ghost" size="sm" icon={<FiGlobe />}>
              Detect automatically
            </Button>
          }
        >
          <div className="grid gap-4">
            <Select label="Timezone" defaultValue="IST">
              <option value="UTC">UTC (Coordinated Universal Time)</option>
              <option value="IST">Asia/Kolkata (IST)</option>
              <option value="EST">America/New_York (EST)</option>
              <option value="CET">Europe/Berlin (CET)</option>
            </Select>
            <Select label="Currency" defaultValue="INR">
              <option value="USD">USD – US Dollar</option>
              <option value="EUR">EUR – Euro</option>
              <option value="INR">INR – Indian Rupee</option>
              <option value="GBP">GBP – British Pound</option>
            </Select>
            <Select label="Locale" defaultValue="en-IN">
              <option value="en-US">English (United States)</option>
              <option value="en-IN">English (India)</option>
              <option value="en-GB">English (United Kingdom)</option>
              <option value="es-ES">Spanish (Spain)</option>
            </Select>
          </div>
        </Card>

        <Card title="Contact & billing" subtitle="Primary contact information">
          <div className="grid gap-4">
            <TextInput
              label="Billing contact"
              placeholder="Priya Sharma"
              defaultValue="Priya Sharma"
            />
            <TextInput
              label="Billing email"
              type="email"
              placeholder="finance@nexylomedia.com"
              defaultValue="finance@nexylomedia.com"
            />
            <TextInput
              label="Support phone"
              placeholder="+91 9876543210"
              defaultValue="+91 9876543210"
            />
            <label className="flex items-start gap-3 rounded-2xl border border-border bg-bg px-4 py-3 text-sm text-muted dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
              <input type="checkbox" defaultChecked />
              Send monthly usage summaries and invoices to billing contact
            </label>
          </div>
        </Card>

        <Card
          title="Advanced"
          subtitle="Governance, compliance and feature toggles"
          action={
            <Button variant="ghost" size="sm" icon={<FiSettings />}>
              Manage defaults
            </Button>
          }
        >
          <div className="space-y-3">
            <Toggle
              checked
              label="Require MFA for all users"
              description="Users must configure a second factor on next login."
            />
            <Toggle
              checked
              label="Restrict API keys to India region"
              description="Prevent accidental token usage from non-compliant regions."
            />
            <Toggle
              checked={false}
              label="Enable experimental AI copywriter"
              description="Allow team to generate campaign copy with Gemini."
            />
            <Toggle
              checked
              label="Auto-provision new seats when invites accepted"
              description="Charge per-seat overages automatically."
            />
          </div>
        </Card>
      </section>
    </AppShell>
  );
};

export default OrganizationSettings;


