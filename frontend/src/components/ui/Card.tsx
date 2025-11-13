import clsx from "clsx";
import type { FC, PropsWithChildren, ReactNode } from "react";

type CardProps = PropsWithChildren<{
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  padded?: boolean;
  className?: string;
}>;

export const Card: FC<CardProps> = ({
  title,
  subtitle,
  action,
  padded = true,
  className,
  children,
}) => {
  return (
    <section
      className={clsx(
        "rounded-2xl border border-border bg-bg-surface shadow-subtle dark:border-slate-800 dark:bg-slate-900",
        className,
      )}
    >
      {(title || subtitle || action) && (
        <header className="flex items-start justify-between gap-4 border-b border-border px-6 py-5 dark:border-slate-800">
          <div>
            {title && (
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="mt-1 text-sm text-muted dark:text-slate-400">
                {subtitle}
              </p>
            )}
          </div>
          {action}
        </header>
      )}
      <div className={clsx(padded ? "px-6 py-6" : "")}>{children}</div>
    </section>
  );
};

export default Card;


