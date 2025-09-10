import * as React from "react";
import "./Tooltip.css";
import { cx } from "../../utils/cx";

type Placement = "top" | "bottom" | "left" | "right";

function useControllable({
  value, defaultValue, onChange
}: { value?: boolean; defaultValue?: boolean; onChange?: (v:boolean)=>void; }) {
  const [u, setU] = React.useState(!!defaultValue);
  const controlled = value !== undefined;
  const state = controlled ? !!value : u;
  const set = React.useCallback((v:boolean) => { if(!controlled) setU(v); onChange?.(v); }, [controlled, onChange]);
  return [state, set] as const;
}

function useStableId() {
  // Works on React 17 & 18
  const rid = (React as any).useId?.();
  const [fallback] = React.useState(() => `uid_${Math.random().toString(36).slice(2)}`);
  return rid ?? fallback;
}

export interface TooltipProps {
  content: React.ReactNode;
  placement?: Placement;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open:boolean)=>void;
  delay?: number;              // ms
  disabled?: boolean;
  className?: string;
  children: React.ReactElement;
}

export const Tooltip = React.forwardRef<HTMLSpanElement, TooltipProps>(function Tooltip(
  { content, placement = "top", open, defaultOpen, onOpenChange, delay = 100, disabled, className, children }, ref
){
  const [isOpen, setOpen] = useControllable({ value: open, defaultValue: defaultOpen, onChange: onOpenChange });
  const tid = React.useRef<number | null>(null);
  const id = useStableId();

  const show = React.useCallback(() => {
    if (disabled) return;
    if (tid.current) window.clearTimeout(tid.current);
    tid.current = window.setTimeout(() => setOpen(true), delay);
  }, [delay, disabled, setOpen]);
  const hide = React.useCallback(() => {
    if (tid.current) window.clearTimeout(tid.current);
    setOpen(false);
  }, [setOpen]);

  React.useEffect(() => () => { if (tid.current) window.clearTimeout(tid.current); }, []);

  const triggerProps: any = {
    onMouseEnter: (e: any) => { children.props.onMouseEnter?.(e); show(); },
    onMouseLeave: (e: any) => { children.props.onMouseLeave?.(e); hide(); },
    onFocus: (e: any) => { children.props.onFocus?.(e); show(); },
    onBlur: (e: any) => { children.props.onBlur?.(e); hide(); },
    "aria-describedby": isOpen ? id : undefined,
  };
  const trigger = React.cloneElement(children, triggerProps);

  return (
    <span ref={ref} className={cx("aui-tooltip-root", className)}>
      {trigger}
      <span
        id={id}
        role="tooltip"
        className={cx("aui-tooltip", `place-${placement}`, isOpen && "is-open")}
      >
        {content}
        <span className="aui-tooltip__arrow" aria-hidden="true" />
      </span>
    </span>
  );
});
