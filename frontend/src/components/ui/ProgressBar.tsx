import clsx from "clsx";
import type { FC } from "react";

type ProgressBarProps = {
  label: string;
  value: number;
  max?: number;
  color?: "primary" | "success" | "warning" | "danger";
  helper?: string;
};

export const ProgressBar: FC<ProgressBarProps> = ({
  label,
  value,
  max = 100,
  color = "primary",
  helper,
}) => {
  const percentage = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-200">
        <span>{label}</span>
        <span>{percentage}%</span>
      </div>
      <div className="h-2 rounded-full bg-muted/30 dark:bg-slate-700/60">
        <div
          className={clsx(
            "h-2 rounded-full transition-all",
            color === "primary" && "bg-primary",
            color === "success" && "bg-success",
            color === "warning" && "bg-warning",
            color === "danger" && "bg-danger",
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {helper && <p className="text-xs text-muted dark:text-slate-400">{helper}</p>}
    </div>
  );
};

export default ProgressBar;


