import clsx from "clsx";
import type { FC, InputHTMLAttributes } from "react";

export type TextInputProps = {
  label?: string;
  hint?: string;
  error?: string;
  icon?: React.ReactNode;
} & InputHTMLAttributes<HTMLInputElement>;

export const TextInput: FC<TextInputProps> = ({
  label,
  hint,
  error,
  icon,
  className,
  id,
  ...props
}) => {
  const inputId = id ?? props.name ?? undefined;
  return (
    <label className="flex flex-col gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
      {label && <span>{label}</span>}
      <div className="relative">
        {icon ? (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted">
            {icon}
          </span>
        ) : null}
        <input
          id={inputId}
          className={clsx(
            "w-full rounded-xl border border-border bg-bg px-4 py-2.5 text-sm text-slate-800 transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500",
            icon ? "pl-10" : "",
            error ? "border-danger focus:border-danger focus:ring-danger/40" : "",
            className,
          )}
          aria-invalid={Boolean(error)}
          aria-describedby={
            error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
          }
          {...props}
        />
      </div>
      {hint && !error ? (
        <span
          id={inputId ? `${inputId}-hint` : undefined}
          className="text-xs text-muted dark:text-slate-400"
        >
          {hint}
        </span>
      ) : null}
      {error ? (
        <span
          id={inputId ? `${inputId}-error` : undefined}
          className="text-xs font-semibold text-danger"
        >
          {error}
        </span>
      ) : null}
    </label>
  );
};

export default TextInput;


