import * as React from "react";
import { createPortal } from "react-dom";
import "./Toast.css";
import { cx } from "../../utils/cx";

export type ToastVariant = "default" | "success" | "warning" | "danger";
export type ToastPosition =
  | "top-right" | "top-center" | "top-left"
  | "bottom-right" | "bottom-center" | "bottom-left";

export interface ToastOptions {
  id?: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  variant?: ToastVariant;
  duration?: number;        // ms, default 4000
  action?: { label: React.ReactNode; onClick: (id: string) => void };
  dismissible?: boolean;    // default true
}

type ToastItem = Required<Pick<ToastOptions, "id">> & ToastOptions & { createdAt: number };

type Ctx = {
  toasts: ToastItem[];
  push: (opts: ToastOptions) => string;
  remove: (id: string) => void;
  clear: () => void;
};

const ToastContext = React.createContext<Ctx | null>(null);

let idSeq = 0;
const genId = () => `toast_${++idSeq}`;

export interface ToastProviderProps {
  children?: React.ReactNode;
  position?: ToastPosition;
  max?: number;          // max visible
  container?: HTMLElement; // optional custom portal root
}

export function ToastProvider({
  children,
  position = "top-right",
  max = 5,
  container
}: ToastProviderProps) {
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);
  const timers = React.useRef<Record<string, number>>({});

  const remove = React.useCallback((id: string) => {
    window.clearTimeout(timers.current[id]);
    delete timers.current[id];
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const schedule = React.useCallback((t: ToastItem) => {
    const dur = t.duration ?? 4000;
    if (dur <= 0) return;
    window.clearTimeout(timers.current[t.id]);
    timers.current[t.id] = window.setTimeout(() => remove(t.id), dur);
  }, [remove]);

  const push = React.useCallback((opts: ToastOptions) => {
    const id = opts.id ?? genId();
    setToasts((prev) => {
      const next: ToastItem[] = [
        ...prev,
        { id, createdAt: Date.now(), dismissible: true, variant: "default", ...opts },
      ];
      // trim to max (drop oldest)
      while (next.length > max) next.shift();
      return next;
    });
    // schedule after state flush
    setTimeout(() => {
      const t = { id, ...opts } as ToastItem;
      schedule(t);
    }, 0);
    return id;
  }, [max, schedule]);

  const clear = React.useCallback(() => {
    Object.values(timers.current).forEach((tid) => window.clearTimeout(tid));
    timers.current = {};
    setToasts([]);
  }, []);

  const ctx = React.useMemo<Ctx>(() => ({ toasts, push, remove, clear }), [toasts, push, remove, clear]);

  return (
    <ToastContext.Provider value={ctx}>
      {children}
      <ToastViewport position={position} container={container} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within <ToastProvider>");
  return ctx;
}

/* ---------- Viewport (portal target) ---------- */

function getDefaultHost(): HTMLElement {
  let el = document.getElementById("aui-toast-root") as HTMLElement | null;
  if (!el) {
    el = document.createElement("div");
    el.id = "aui-toast-root";
    document.body.appendChild(el);
  }
  return el;
}

function ToastViewport({
  position,
  container,
}: {
  position: ToastPosition;
  container?: HTMLElement;
}) {
  const host = container ?? (typeof document !== "undefined" ? getDefaultHost() : null);
  const { toasts, remove } = useToast();

  if (!host) return null;

  return createPortal(
    <div className={cx("aui-toast-viewport", `pos-${position}`)} role="region" aria-live="polite" aria-label="Notifications">
      {toasts.map((t) => (
        <ToastCard key={t.id} item={t} onClose={() => remove(t.id)} />
      ))}
    </div>,
    host
  );
}

/* ---------- Toast card ---------- */

function ToastCard({
  item,
  onClose,
}: {
  item: ToastItem;
  onClose: () => void;
}) {
  const [hover, setHover] = React.useState(false);

  // Pause / resume via CSS only (no timer change): keep simple for now.

  const role = item.variant === "danger" ? "alert" : "status";
  const dismissible = item.dismissible ?? true;

  return (
    <div
      className={cx("aui-toast", `is-${item.variant ?? "default"}`, hover && "is-hover")}
      role={role}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="aui-toast__content">
        {item.title && <div className="aui-toast__title">{item.title}</div>}
        {item.description && <div className="aui-toast__desc">{item.description}</div>}
      </div>

      {(item.action || dismissible) && (
        <div className="aui-toast__actions">
          {item.action && (
            <button
              type="button"
              className="aui-toast__btn aui-toast__btn--action"
              onClick={() => item.action!.onClick(item.id)}
            >
              {item.action!.label}
            </button>
          )}
          {dismissible && (
            <button
              type="button"
              className="aui-toast__btn aui-toast__btn--close"
              aria-label="Close notification"
              onClick={onClose}
            >
              ×
            </button>
          )}
        </div>
      )}
    </div>
  );
}
