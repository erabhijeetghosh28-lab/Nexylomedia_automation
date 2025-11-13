import type { FC } from "react";

type SparklineProps = {
  values: number[];
  variant?: "primary" | "success" | "danger";
};

export const Sparkline: FC<SparklineProps> = ({
  values,
  variant = "primary",
}) => {
  const max = Math.max(...values, 100);
  const gradientId = `sparkline-gradient-${variant}`;

  return (
    <svg viewBox="0 0 100 32" className="h-12 w-full text-current">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop
            offset="0%"
            stopColor={
              variant === "success"
                ? "rgba(16, 185, 129, 0.6)"
                : variant === "danger"
                  ? "rgba(239, 68, 68, 0.6)"
                  : "rgba(79, 70, 229, 0.6)"
            }
          />
          <stop
            offset="100%"
            stopColor={
              variant === "success"
                ? "rgba(16, 185, 129, 0.05)"
                : variant === "danger"
                  ? "rgba(239, 68, 68, 0.05)"
                  : "rgba(79, 70, 229, 0.05)"
            }
          />
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
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Sparkline;


