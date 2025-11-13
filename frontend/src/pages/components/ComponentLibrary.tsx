import { useMemo, useState } from "react";
import {
  FiDownload,
  FiFilter,
  FiLoader,
  FiPlus,
  FiSearch,
  FiSend,
  FiSettings,
  FiTrendingUp,
} from "react-icons/fi";
import AppShell from "../../layouts/AppShell";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import TextInput from "../../components/ui/TextInput";
import Select from "../../components/ui/Select";
import Badge from "../../components/ui/Badge";
import Tabs from "../../components/ui/Tabs";
import DataTable from "../../components/ui/DataTable";
import Sparkline from "../../components/ui/Sparkline";
import Modal from "../../components/ui/Modal";

const colorTokens = [
  { name: "Primary", token: "primary", hex: "#4f46e5" },
  { name: "Secondary", token: "secondary", hex: "#8b5cf6" },
  { name: "Success", token: "success", hex: "#10b981" },
  { name: "Warning", token: "warning", hex: "#f59e0b" },
  { name: "Danger", token: "danger", hex: "#ef4444" },
  { name: "Info", token: "info", hex: "#0ea5e9" },
  { name: "Background", token: "bg", hex: "#f8fafc" },
  { name: "Surface", token: "bg-surface", hex: "#ffffff" },
];

const demoTableData = [
  {
    tenant: "Nexylomedia HQ",
    plan: "Enterprise",
    status: "Active",
    mrr: "$12,900",
    trend: [30, 40, 42, 45, 48, 52, 58],
  },
  {
    tenant: "Acme Retail",
    plan: "Growth",
    status: "Trial",
    mrr: "$3,250",
    trend: [18, 22, 26, 24, 28, 30, 33],
  },
  {
    tenant: "Luna Cosmetics",
    plan: "Starter",
    status: "Paused",
    mrr: "$1,180",
    trend: [10, 8, 12, 14, 13, 11, 9],
  },
];

const buttonVariants = [
  { label: "Primary", variant: "primary" },
  { label: "Secondary", variant: "secondary" },
  { label: "Success", variant: "success" },
  { label: "Danger", variant: "danger" },
  { label: "Outline", variant: "outline" },
  { label: "Ghost", variant: "ghost" },
] as const;

const ComponentLibraryPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("buttons");

  const tableColumns = useMemo(
    () => [
      {
        key: "tenant",
        header: "Tenant",
        render: (item: (typeof demoTableData)[number]) => (
          <div>
            <p className="font-semibold text-slate-900">{item.tenant}</p>
            <p className="text-xs text-muted">Onboarded 72 days ago</p>
          </div>
        ),
      },
      {
        key: "plan",
        header: "Plan",
        render: (item: (typeof demoTableData)[number]) => (
          <Badge variant="primary">{item.plan}</Badge>
        ),
      },
      {
        key: "status",
        header: "Status",
        render: (item: (typeof demoTableData)[number]) => (
          <Badge
            variant={
              item.status === "Active"
                ? "success"
                : item.status === "Trial"
                  ? "warning"
                  : "danger"
            }
            dot
          >
            {item.status}
          </Badge>
        ),
      },
      {
        key: "mrr",
        header: "MRR",
        align: "right" as const,
      },
      {
        key: "trend",
        header: "Growth",
        render: (item: (typeof demoTableData)[number]) => (
          <Sparkline
            values={item.trend}
            variant={
              item.status === "Active"
                ? "success"
                : item.status === "Paused"
                  ? "danger"
                  : "primary"
            }
          />
        ),
      },
    ],
    [],
  );

  return (
    <AppShell
      title="Component Library"
      description="Reusable primitives that power every tool inside Nexylomedia Automation. Use these as building blocks for dashboards, modals, lists, and detail surfaces."
      breadcrumbs={[
        { label: "Platform", href: "#" },
        { label: "Design System", href: "#" },
        { label: "Component Library" },
      ]}
      rightAccessory={
        <Button variant="outline" icon={<FiDownload />} iconPosition="right">
          Export Tokens
        </Button>
      }
    >
      <section className="grid gap-6 lg:grid-cols-2">
        <Card title="Color Tokens" subtitle="Semantic palette for the platform">
          <div className="grid gap-4 sm:grid-cols-2">
            {colorTokens.map((color) => (
              <div
                key={color.token}
                className="flex items-center gap-4 rounded-xl border border-border bg-bg px-4 py-3"
              >
                <span
                  className="h-12 w-12 rounded-xl shadow-subtle"
                  style={{ backgroundColor: color.hex }}
                />
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {color.name}
                  </p>
                  <p className="text-xs text-muted">--color-{color.token}</p>
                  <p className="text-xs font-mono text-muted">{color.hex}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Typography Scale" subtitle="Heading to helper text">
          <div className="space-y-4">
            <div>
              <p className="text-xs font-semibold uppercase text-muted">
                Display
              </p>
              <h1 className="text-h1">Heading 1 / 44px</h1>
              <h2 className="text-h2 mt-2">Heading 2 / 36px</h2>
              <h3 className="text-h3 mt-2">Heading 3 / 30px</h3>
            </div>
            <div className="grid gap-2">
              <h4 className="text-h4">Heading 4 / 24px</h4>
              <h5 className="text-h5">Heading 5 / 20px</h5>
              <h6 className="text-h6">Heading 6 / 18px</h6>
            </div>
            <div className="grid gap-1">
              <p className="text-body">
                Body text – Vestibulum ante ipsum primis in faucibus orci luctus
                et ultrices posuere cubilia curae.
              </p>
              <p className="text-small text-muted">
                Small helper text – Use for captions or metadata in tables.
              </p>
              <p className="text-xs font-mono text-muted">
                Monospace – 0x7c3f5a • For tokens, code, and query snippets.
              </p>
            </div>
          </div>
        </Card>
      </section>

      <Card
        title="Component Playground"
        subtitle="Buttons, forms, chips, tables, modals, and stateful elements"
        action={
          <Tabs
            items={[
              { key: "buttons", label: "Buttons", icon: <FiPlus /> },
              { key: "forms", label: "Forms", icon: <FiSearch /> },
              { key: "feedback", label: "Feedback", icon: <FiSettings /> },
            ]}
            activeKey={activeTab}
            onChange={setActiveTab}
          />
        }
      >
        <div className="space-y-10">
          <div className="grid gap-4 lg:grid-cols-2">
            <section className="rounded-2xl border border-border bg-bg px-5 py-6">
              <h4 className="text-h5 text-slate-900">Buttons</h4>
              <p className="mt-1 text-sm text-muted">
                Filled, outline, ghost, and semantic buttons with loading state.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                {buttonVariants.map((variant) => (
                  <Button
                    key={variant.variant}
                    variant={variant.variant}
                    icon={<FiTrendingUp />}
                    iconPosition="right"
                  >
                    {variant.label}
                  </Button>
                ))}
                <Button variant="primary" loading icon={<FiLoader />}>
                  Loading
                </Button>
                <Button variant="ghost" size="sm">
                  Small Ghost
                </Button>
                <Button variant="outline" size="lg">
                  Large Outline
                </Button>
              </div>
            </section>

            <section className="rounded-2xl border border-border bg-bg px-5 py-6">
              <h4 className="text-h5 text-slate-900">Form Controls</h4>
              <p className="mt-1 text-sm text-muted">
                Inputs, selects, and validation messaging.
              </p>
              <div className="mt-4 grid gap-4">
                <TextInput
                  label="Search tenants"
                  placeholder="Search by name or domain"
                  icon={<FiSearch />}
                />
                <TextInput
                  label="Billing email"
                  type="email"
                  placeholder="finance@nexylomedia.com"
                  error="Email already associated with another tenant"
                />
                <Select label="Plan tier" defaultValue="growth">
                  <option value="starter">Starter</option>
                  <option value="growth">Growth</option>
                  <option value="enterprise">Enterprise</option>
                </Select>
              </div>
            </section>
          </div>

          <section className="rounded-2xl border border-border bg-bg px-5 py-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h4 className="text-h5 text-slate-900">Data Table</h4>
                <p className="text-sm text-muted">
                  Tenants with plan, status, and sparkline trend.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="ghost" icon={<FiFilter />}>
                  Filters
                </Button>
                <Button
                  variant="primary"
                  icon={<FiPlus />}
                  onClick={() => setModalOpen(true)}
                >
                  Invite Tenant
                </Button>
              </div>
            </div>
            <div className="mt-4">
              <DataTable
                columns={tableColumns}
                data={demoTableData}
                caption="Paying tenants"
              />
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-bg px-5 py-6">
            <h4 className="text-h5 text-slate-900">Feedback & States</h4>
            <p className="text-sm text-muted">
              Badges, chips, empty states, and skeleton placeholders.
            </p>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  <Badge dot variant="success">
                    Automation Healthy
                  </Badge>
                  <Badge dot variant="warning">
                    Action Required
                  </Badge>
                  <Badge dot variant="danger">
                    Incident Reported
                  </Badge>
                  <Badge variant="info">Beta Feature</Badge>
                </div>

                <div className="rounded-2xl border border-dashed border-border bg-white px-5 py-6 text-center">
                  <h5 className="text-h5 text-slate-900">Empty state</h5>
                  <p className="mt-2 text-sm text-muted">
                    Connect an integration to start pulling data into the
                    dashboard.
                  </p>
                  <div className="mt-4 flex justify-center gap-2">
                    <Button variant="primary" size="sm">
                      Connect PageSpeed
                    </Button>
                    <Button variant="outline" size="sm">
                      Learn more
                    </Button>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-dashed border-border bg-white px-6 py-6">
                <div className="h-24 animate-pulse rounded-2xl bg-muted/20" />
                <div className="mt-4 space-y-2">
                  <div className="h-3 w-3/4 animate-pulse rounded-full bg-muted/20" />
                  <div className="h-3 w-2/3 animate-pulse rounded-full bg-muted/20" />
                  <div className="h-3 w-1/2 animate-pulse rounded-full bg-muted/20" />
                </div>
                <p className="mt-4 text-xs text-muted">
                  Loading skeleton example for cards and tables.
                </p>
              </div>
            </div>
          </section>
        </div>
      </Card>

      <Modal
        open={modalOpen}
        title="Invite new tenant"
        description="Send an invitation email for a new tenant onboarding. Customize plan tier and trial length."
        onClose={() => setModalOpen(false)}
        footer={
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" icon={<FiSend />}>
              Send invite
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <TextInput
            label="Tenant name"
            placeholder="Nexylomedia Labs"
            required
          />
          <TextInput
            label="Admin email"
            type="email"
            placeholder="founder@nexylomedia.com"
            required
          />
          <Select label="Plan">
            <option value="starter">Starter (up to 3 seats)</option>
            <option value="growth" defaultChecked>
              Growth (recommended)
            </option>
            <option value="enterprise">Enterprise</option>
          </Select>
        </div>
      </Modal>
    </AppShell>
  );
};

export default ComponentLibraryPage;


