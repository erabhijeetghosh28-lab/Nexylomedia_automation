import { useState } from "react";
import type { PropsWithChildren } from "react";
import clsx from "clsx";
import Topbar from "../components/layout/Topbar";
import Sidebar from "../components/layout/Sidebar";
import Breadcrumbs, {
  type Breadcrumb,
} from "../components/layout/Breadcrumbs";
import AppFooter from "../components/layout/AppFooter";

type AppShellProps = PropsWithChildren<{
  breadcrumbs?: Breadcrumb[];
  title?: string;
  description?: string;
  rightAccessory?: React.ReactNode;
}>;

export const AppShell = ({
  children,
  breadcrumbs = [
    { label: "Home", href: "#" },
    { label: "Component Library" },
  ],
  title = "Component Library",
  description = "Design tokens, typographic scale, and reusable UI primitives available across the Nexylomedia Automation platform.",
  rightAccessory,
}: AppShellProps) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-bg text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <Sidebar collapsed={sidebarCollapsed} />
      <div
        className={clsx(
          "flex flex-1 flex-col transition-[padding] duration-200",
          sidebarCollapsed ? "lg:pl-20" : "lg:pl-72",
        )}
      >
        <Topbar
          onSidebarToggle={() => setSidebarCollapsed((prev) => !prev)}
        />
        <div className="bg-primary text-primary-foreground px-4 py-2 text-xs font-medium text-center dark:bg-primary-dark">
          Demo mode — mock data & interactive states for design review
        </div>

        <main className="flex-1 px-4 pb-16 pt-8 sm:px-6 lg:px-10">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
            <Breadcrumbs items={breadcrumbs} />
            <header className="flex flex-col gap-4 border-b border-border pb-6 lg:flex-row lg:items-center lg:justify-between dark:border-slate-800">
              <div>
                <h1 className="text-h2 text-slate-900 dark:text-slate-100">{title}</h1>
                <p className="mt-2 max-w-3xl text-sm text-muted dark:text-slate-400">
                  {description}
                </p>
              </div>
              {rightAccessory ?? (
                <div className="rounded-full border border-border bg-bg px-4 py-2 text-xs text-muted dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                  Last updated: {new Date().toLocaleDateString()}
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

export default AppShell;
