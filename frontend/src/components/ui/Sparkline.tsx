import type { FC } from "react";

type SparklineVariant = "primary" | "success" | "danger" | "warning";

type SparklineProps = {
  values: number[];
  variant?: SparklineVariant;
};

const fillMap: Record<SparklineVariant, { start: string; end: string; stroke: string }> = {
  primary: {
    start: "rgba(79, 70, 229, 0.6)",
    end: "rgba(79, 70, 229, 0.05)",
    stroke: "var(--color-primary)",
  },
  success: {
    start: "rgba(16, 185, 129, 0.6)",
    end: "rgba(16, 185, 129, 0.05)",
    stroke: "var(--color-success)",
  },
  danger: {
    start: "rgba(239, 68, 68, 0.6)",
    end: "rgba(239, 68, 68, 0.05)",
    stroke: "var(--color-danger)",
  },
  warning: {
    start: "rgba(245, 158, 11, 0.6)",
    end: "rgba(245, 158, 11, 0.05)",
    stroke: "var(--color-warning)",
  },
};

export const Sparkline: FC<SparklineProps> = ({ values, variant = "primary" }) => {
  const max = Math.max(...values, 100);
  const gradientId = `sparkline-gradient-${variant}`;
  const colors = fillMap[variant];

  return (
    <svg viewBox="0 0 100 32" className="h-12 w-full text-current">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={colors.start} />
          <stop offset="100%" stopColor={colors.end} />
        </linearGradient>
      </defs>
      <polyline
        points={values
          .map((value, index) => `${(index / (values.length - 1)) * 100},${32 - (value / max) * 32}`)
          .join(" ")}
        fill={`url(#${gradientId})`}
        stroke="none"
      />
      <polyline
        points={values
          .map((value, index) => `${(index / (values.length - 1)) * 100},${32 - (value / max) * 32}`)
          .join(" ")}
        fill="none"
        stroke={colors.stroke}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Sparkline;


