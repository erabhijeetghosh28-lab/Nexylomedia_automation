import { Fragment } from "react";
import type { FC, PropsWithChildren } from "react";
import { FiX } from "react-icons/fi";

type ModalProps = PropsWithChildren<{
  open: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  footer?: React.ReactNode;
}>;

export const Modal: FC<ModalProps> = ({
  open,
  onClose,
  title,
  description,
  footer,
  children,
}) => {
  if (!open) return null;

  return (
    <Fragment>
      <div
        className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm"
        aria-hidden="true"
        onClick={onClose}
      />
      <div
        className="fixed inset-0 z-50 flex items-center justify-center px-4 py-12 sm:px-8"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="w-full max-w-lg rounded-3xl border border-border bg-bg-surface shadow-medium dark:border-slate-800 dark:bg-slate-900">
          <header className="flex items-start justify-between gap-4 border-b border-border px-6 py-4 dark:border-slate-800">
            <div>
              <h3
                id="modal-title"
                className="text-lg font-semibold text-slate-900 dark:text-slate-100"
              >
                {title}
              </h3>
              {description && (
                <p className="mt-1 text-sm text-muted dark:text-slate-400">
                  {description}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-bg text-muted transition hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
              aria-label="Close modal"
            >
              <FiX />
            </button>
          </header>
          <div className="px-6 py-6">{children}</div>
          {footer && (
            <footer className="flex items-center justify-end gap-3 border-t border-border px-6 py-4 dark:border-slate-800">
              {footer}
            </footer>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default Modal;


