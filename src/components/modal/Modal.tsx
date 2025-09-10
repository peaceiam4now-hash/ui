import * as React from "react";
import "./Modal.css";

export interface ModalProps extends React.DialogHTMLAttributes<HTMLDivElement> {
  open: boolean;
  onClose: () => void;
  title?: string;
  initialFocusRef?: React.RefObject<HTMLElement>;
}

export const Modal: React.FC<ModalProps> = ({ open, onClose, title, children, initialFocusRef, ...rest }) => {
  const backdropRef = React.useRef<HTMLDivElement>(null);
  const lastFocused = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    if (open) {
      lastFocused.current = document.activeElement as HTMLElement | null;
      setTimeout(() => {
        const target = initialFocusRef?.current || backdropRef.current?.querySelector<HTMLElement>("[data-autofocus]");
        target?.focus();
      }, 0);
      const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
      document.addEventListener("keydown", onKey);
      return () => document.removeEventListener("keydown", onKey);
    } else {
      lastFocused.current?.focus?.();
    }
  }, [open, onClose]);

  if (!open) return null;

  const onBackdrop = (e: React.MouseEvent) => { if (e.target === e.currentTarget) onClose(); };

  return (
    <div className="aui-modal__backdrop" role="presentation" onMouseDown={onBackdrop} ref={backdropRef}>
      <div className="aui-modal__dialog" role="dialog" aria-modal="true" aria-labelledby={title ? "aui-modal-title" : undefined} {...rest}>
        {title && <h2 id="aui-modal-title" style={{ marginTop: 0 }}>{title}</h2>}
        {children}
        <button data-autofocus style={{ position: "absolute", inset: "-9999px" }} aria-hidden />
      </div>
    </div>
  );
};
export default Modal;
