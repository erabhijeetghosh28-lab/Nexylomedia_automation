import {
  FiCompass,
  FiHome,
  FiList,
  FiPlayCircle,
  FiZap,
} from "react-icons/fi";
import clsx from "clsx";
import type { FC } from "react";

type MemberSidebarProps = {
  collapsed?: boolean;
  activeRoute?: string;
  onNavigate?: (route: string) => void;
};

const memberNav = [
  { label: "My Home", route: "member-dashboard", icon: <FiHome /> },
  { label: "Tasks & Activity", route: "member-tasks", icon: <FiList /> },
  { label: "Insights", route: "member-insights", icon: <FiCompass /> },
  { label: "Automation Center", route: "member-automations", icon: <FiZap /> },
  { label: "Playbooks", route: "library", icon: <FiPlayCircle /> },
];

export const MemberSidebar: FC<MemberSidebarProps> = ({
  collapsed = false,
  activeRoute,
  onNavigate,
}) => {
  return (
    <aside
      className={clsx(
        "fixed inset-y-0 left-0 z-40 flex h-full flex-col border-r border-border bg-bg-surface transition-all duration-200 lg:static dark:border-slate-800 dark:bg-slate-900",
        collapsed ? "w-20" : "w-64",
      )}
    >
      <div className="flex h-16 items-center gap-3 border-b border-border px-4 dark:border-slate-800">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-lg font-semibold text-primary dark:bg-primary/20">
          NX
        </div>
        {!collapsed && (
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Nexylomedia Workspace
            </p>
            <p className="text-xs text-muted dark:text-slate-400">
              Personal productivity hub
            </p>
          </div>
        )}
      </div>
      <nav className="flex-1 space-y-1 px-3 py-6">
        {memberNav.map((item) => {
          const active = item.route === activeRoute;
          return (
            <button
              key={item.route}
              type="button"
              className={clsx(
                "group flex w-full items-center gap-3 rounded-xl border border-transparent px-3 py-2 text-sm font-medium transition",
                active
                  ? "bg-primary text-primary-foreground shadow-subtle"
                  : "text-muted hover:border-primary/30 hover:bg-primary/10 hover:text-primary dark:text-slate-400 dark:hover:bg-primary/20",
              )}
              onClick={() => onNavigate?.(item.route)}
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-lg text-primary group-hover:bg-primary/20 group-hover:text-primary-light dark:bg-primary/20">
                {item.icon}
              </span>
              {!collapsed && <span className="flex-1 text-left">{item.label}</span>}
            </button>
          );
        })}
      </nav>
      <div className="border-t border-dashed border-border px-4 py-4 text-xs text-muted dark:border-slate-800 dark:text-slate-400">
        {!collapsed ? (
          <div className="rounded-2xl border border-border bg-bg p-4 dark:border-slate-700 dark:bg-slate-800">
            <p className="font-semibold text-slate-900 dark:text-slate-100">
              Daily focus tip
            </p>
            <p className="mt-2">
              Automate one repetitive task today to reclaim more creative time.
            </p>
          </div>
        ) : (
          <div className="flex h-10 items-center justify-center rounded-lg border border-border bg-bg text-xs text-muted dark:border-slate-700 dark:bg-slate-800">
            Tip
          </div>
        )}
      </div>
    </aside>
  );
};

export default MemberSidebar;

