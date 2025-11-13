import clsx from "clsx";
import type { FC, ReactNode } from "react";

export type TabItem = {
  key: string;
  label: string;
  description?: string;
  icon?: ReactNode;
};

type TabsProps = {
  items: TabItem[];
  activeKey: string;
  onChange?: (key: string) => void;
  size?: "sm" | "md";
};

export const Tabs: FC<TabsProps> = ({
  items,
  activeKey,
  onChange,
  size = "md",
}) => {
  return (
    <div
      role="tablist"
      className={clsx(
        "inline-flex rounded-full border border-border bg-bg p-1 dark:border-slate-700 dark:bg-slate-900",
        size === "sm" ? "gap-1" : "gap-2",
      )}
    >
      {items.map((item) => {
        const isActive = item.key === activeKey;
        return (
          <button
            key={item.key}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={clsx(
              "flex items-center justify-center gap-2 rounded-full px-3 font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 dark:text-slate-300",
              size === "sm" ? "h-8 text-xs" : "h-10 text-sm",
              isActive
                ? "bg-primary text-primary-foreground shadow-subtle"
                : "text-muted hover:bg-primary/10 dark:text-slate-400 dark:hover:bg-slate-800",
            )}
            onClick={() => onChange?.(item.key)}
          >
            {item.icon ? <span className="text-base">{item.icon}</span> : null}
            <span>{item.label}</span>
            {item.description ? (
              <span className="hidden text-xs text-primary-foreground/80 md:inline">
                {item.description}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
};

export default Tabs;


