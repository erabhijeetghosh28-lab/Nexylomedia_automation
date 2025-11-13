import clsx from "clsx";
import type { ReactNode } from "react";

export type Column<T> = {
  key: keyof T | string;
  header: ReactNode;
  align?: "left" | "center" | "right";
  render?: (item: T) => ReactNode;
};

type DataTableProps<T> = {
  columns: Column<T>[];
  data: T[];
  caption?: string;
  emptyState?: ReactNode;
  loading?: boolean;
};

export const DataTable = <T extends Record<string, unknown>>({
  columns,
  data,
  caption,
  emptyState,
  loading = false,
}: DataTableProps<T>) => {
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-border bg-bg-surface shadow-subtle dark:border-slate-800 dark:bg-slate-900">
      <table className="w-full table-fixed border-collapse">
        {caption && (
          <caption className="bg-bg px-4 py-3 text-left text-sm font-semibold text-slate-900 dark:bg-slate-900 dark:text-slate-100">
            {caption}
          </caption>
        )}
        <thead className="bg-bg dark:bg-slate-900">
          <tr className="text-left text-xs font-semibold uppercase tracking-wide text-muted dark:text-slate-400">
            {columns.map((column) => (
              <th
                key={column.key as string}
                className={clsx(
                  "px-4 py-3",
                  column.align === "center"
                    ? "text-center"
                    : column.align === "right"
                      ? "text-right"
                      : "text-left",
                )}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-sm text-slate-800 dark:text-slate-200">
          {loading ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-8 text-center text-muted"
              >
                Loading records…
              </td>
            </tr>
          ) : data.length ? (
            data.map((item, rowIndex) => (
              <tr
                key={rowIndex}
                className="border-t border-border/70 hover:bg-primary/5 dark:border-slate-800 dark:hover:bg-slate-800/60"
              >
                {columns.map((column) => (
                  <td
                    key={`${rowIndex}-${column.key as string}`}
                    className={clsx(
                      "px-4 py-3",
                      column.align === "center"
                        ? "text-center"
                        : column.align === "right"
                          ? "text-right"
                          : "text-left",
                    )}
                  >
                    {column.render
                      ? column.render(item)
                      : (item[column.key as keyof T] as ReactNode)}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-10 text-center text-muted"
              >
                {emptyState ?? "No records found"}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;


