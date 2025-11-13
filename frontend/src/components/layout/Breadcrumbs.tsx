import type { FC } from "react";
import { FiChevronRight } from "react-icons/fi";

export type Breadcrumb = {
  label: string;
  href?: string;
};

type BreadcrumbsProps = {
  items: Breadcrumb[];
};

export const Breadcrumbs: FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center text-sm font-medium text-muted"
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <div key={item.label} className="flex items-center">
            {item.href && !isLast ? (
              <a
                href={item.href}
                className="text-muted transition hover:text-primary"
              >
                {item.label}
              </a>
            ) : (
              <span
                className={isLast ? "text-slate-900" : "text-muted"}
                aria-current={isLast ? "page" : undefined}
              >
                {item.label}
              </span>
            )}
            {!isLast && (
              <FiChevronRight className="mx-2 h-3.5 w-3.5 text-muted" />
            )}
          </div>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;


