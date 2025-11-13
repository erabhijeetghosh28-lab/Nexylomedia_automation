import clsx from "clsx";
import type { FC } from "react";

type AvatarProps = {
  name: string;
  size?: "sm" | "md" | "lg";
  status?: "online" | "offline" | "busy";
};

const sizeClass: Record<NonNullable<AvatarProps["size"]>, string> = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
};

export const Avatar: FC<AvatarProps> = ({
  name,
  size = "md",
  status = "online",
}) => {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase();
  return (
    <span
      className={clsx(
        "relative inline-flex items-center justify-center rounded-full bg-primary/10 font-semibold text-primary",
        sizeClass[size],
      )}
    >
      {initials}
      <span
        className={clsx(
          "absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white",
          status === "online" && "bg-success",
          status === "busy" && "bg-warning",
          status === "offline" && "bg-muted",
        )}
      />
    </span>
  );
};

export default Avatar;


