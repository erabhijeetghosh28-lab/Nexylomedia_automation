import clsx from "clsx";
import type { FC, ReactNode } from "react";

type KpiCardProps = {
  title: string;
  description?: string;
  value: string;
  change?: string;
  trend?: "up" | "down" | "steady";
  icon?: ReactNode;
  className?: string;
  sparkline?: ReactNode;
};

export const KpiCard: FC<KpiCardProps> = ({
  title,
  description,
  value,
  change,
  trend = "steady",
  icon,
  className,
  sparkline,
}) => {
  return (
    <article
      className={clsx(
        "group relative overflow-hidden rounded-2xl border border-border bg-bg p-5 shadow-subtle transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-medium dark:border-slate-800 dark:bg-slate-900",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="w-full">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted dark:text-slate-400">
            {title}
          </p>
          {description && (
            <p className="text-xs text-muted dark:text-slate-500">{description}</p>
          )}
        </div>
        {icon ? (
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-xl text-primary dark:bg-primary/20">
            {icon}
          </div>
        ) : null}
      </div>
      <div className="mt-4 flex items-center justify-between gap-3">
        <p className="text-3xl font-semibold text-slate-900 dark:text-slate-100">
          {value}
        </p>
        {change && (
          <span
            className={clsx(
              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold",
              trend === "up"
                ? "bg-success/10 text-success dark:bg-success/20"
                : trend === "down"
                  ? "bg-danger/10 text-danger dark:bg-danger/20"
                  : "bg-muted/20 text-muted dark:bg-slate-800 dark:text-slate-300",
            )}
          >
            {trend === "up" && "▲"}
            {trend === "down" && "▼"}
            {trend === "steady" && "■"}
            {change}
          </span>
        )}
      </div>
      {sparkline ? (
        <div className="mt-4 rounded-xl bg-bg-surface p-2 dark:bg-slate-800">
          {sparkline}
        </div>
      ) : null}
    </article>
  );
};

export default KpiCard;


