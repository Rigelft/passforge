import { useEffect, useId, useRef, type PropsWithChildren, type ReactNode } from "react";
import { createPortal } from "react-dom";
import styles from "@/components/modal.module.css";

type ModalProps = PropsWithChildren<{
  open: boolean;
  title: string;
  onClose: () => void;
  actions?: ReactNode;
}>;

export function Modal({ open, title, onClose, actions, children }: ModalProps) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const el = panelRef.current;
    if (!el) return;
    const btn = el.querySelector<HTMLElement>("[data-autofocus]") ?? el;
    btn.focus?.();
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div className={styles.overlay} onClick={onClose} role="presentation">
      <div
        ref={panelRef}
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
      >
        <div className={styles.header}>
          <h2 className={styles.title} id={titleId}>
            {title}
          </h2>
          <button className={styles.iconBtn} onClick={onClose} aria-label="Fermer" data-autofocus>
            ×
          </button>
        </div>
        <div className={styles.body}>{children}</div>
        {actions ? <div className={styles.actions}>{actions}</div> : null}
      </div>
    </div>,
    document.body,
  );
}
