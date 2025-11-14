import type { PropsWithChildren } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Button from "../components/ui/Button";

type DashboardLayoutProps = PropsWithChildren<{
  onLogout?: () => void;
}>;

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { auth, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <header className="border-b border-border bg-bg/80 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/projects" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white shadow-inner">
              NM
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary dark:text-primary-light">
                Nexylomedia
              </p>
              <p className="text-xs text-muted dark:text-slate-400">
                Automation workspace
              </p>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <div className="text-right text-xs text-muted dark:text-slate-400">
              <p className="font-semibold text-slate-900 dark:text-white">
                {auth?.user.email}
              </p>
              <p className="uppercase tracking-wide">{auth?.role ?? "member"}</p>
            </div>
            <Button variant="outline" size="sm" onClick={logout}>
              Sign out
            </Button>
          </div>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
};

export default DashboardLayout;


