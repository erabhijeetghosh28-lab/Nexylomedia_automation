import { useState } from "react";
import type { PropsWithChildren } from "react";
import clsx from "clsx";
import Topbar from "../components/layout/Topbar";
import MemberSidebar from "../components/layout/MemberSidebar";
import Breadcrumbs, {
  type Breadcrumb,
} from "../components/layout/Breadcrumbs";
import AppFooter from "../components/layout/AppFooter";

type MemberShellProps = PropsWithChildren<{
  breadcrumbs?: Breadcrumb[];
  title: string;
  description?: string;
  rightAccessory?: React.ReactNode;
  onNavigate?: (route: string) => void;
  activeRoute?: string;
}>;

export const MemberShell = ({
  breadcrumbs = [{ label: "My workspace" }],
  title,
  description,
  rightAccessory,
  children,
  onNavigate,
  activeRoute,
}: MemberShellProps) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-bg text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <MemberSidebar
        collapsed={sidebarCollapsed}
        activeRoute={activeRoute}
        onNavigate={onNavigate}
      />
      <div
        className={clsx(
          "flex flex-1 flex-col transition-[padding] duration-200",
          sidebarCollapsed ? "lg:pl-20" : "lg:pl-64",
        )}
      >
        <Topbar
          onSidebarToggle={() => setSidebarCollapsed((prev) => !prev)}
          role="member"
          onNavigate={onNavigate}
        />
        <div className="bg-secondary text-secondary-foreground px-4 py-2 text-xs text-center font-medium dark:bg-secondary-dark">
          Member workspace — focus mode, personal automations, and insights
        </div>
        <main className="flex-1 px-4 pb-16 pt-8 sm:px-6 lg:px-12">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
            <Breadcrumbs items={breadcrumbs} />
            <header className="flex flex-col gap-4 border-b border-border pb-6 lg:flex-row lg:items-center lg:justify-between dark:border-slate-800">
              <div>
                <h1 className="text-h3 text-slate-900 dark:text-slate-100">{title}</h1>
                {description && (
                  <p className="mt-2 max-w-3xl text-sm text-muted dark:text-slate-400">
                    {description}
                  </p>
                )}
              </div>
              {rightAccessory ?? (
                <div className="rounded-full border border-border bg-bg px-4 py-2 text-xs text-muted dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                  Synced {new Date().toLocaleTimeString()}
                </div>
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

export default MemberShell;

