import {
  FiBell,
  FiChevronDown,
  FiLogOut,
  FiMenu,
  FiMoon,
  FiSearch,
  FiSun,
} from "react-icons/fi";
import { useState, useMemo } from "react";
import type { FC } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";
import clsx from "clsx";

type TopbarProps = {
  onSidebarToggle?: () => void;
  role?: "super_admin" | "org_admin" | "member";
  onNavigate?: (route: string) => void;
};

export const Topbar: FC<TopbarProps> = ({ onSidebarToggle, role = "org_admin", onNavigate }) => {
  const { theme, toggleTheme } = useTheme();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setMenuOpen(false);
  };

  const menuSections = useMemo(() => {
    const sections: Array<{ title: string; items: Array<{ label: string; route: string }> }> = [];

    if (role === "super_admin") {
      sections.push({
        title: "Super Admin",
        items: [
          { label: "Control center", route: "/admin" },
          { label: "Tenants", route: "/admin/tenants" },
          { label: "Plans & billing", route: "/admin/plans" },
          { label: "Billing analytics", route: "/admin/billing" },
        ],
      });

      sections.push({
        title: "Switch workspaces",
        items: [
          { label: "Org admin workspace", route: "/projects" },
          { label: "Member view", route: "/projects" },
        ],
      });
    } else if (role === "org_admin") {
      sections.push({
        title: "Org Admin",
        items: [
          { label: "Org dashboard", route: "/projects" },
          { label: "Team & users", route: "/projects" },
          { label: "Org settings", route: "/projects" },
          { label: "Integrations", route: "/projects" },
          { label: "Usage & quotas", route: "/projects" },
        ],
      });
    } else {
      sections.push({
        title: "Workspace",
        items: [
          { label: "My workspace", route: "/projects" },
          { label: "Tasks & activity", route: "/projects" },
          { label: "Insights", route: "/projects" },
        ],
      });
    }

    return sections;
  }, [role]);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg-surface/95 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
      <div className="flex h-16 w-full items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onSidebarToggle}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-bg text-slate-700 transition hover:border-primary/40 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:text-primary lg:hidden"
            aria-label="Toggle navigation"
          >
            <FiMenu className="text-lg" />
          </button>

          <div className="hidden sm:flex items-center gap-2 rounded-xl border border-border bg-bg px-3 py-1.5 text-sm font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
            <span
              className={clsx(
                "inline-block h-2 w-2 rounded-full",
                role === "super_admin" ? "bg-success" : role === "member" ? "bg-info" : "bg-secondary",
              )}
            />
            <span>
              {role === "super_admin"
                ? "Super Admin"
                : role === "org_admin"
                  ? "Org Admin"
                  : "Workspace"}
            </span>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center px-2 sm:px-6">
          <div className="relative w-full max-w-xl">
            <FiSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              type="search"
              placeholder="Search pages, tenants, leads..."
              className="w-full rounded-full border border-border bg-bg px-10 py-2 text-sm text-slate-700 placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-bg transition hover:border-primary/40 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <FiSun className="text-lg" /> : <FiMoon className="text-lg" />}
          </button>

          <button
            type="button"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-bg transition hover:border-primary/40 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            aria-label="Notifications"
          >
            <FiBell className="text-lg" />
            <span className="absolute -right-0.5 -top-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-danger text-[10px] font-semibold text-white">
              4
            </span>
          </button>

          <button
            type="button"
            className="flex items-center gap-3 rounded-xl border border-border bg-bg px-2 py-1.5 text-left transition hover:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/60 dark:border-slate-700 dark:bg-slate-900"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-lg font-semibold text-primary dark:bg-primary/20">
              AG
            </div>
            <div className="hidden text-xs sm:block">
              <p className="font-semibold text-slate-900 dark:text-slate-100">Abhijeet Ghosh</p>
              <p className="text-muted dark:text-slate-400">Super Admin</p>
            </div>
            <FiChevronDown className="hidden text-muted dark:text-slate-400 sm:block" />
          </button>
        </div>
      </div>
      {menuOpen && (
        <div className="absolute right-6 top-16 z-50 max-h-[70vh] w-72 overflow-y-auto rounded-2xl border border-border bg-bg shadow-subtle dark:border-slate-700 dark:bg-slate-900">
          {menuSections.map((section) => (
            <div key={section.title} className="px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted dark:text-slate-500">
                {section.title}
              </p>
              <div className="mt-2 space-y-1">
                {section.items.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm text-slate-700 transition hover:bg-primary/10 hover:text-primary dark:text-slate-200 dark:hover:bg-slate-800"
                    onClick={() => {
                      setMenuOpen(false);
                      if (onNavigate) {
                        onNavigate(item.route);
                      } else if (item.route.startsWith("/")) {
                        window.location.assign(item.route);
                      }
                    }}
                  >
                    <span>{item.label}</span>
                    <FiChevronDown className="rotate-[-90deg] text-xs text-muted dark:text-slate-400" />
                  </button>
                ))}
              </div>
            </div>
          ))}
          <div className="border-t border-border px-4 py-3 dark:border-slate-800">
            <button
              type="button"
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-danger transition hover:bg-danger/10 hover:text-danger dark:text-slate-400 dark:hover:bg-slate-800"
              onClick={handleLogout}
            >
              <FiLogOut className="text-base" />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Topbar;


