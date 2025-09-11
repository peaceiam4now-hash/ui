import * as React from "react";
import "./Drawer.css";
import { cx } from "../../utils/cx";

type Side = "left" | "right";

function useControllable({
  value,
  defaultValue,
  onChange,
}: {
  value?: boolean;
  defaultValue?: boolean;
  onChange?: (v: boolean) => void;
}) {
  const [uncontrolled, setUncontrolled] = React.useState(!!defaultValue);
  const isControlled = value !== undefined;
  const state = isControlled ? !!value : uncontrolled;
  const set = React.useCallback(
    (v: boolean) => {
      if (!isControlled) setUncontrolled(v);
      onChange?.(v);
    },
    [isControlled, onChange]
  );
  return [state, set] as const;
}

export interface DrawerProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;

  side?: Side;               // "left" | "right"
  width?: number;            // px, default 320
  closeOnEsc?: boolean;      // default true
  closeOnOverlay?: boolean;  // default true
  modal?: boolean;           // default true -> aria-modal & body scroll lock

  title?: React.ReactNode;   // optional heading for a11y
  showClose?: boolean;       // default true, renders an "×" button
}

export const Drawer = React.forwardRef<HTMLElement, DrawerProps>(function Drawer(
  {
    open,
    defaultOpen,
    onOpenChange,
    side = "left",
    width = 320,
    closeOnEsc = true,
    closeOnOverlay = true,
    modal = true,
    title,
    showClose = true,
    className,
    children,
    ...rest
  },
  ref
) {
  const [isOpen, setIsOpen] = useControllable({ value: open, defaultValue: defaultOpen, onChange: onOpenChange });

  // Restore focus to the previously focused element on close
  const previouslyFocused = React.useRef<HTMLElement | null>(null);
  React.useEffect(() => {
    if (isOpen) {
      previouslyFocused.current = document.activeElement as HTMLElement;
    } else {
      previouslyFocused.current?.focus?.();
    }
  }, [isOpen]);

  // Lock body scroll when modal and open
  React.useEffect(() => {
    if (!modal) return;
    const prev = document.body.style.overflow;
    if (isOpen) document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [isOpen, modal]);

  // Close on Esc
  React.useEffect(() => {
    if (!isOpen || !closeOnEsc) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, closeOnEsc, setIsOpen]);

  // Simple focus handling: focus panel on open
  const panelRef = React.useRef<HTMLDivElement | null>(null);
  React.useEffect(() => {
    if (isOpen) {
      const t = setTimeout(() => panelRef.current?.focus(), 0);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  const rootClasses = cx(
    "aui-drawer",
    `aui-drawer--${side}`,
    isOpen && "is-open",
    modal && "is-modal",
    className
  );

  const onOverlayClick = () => {
    if (closeOnOverlay) setIsOpen(false);
  };

  const labelledById = React.useId();
  const hasHeading = !!title;

  return (
    <section
      ref={ref as any}
      className={rootClasses}
      style={{ ["--aui-drawer-w" as any]: `${width}px` }}
      {...rest}
    >
      {/* Overlay */}
      <div
        className="aui-drawer__overlay"
        aria-hidden="true"
        onClick={onOverlayClick}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        className="aui-drawer__panel"
        role="dialog"
        tabIndex={-1}
        aria-modal={modal || undefined}
        aria-labelledby={hasHeading ? labelledById : undefined}
      >
        {(showClose || hasHeading) && (
          <header className="aui-drawer__header">
            {hasHeading && <h2 id={labelledById} className="aui-drawer__title">{title}</h2>}
            {showClose && (
              <button
                type="button"
                className="aui-drawer__close"
                aria-label="Close sidebar"
                onClick={() => setIsOpen(false)}
              >
                ×
              </button>
            )}
          </header>
        )}
        <div className="aui-drawer__body">{children}</div>
      </div>
    </section>
  );
});

export default Drawer;

/**
 * Layout helper that "pushes" page content when Drawer is open
 * by adding left/right padding equal to drawer width.
 */
export function DrawerLayout({
  open,
  side = "left",
  width = 320,
  children,
  className,
  style,
}: {
  open?: boolean;
  side?: Side;
  width?: number;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={cx("aui-drawer-layout", open && `is-${side}-open`, className)}
      style={{
        ["--aui-drawer-w" as any]: `${width}px`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
