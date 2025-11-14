export const toOptionalString = (value: unknown): string | undefined => {
  return typeof value === "string" ? value : undefined;
};

export const toStringValue = (value: unknown): string => {
  if (typeof value === "string") {
    return value;
  }
  return "";
};

export const parseNumber = (value: unknown): number | undefined => {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    if (!isNaN(parsed)) return parsed;
  }
  return undefined;
};

export const parseBoolean = (value: unknown): boolean => {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (["true", "1", "yes", "y"].includes(normalized)) return true;
    if (["false", "0", "no", "n", ""].includes(normalized)) return false;
  }
  return false;
};


