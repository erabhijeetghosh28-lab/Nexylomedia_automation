import {
  FiBell,
  FiChevronDown,
  FiMenu,
  FiMoon,
  FiSearch,
  FiSun,
} from "react-icons/fi";
import type { FC } from "react";
import { useTheme } from "../../contexts/ThemeContext";

type TopbarProps = {
  onSidebarToggle?: () => void;
};

const mockOrgs = [
  { id: "nexylo", name: "Nexylomedia HQ" },
  { id: "acme", name: "Acme Retail" },
  { id: "luna", name: "Luna Cosmetics" },
];

export const Topbar: FC<TopbarProps> = ({ onSidebarToggle }) => {
  const { theme, toggleTheme } = useTheme();

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
            <span className="inline-block h-2 w-2 rounded-full bg-success" />
            <span>Super Admin</span>
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
          <div className="hidden md:flex items-center gap-4">
            <div className="group relative">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-bg px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:border-primary/40 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:text-primary"
              >
                <span className="inline-flex h-2 w-2 rounded-full bg-secondary" />
                <span>{mockOrgs[0].name}</span>
                <FiChevronDown />
              </button>
            </div>
          </div>

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
    </header>
  );
};

export default Topbar;


