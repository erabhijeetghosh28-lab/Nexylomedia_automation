import clsx from "clsx";
import type { FC, PropsWithChildren } from "react";

export type BadgeVariant =
  | "default"
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "danger"
  | "info";

type BadgeProps = PropsWithChildren<{
  variant?: BadgeVariant;
  dot?: boolean;
  className?: string;
}>;

const badgeStyles: Record<BadgeVariant, string> = {
  default: "bg-muted/20 text-muted dark:bg-slate-800 dark:text-slate-300",
  primary: "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-light",
  secondary: "bg-secondary/10 text-secondary dark:bg-secondary/20",
  success: "bg-success/10 text-success dark:bg-success/20 dark:text-success",
  warning: "bg-warning/10 text-warning dark:bg-warning/20 dark:text-warning",
  danger: "bg-danger/10 text-danger dark:bg-danger/20 dark:text-danger",
  info: "bg-info/10 text-info dark:bg-info/20 dark:text-info",
};

export const Badge: FC<BadgeProps> = ({
  children,
  variant = "default",
  dot = false,
  className,
}) => (
  <span
    className={clsx(
      "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
      badgeStyles[variant],
      className,
    )}
  >
    {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
    {children}
  </span>
);

export default Badge;


