import * as React from "react";
import { createPortal } from "react-dom";
import "./Modal.css";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children?: React.ReactNode;
  closeOnEsc?: boolean;
  closeOnBackdrop?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  children,
  closeOnEsc = true,
  closeOnBackdrop = true
}) => {
  const titleId = React.useId();

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && closeOnEsc) onClose();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, closeOnEsc, onClose]);

  if (!open) return null;

  const handleOverlayClick = closeOnBackdrop ? onClose : undefined;

  return createPortal(
    <div
      className="aui-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? titleId : undefined}
      onClick={handleOverlayClick}
    >
      <div className="aui-modal__content" onClick={(e) => e.stopPropagation()} tabIndex={-1}>
        <div className="aui-modal__header">
          {title && <h2 id={titleId} className="aui-modal__title">{title}</h2>}
          <button
            type="button"
            className="aui-modal__close"
            aria-label="Close"
            onClick={onClose}
          >
            ×
          </button>
        </div>
        <div className="aui-modal__body">{children}</div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
