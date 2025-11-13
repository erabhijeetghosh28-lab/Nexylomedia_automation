import clsx from "clsx";
import type { ButtonHTMLAttributes, FC, PropsWithChildren } from "react";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "outline"
  | "danger"
  | "success";

type ButtonSize = "sm" | "md" | "lg";

export type ButtonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
} & ButtonHTMLAttributes<HTMLButtonElement>;

const variantClass: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-primary-foreground hover:bg-primary-dark focus-visible:ring-primary/60",
  secondary:
    "bg-secondary text-secondary-foreground hover:bg-secondary-dark focus-visible:ring-secondary/60",
  ghost:
    "bg-transparent text-slate-700 hover:bg-primary/10 focus-visible:ring-primary/40 dark:text-slate-200 dark:hover:bg-slate-800/60",
  outline:
    "border border-border bg-bg text-slate-700 hover:border-primary/50 hover:text-primary focus-visible:ring-primary/40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-primary/60 dark:hover:text-primary",
  danger:
    "bg-danger text-white hover:bg-danger/90 focus-visible:ring-danger/60",
  success:
    "bg-success text-white hover:bg-success/90 focus-visible:ring-success/60",
};

const sizeClass: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-10 px-5 text-sm",
  lg: "h-12 px-6 text-base",
};

export const Button: FC<PropsWithChildren<ButtonProps>> = ({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  icon,
  iconPosition = "left",
  className,
  ...props
}) => {
  const isDisabled = disabled || loading;
  return (
    <button
      type="button"
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:focus-visible:ring-offset-slate-900",
        variantClass[variant],
        sizeClass[size],
        className,
      )}
      disabled={isDisabled}
      {...props}
    >
      {icon && iconPosition === "left" ? (
        <span className="text-lg">{icon}</span>
      ) : null}
      <span>{loading ? "Loading…" : children}</span>
      {icon && iconPosition === "right" ? (
        <span className="text-lg">{icon}</span>
      ) : null}
    </button>
  );
};

export default Button;


