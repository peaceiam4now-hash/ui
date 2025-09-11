import * as React from "react";
import "./Popover.css";
import { cx } from "../../utils/cx";

type Align = "start" | "center" | "end";
type Side = "top" | "bottom" | "left" | "right";

function useControllable({
  value,
  defaultValue,
  onChange,
}: {
  value?: boolean;
  defaultValue?: boolean;
  onChange?: (v: boolean) => void;
}) {
  const [u, setU] = React.useState(!!defaultValue);
  const controlled = value !== undefined;
  const state = controlled ? !!value : u;
  const set = React.useCallback(
    (v: boolean) => {
      if (!controlled) setU(v);
      onChange?.(v);
    },
    [controlled, onChange]
  );
  return [state, set] as const;
}

function useStableId() {
  const rid = (React as any).useId?.();
  const [fallback] = React.useState(() => "uid_" + Math.random().toString(36).slice(2));
  return rid ?? fallback;
}

type Ctx = {
  open: boolean;
  setOpen: (v: boolean) => void;
  side: Side;
  align: Align;
  offset: number;
  triggerRef: React.RefObject<HTMLSpanElement>;
  contentRef: React.RefObject<HTMLDivElement>;
  contentId: string;
};

const PopoverCtx = React.createContext<Ctx | null>(null);

export interface PopoverProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  side?: Side;
  align?: Align;
  offset?: number;
  className?: string;
  children: React.ReactNode;
  onEscapeKeyDown?: () => void;
  closeOnOutsideClick?: boolean;
}

export function Popover({
  open,
  defaultOpen,
  onOpenChange,
  side = "bottom",
  align = "start",
  offset = 8,
  className,
  children,
  onEscapeKeyDown,
  closeOnOutsideClick = true,
}: PopoverProps) {
  const [isOpen, setOpen] = useControllable({ value: open, defaultValue: defaultOpen, onChange: onOpenChange });
  const triggerRef = React.useRef<HTMLSpanElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const contentId = useStableId();

  React.useEffect(() => {
    if (!isOpen || !closeOnOutsideClick) return;
    if (typeof document === "undefined") return;
    const onClick = (e: MouseEvent | TouchEvent) => {
      const t = e.target as Node;
      if (contentRef.current?.contains(t)) return;
      if (triggerRef.current?.contains(t)) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("touchstart", onClick, { passive: true });
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("touchstart", onClick);
    };
  }, [isOpen, closeOnOutsideClick, setOpen]);

  React.useEffect(() => {
    if (!isOpen) return;
    if (typeof document === "undefined") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onEscapeKeyDown?.();
        setOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onEscapeKeyDown, setOpen]);

  const ctx = React.useMemo<Ctx>(
    () => ({ open: isOpen, setOpen, side, align, offset, triggerRef, contentRef, contentId }),
    [isOpen, setOpen, side, align, offset, contentId]
  );

  return (
    <div className={cx("aui-popover", className)} data-state={isOpen ? "open" : "closed"}>
      <PopoverCtx.Provider value={ctx}>{children}</PopoverCtx.Provider>
    </div>
  );
}

/* Trigger – wrapper span to avoid passing ref into function components */
export function PopoverTrigger({ children }: { children: React.ReactNode }) {
  const ctx = React.useContext(PopoverCtx)!;
  const { open, setOpen, triggerRef, contentId } = ctx;
  return (
    <span
      ref={triggerRef}
      className="aui-popover__trigger"
      role="button"
      tabIndex={0}
      aria-haspopup="dialog"
      aria-expanded={open || undefined}
      aria-controls={open ? contentId : undefined}
      onClick={() => setOpen(!open)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setOpen(!open);
        }
      }}
      style={{ display: "inline-flex" }}
    >
      {children}
    </span>
  );
}

/* Content */
export interface PopoverContentProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: React.ReactNode;
  showClose?: boolean;
}

export function PopoverContent({ title, showClose = true, className, style, children, ...rest }: PopoverContentProps) {
  const ctx = React.useContext(PopoverCtx)!;
  const { open, setOpen, side, align, offset, contentRef, contentId } = ctx;
  const labelledId = useStableId();
  return (
    <div
      id={contentId}
      ref={contentRef}
      role="dialog"
      aria-modal={false}
      aria-labelledby={title ? labelledId : undefined}
      className={cx("aui-popover__content", `side-${side}`, `align-${align}`, open && "is-open", className)}
      style={{ ["--aui-popover-offset" as any]: `${offset}px`, ...style }}
      data-state={open ? "open" : "closed"}
      {...rest}
    >
      {(title || showClose) && (
        <header className="aui-popover__header">
          {title && (
            <h3 id={labelledId} className="aui-popover__title">
              {title}
            </h3>
          )}
          {showClose && (
            <button className="aui-popover__close" aria-label="Close" onClick={() => setOpen(false)}>
              ×
            </button>
          )}
        </header>
      )}
      <div className="aui-popover__body">{children}</div>
      <span className="aui-popover__arrow" aria-hidden="true" />
    </div>
  );
}
