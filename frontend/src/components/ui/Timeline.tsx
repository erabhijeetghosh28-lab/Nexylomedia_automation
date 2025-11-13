import type { FC } from "react";

type TimelineItem = {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  status?: "success" | "warning" | "danger" | "info";
};

type TimelineProps = {
  items: TimelineItem[];
};

const statusColor: Record<
  NonNullable<TimelineItem["status"]>,
  { dot: string; line: string }
> = {
  success: { dot: "bg-success", line: "bg-success/40" },
  warning: { dot: "bg-warning", line: "bg-warning/40" },
  danger: { dot: "bg-danger", line: "bg-danger/40" },
  info: { dot: "bg-info", line: "bg-info/40" },
};

export const Timeline: FC<TimelineProps> = ({ items }) => {
  return (
    <ol className="relative space-y-6 border-l border-border pl-6">
      {items.map((item, index) => {
        const colors =
          (item.status && statusColor[item.status]) ??
          statusColor.success ?? { dot: "bg-primary", line: "bg-primary/30" };

        return (
          <li key={item.id} className="relative">
            <span
              className={`absolute -left-[11px] flex h-5 w-5 items-center justify-center rounded-full border border-white shadow ${item.status ? colors.dot : "bg-primary"} dark:border-slate-900`}
            >
              <span className="sr-only">{item.status ?? "activity"}</span>
            </span>
            {index !== items.length - 1 && (
              <span
                className={`absolute left-[-1px] top-4 h-full w-0.5 ${item.status ? colors.line : "bg-primary/30"}`}
                aria-hidden="true"
              />
            )}
            <div className="flex flex-col gap-1 rounded-xl bg-bg px-4 py-3 dark:bg-slate-800 dark:border dark:border-slate-700">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {item.title}
                </p>
                <span className="text-xs font-medium uppercase tracking-wide text-muted dark:text-slate-400">
                  {item.timestamp}
                </span>
              </div>
              <p className="text-xs text-muted dark:text-slate-400">
                {item.description}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
};

export default Timeline;


