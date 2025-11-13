import clsx from "clsx";
import type { FC, SelectHTMLAttributes } from "react";
import { FiChevronDown } from "react-icons/fi";

export type SelectProps = {
  label?: string;
  hint?: string;
  error?: string;
} & SelectHTMLAttributes<HTMLSelectElement>;

export const Select: FC<SelectProps> = ({
  label,
  hint,
  error,
  className,
  children,
  id,
  ...props
}) => {
  const selectId = id ?? props.name ?? undefined;
  return (
    <label className="flex flex-col gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
      {label && <span>{label}</span>}
      <div className="relative">
        <select
          id={selectId}
          className={clsx(
            "w-full appearance-none rounded-xl border border-border bg-bg px-4 py-2.5 text-sm text-slate-800 transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100",
            error ? "border-danger focus:ring-danger/40" : "",
            className,
          )}
          aria-invalid={Boolean(error)}
          aria-describedby={
            error ? `${selectId}-error` : hint ? `${selectId}-hint` : undefined
          }
          {...props}
        >
          {children}
        </select>
        <FiChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted dark:text-slate-500" />
      </div>
      {hint && !error && (
        <span
          id={selectId ? `${selectId}-hint` : undefined}
          className="text-xs text-muted dark:text-slate-400"
        >
          {hint}
        </span>
      )}
      {error && (
        <span
          id={selectId ? `${selectId}-error` : undefined}
          className="text-xs font-semibold text-danger"
        >
          {error}
        </span>
      )}
    </label>
  );
};

export default Select;


