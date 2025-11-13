import clsx from "clsx";
import type { FC } from "react";

type ToggleProps = {
  checked: boolean;
  label?: string;
  description?: string;
  onChange?: (checked: boolean) => void;
};

export const Toggle: FC<ToggleProps> = ({
  checked,
  label,
  description,
  onChange,
}) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange?.(!checked)}
      className="flex w-full items-center justify-between gap-3 rounded-2xl border border-border bg-bg px-4 py-3 text-left transition hover:border-primary/40 dark:border-slate-700 dark:bg-slate-900"
    >
      <div>
        {label && (
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            {label}
          </p>
        )}
        {description && (
          <p className="text-xs text-muted dark:text-slate-400">{description}</p>
        )}
      </div>
      <span
        className={clsx(
          "relative inline-flex h-6 w-11 items-center rounded-full transition",
          checked ? "bg-primary" : "bg-muted/30 dark:bg-slate-700",
        )}
      >
        <span
          className={clsx(
            "inline-block h-5 w-5 rounded-full bg-white shadow transition dark:bg-slate-200",
            checked ? "translate-x-5" : "translate-x-1",
          )}
        />
      </span>
    </button>
  );
};

export default Toggle;


