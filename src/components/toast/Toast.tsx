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
  pause: (id: string) => void;
  resume: (id: string) => void;
  getDuration: (id: string) => number;
};

const ToastContext = React.createContext<Ctx | null>(null);

let idSeq = 0;
const genId = () => `toast_${++idSeq}`;

/* ---------- Global helper (filled by <ToastProvider>) ---------- */
const noopPush = (_opts: ToastOptions) => "";
const noopVoid = (_id?: string) => {};
export const toast = {
  push: noopPush as (opts: ToastOptions) => string,
  success: ((title: any, description?: any) =>
    (toast.push as any)({ title, description, variant: "success" })) as any,
  warning: ((title: any, description?: any) =>
    (toast.push as any)({ title, description, variant: "warning" })) as any,
  danger: ((title: any, description?: any) =>
    (toast.push as any)({ title, description, variant: "danger" })) as any,
  info: ((title: any, description?: any) =>
    (toast.push as any)({ title, description, variant: "default" })) as any,
  remove: noopVoid as (id: string) => void,
  clear: (() => {}) as () => void,
};
/* -------------------------------------------------------------- */

export interface ToastProviderProps {
  children?: React.ReactNode;
  position?: ToastPosition;
  max?: number;
  container?: HTMLElement;    // optional custom portal root
}

export function ToastProvider({
  children,
  position = "top-right",
  max = 5,
  container
}: ToastProviderProps) {
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);
  const [internalHost, setInternalHost] = React.useState<HTMLElement | null>(null);

  // Create a default host only after mount, and clean it up on unmount
  React.useEffect(() => {
    if (container) return; // external host provided by caller
    if (typeof document === "undefined") return;
    let el = document.getElementById("aui-toast-root") as HTMLElement | null;
    let created = false;
    if (!el) {
      el = document.createElement("div");
      el.id = "aui-toast-root";
      document.body.appendChild(el);
      created = true;
    }
    setInternalHost(el);
    return () => {
      if (created && el && el.parentNode) el.parentNode.removeChild(el);
    };
  }, [container]);

  const host = container ?? internalHost;

  const timers = React.useRef<Record<string, number>>({});
  const startAt = React.useRef<Record<string, number>>({});
  const remaining = React.useRef<Record<string, number>>({});
  const totalDuration = React.useRef<Record<string, number>>({});

  const remove = React.useCallback((id: string) => {
    window.clearTimeout(timers.current[id]);
    delete timers.current[id];
    delete startAt.current[id];
    delete remaining.current[id];
    delete totalDuration.current[id];
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const schedule = React.useCallback((t: ToastItem) => {
    const dur = t.duration ?? 4000;
    totalDuration.current[t.id] = dur;
    remaining.current[t.id] = dur;
    startAt.current[t.id] = Date.now();
    window.clearTimeout(timers.current[t.id]);
    timers.current[t.id] = window.setTimeout(() => remove(t.id), dur);
  }, [remove]);

  const push = React.useCallback((opts: ToastOptions) => {
    const full: ToastItem = {
      id: opts.id ?? genId(),
      createdAt: Date.now(),
      dismissible: true,
      variant: "default",
      ...opts,
    };
    setToasts((prev) => {
      const next = [...prev, full];
      while (next.length > max) {
        const oldest = next.shift();
        if (oldest) {
          window.clearTimeout(timers.current[oldest.id]);
          delete timers.current[oldest.id];
          delete startAt.current[oldest.id];
          delete remaining.current[oldest.id];
          delete totalDuration.current[oldest.id];
        }
      }
      return next;
    });
    setTimeout(() => schedule(full), 0);
    return full.id;
  }, [max, schedule]);

  const clear = React.useCallback(() => {
    Object.values(timers.current).forEach((tid) => window.clearTimeout(tid));
    timers.current = {};
    startAt.current = {};
    remaining.current = {};
    totalDuration.current = {};
    setToasts([]);
  }, []);

  const pause = React.useCallback((id: string) => {
    const started = startAt.current[id];
    if (!started) return;
    const elapsed = Date.now() - started;
    const rem = Math.max(0, (remaining.current[id] ?? totalDuration.current[id] ?? 0) - elapsed);
    remaining.current[id] = rem;
    startAt.current[id] = 0;
    window.clearTimeout(timers.current[id]);
  }, []);

  const resume = React.useCallback((id: string) => {
    const rem = remaining.current[id];
    if (rem == null) return;
    if (rem <= 0) { remove(id); return; }
    startAt.current[id] = Date.now();
    window.clearTimeout(timers.current[id]);
    timers.current[id] = window.setTimeout(() => remove(id), rem);
  }, [remove]);

  const getDuration = React.useCallback((id: string) => {
    return totalDuration.current[id] ?? 4000;
  }, []);

  // attach to global helper
  React.useEffect(() => {
    toast.push = push;
    toast.remove = remove;
    toast.clear = clear;
    return () => {
      toast.push = noopPush as any;
      toast.remove = noopVoid as any;
      toast.clear = (() => {}) as any;
    };
  }, [push, remove, clear]);

  const ctx = React.useMemo<Ctx>(() => ({
    toasts, push, remove, clear, pause, resume, getDuration
  }), [toasts, push, remove, clear, pause, resume, getDuration]);

  return (
    <ToastContext.Provider value={ctx}>
      {children}
      <ToastViewport position={position} host={host} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within <ToastProvider>");
  return ctx;
}

/* ---------- Viewport ---------- */

function ToastViewport({
  position,
  host,
}: {
  position: ToastPosition;
  host?: HTMLElement | null;
}) {
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
  const { pause, resume, getDuration } = useToast();
  const [hover, setHover] = React.useState(false);

  // swipe-to-dismiss
  const start = React.useRef<{x: number; y: number} | null>(null);
  const [dx, setDx] = React.useState(0);
  const [dragging, setDragging] = React.useState(false);

  const onPointerDown = (e: React.PointerEvent) => {
    start.current = { x: e.clientX, y: e.clientY };
    setDragging(true);
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    pause(item.id);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging || !start.current) return;
    const ndx = e.clientX - start.current.x;
    const ndy = e.clientY - start.current.y;
    if (Math.abs(ndy) > Math.abs(ndx) * 1.2 && Math.abs(ndy) > 8) return;
    setDx(ndx);
  };
  const onPointerUp = (e: React.PointerEvent) => {
    (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
    const threshold = 80;
    if (Math.abs(dx) > threshold) {
      onClose();
    } else {
      setDx(0);
      resume(item.id);
    }
    setDragging(false);
    start.current = null;
  };

  const role = item.variant === "danger" ? "alert" : "status";
  const dismissible = item.dismissible ?? true;
  const dur = getDuration(item.id);

  return (
    <div
      className={cx(
        "aui-toast",
        `is-${item.variant ?? "default"}`,
        hover && "is-hover",
        dragging && "is-dragging"
      )}
      role={role}
      onMouseEnter={() => { setHover(true); pause(item.id); }}
      onMouseLeave={() => { setHover(false); resume(item.id); }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      style={{
        transform: dx ? `translateX(${dx}px) rotate(${dx * 0.02}deg)` : undefined,
        opacity: dx ? String(Math.max(0.2, 1 - Math.abs(dx) / 240)) : undefined,
      }}
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

      <div
        className="aui-toast__progress"
        style={{ ["--aui-toast-dur" as any]: `${dur}ms` }}
        aria-hidden="true"
      />
    </div>
  );
}
