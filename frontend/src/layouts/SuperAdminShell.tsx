import { useState } from "react";
import clsx from "clsx";
import Topbar from "../components/layout/Topbar";
import Breadcrumbs, {
  type Breadcrumb,
} from "../components/layout/Breadcrumbs";
import AppFooter from "../components/layout/AppFooter";
import Button from "../components/ui/Button";
import { FiPlus, FiShield, FiUsers } from "react-icons/fi";

type SuperAdminShellProps = {
  breadcrumbs?: Breadcrumb[];
  title: string;
  description?: string;
  rightAccessory?: React.ReactNode;
  children: React.ReactNode;
  onNavigate?: (route: string) => void;
  activeRoute?: string;
};

const navItems = [
  { label: "Overview", icon: <FiShield />, route: "super-admin-dashboard" },
  { label: "Tenants", icon: <FiUsers />, route: "super-admin-tenants" },
  { label: "Billing", icon: <FiPlus />, route: "super-admin-billing" },
  { label: "Feature Flags", icon: <FiShield />, route: "super-admin-flags" },
  { label: "Audit Logs", icon: <FiShield />, route: "super-admin-logs" },
  { label: "Integrations", icon: <FiShield />, route: "super-admin-integrations" },
];

export const SuperAdminShell = ({
  breadcrumbs = [{ label: "Super Admin" }],
  title,
  description,
  rightAccessory,
  children,
  onNavigate,
  activeRoute,
}: SuperAdminShellProps) => {
  const [internalRoute, setInternalRoute] = useState(navItems[0].route);
  const currentRoute = activeRoute ?? internalRoute;

  return (
    <div className="flex min-h-screen bg-bg text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <aside className="hidden w-72 border-r border-border bg-bg-surface dark:border-slate-800 dark:bg-slate-900 lg:flex lg:flex-col">
        <div className="flex h-16 items-center gap-3 border-b border-border px-4 dark:border-slate-800">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white font-semibold">
            NX
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Nexylomedia Control
            </p>
            <p className="text-xs text-muted dark:text-slate-400">
              Platform admin surface
            </p>
          </div>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-6 text-sm font-medium text-muted dark:text-slate-400">
          {navItems.map((item) => {
            const isActive = item.route === currentRoute;
            return (
            <button
              key={item.route}
              type="button"
              className={clsx(
                "group flex w-full items-center gap-3 rounded-xl border border-transparent px-3 py-2 transition",
                isActive
                  ? "bg-primary text-primary-foreground shadow-subtle"
                  : "hover:border-primary/30 hover:bg-primary/5 hover:text-primary dark:hover:border-primary/40 dark:hover:bg-primary/10",
              )}
              onClick={() => {
                setInternalRoute(item.route);
                onNavigate?.(item.route);
              }}
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-lg text-primary group-hover:bg-primary/20 group-hover:text-primary-light dark:bg-primary/20">
                {item.icon}
              </span>
              <span className="flex-1 text-left text-slate-700 dark:text-slate-200">
                {item.label}
              </span>
            </button>
          );
          })}
        </nav>
        <div className="border-t border-border px-4 py-4 dark:border-slate-800">
          <Button variant="outline" className="w-full" size="sm">
            Create tenant
          </Button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col lg:pl-0">
        <Topbar role="super_admin" onNavigate={onNavigate} />
        <div className="bg-primary text-primary-foreground px-4 py-2 text-xs font-medium text-center dark:bg-primary-dark">
          Super Admin mode — monitor tenants, billing, feature flags, and platform health
        </div>
        <main className="flex-1 px-4 pb-16 pt-8 sm:px-6 lg:px-10">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
            <Breadcrumbs items={breadcrumbs} />
            <header className="flex flex-col gap-4 border-b border-border pb-6 lg:flex-row lg:items-center lg:justify-between dark:border-slate-800">
              <div>
                <h1 className="text-h2 text-slate-900 dark:text-slate-100">{title}</h1>
                {description && (
                  <p className="mt-2 max-w-3xl text-sm text-muted dark:text-slate-400">
                    {description}
                  </p>
                )}
              </div>
              {rightAccessory ?? (
                <Button variant="ghost" size="sm">
                  Export report
                </Button>
              )}
            </header>

            <div className="space-y-10">{children}</div>
          </div>
        </main>
        <AppFooter />
      </div>
    </div>
  );
};

export default SuperAdminShell;


