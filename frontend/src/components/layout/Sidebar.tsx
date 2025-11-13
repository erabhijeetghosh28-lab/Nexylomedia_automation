import {
  FiActivity,
  FiBarChart2,
  FiFileText,
  FiFlag,
  FiHome,
  FiLayers,
  FiRepeat,
  FiSettings,
  FiUsers,
} from "react-icons/fi";
import clsx from "clsx";
import type { FC } from "react";

type NavItem = {
  label: string;
  icon: JSX.Element;
  badge?: string;
  active?: boolean;
};

type SidebarProps = {
  collapsed?: boolean;
};

const navItems: NavItem[] = [
  { label: "Overview", icon: <FiHome />, active: true },
  { label: "Tenants", icon: <FiUsers />, badge: "12" },
  { label: "Billing", icon: <FiFileText /> },
  { label: "Feature Flags", icon: <FiFlag /> },
  { label: "Automations", icon: <FiRepeat /> },
  { label: "Analytics", icon: <FiBarChart2 /> },
  { label: "System Health", icon: <FiActivity />, badge: "2" },
  { label: "Integrations", icon: <FiLayers /> },
  { label: "Settings", icon: <FiSettings /> },
];

export const Sidebar: FC<SidebarProps> = ({ collapsed = false }) => {
  return (
    <aside
      className={clsx(
        "fixed inset-y-0 left-0 z-40 flex h-full flex-col border-r border-border bg-bg-surface transition-all duration-200 dark:border-slate-800 dark:bg-slate-900 lg:static",
        collapsed ? "w-20" : "w-72",
      )}
    >
      <div className="flex h-16 items-center gap-3 border-b border-border px-4 dark:border-slate-800">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white font-semibold">
          NX
        </div>
        {!collapsed && (
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Nexylomedia Control
            </p>
            <p className="text-xs text-muted dark:text-slate-400">
              Platform admin surface
            </p>
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-6 scrollbar-thin">
        <div className="space-y-1 text-sm font-medium text-muted dark:text-slate-400">
          {navItems.map((item) => (
            <button
              key={item.label}
              type="button"
              className={clsx(
                "group flex w-full items-center gap-3 rounded-xl border border-transparent px-3 py-2 transition",
                item.active
                  ? "bg-primary text-primary-foreground shadow-subtle"
                  : "hover:border-primary/30 hover:bg-primary/5 hover:text-primary dark:hover:border-primary/50 dark:hover:bg-primary/10",
              )}
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-lg text-primary group-hover:bg-primary/20 group-hover:text-primary-light dark:bg-primary/20">
                {item.icon}
              </span>
              {!collapsed && (
                <>
                  <span className="flex-1 text-left text-slate-700 dark:text-slate-200">
                    {item.label}
                  </span>
                  {item.badge && (
                    <span className="inline-flex h-6 min-w-[1.5rem] items-center justify-center rounded-full bg-bg px-2 text-xs font-semibold text-primary shadow-inner dark:bg-slate-800 dark:text-primary-light">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </button>
          ))}
        </div>
      </nav>

      <div className="border-t border-border p-4 dark:border-slate-800">
        <div className="rounded-xl border border-dashed border-border bg-bg p-4 dark:border-slate-700 dark:bg-slate-900">
          {!collapsed ? (
            <>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted dark:text-slate-400">
                System Status
              </p>
              <div className="mt-2 flex items-center justify-between text-sm">
                <span className="text-slate-900 dark:text-slate-200">Uptime</span>
                <span className="font-semibold text-success">99.98%</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-sm">
                <span className="text-slate-900 dark:text-slate-200">Incidents</span>
                <span className="font-semibold text-danger">1 active</span>
              </div>
            </>
          ) : (
            <div className="flex h-10 w-full items-center justify-center rounded-lg bg-primary/10 text-primary">
              <FiActivity />
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;


