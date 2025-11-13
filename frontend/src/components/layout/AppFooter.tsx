import type { FC } from "react";

export const AppFooter: FC = () => {
  return (
    <footer className="border-t border-border bg-bg-surface px-6 py-6 text-xs text-muted dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <p className="text-slate-600 dark:text-slate-300">
          © {new Date().getFullYear()} Nexylomedia Automation. All rights
          reserved.
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <a href="#" className="hover:text-primary">
            Status
          </a>
          <a href="#" className="hover:text-primary">
            Privacy
          </a>
          <a href="#" className="hover:text-primary">
            Terms
          </a>
          <a href="#" className="hover:text-primary">
            Support
          </a>
        </div>
      </div>
    </footer>
  );
};

export default AppFooter;


