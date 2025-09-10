import * as React from "react";
import "./Accordion.css";
import { cx } from "../../utils/cx";

type Mode = "single" | "multiple";

export interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  /** open one or many at a time */
  type?: Mode;
  /** controlled value(s) */
  value?: string | string[];
  /** uncontrolled default value(s) */
  defaultValue?: string | string[];
  /** allow closing the only open item in single mode */
  collapsible?: boolean;
  /** when controlled, called with next value(s) */
  onValueChange?: (value: string | string[]) => void;
  /** children: <AccordionItem/>s */
  children: React.ReactNode;
  className?: string;
}

interface Ctx {
  type: Mode;
  isOpen: (val: string) => boolean;
  toggle: (val: string, disabled?: boolean) => void;
  registerTrigger: (idx: number, el: HTMLButtonElement | null) => void;
  focusTrigger: (idx: number) => void;
  getIndexByValue: (val: string) => number;
}

const AccordionCtx = React.createContext<Ctx | null>(null);

function toArray(v: string | string[] | undefined): string[] {
  if (!v) return [];
  return Array.isArray(v) ? v : [v];
}

export const Accordion: React.FC<AccordionProps> = ({
  type = "single",
  value: controlled,
  defaultValue,
  collapsible = true,
  onValueChange,
  className,
  children,
  ...rest
}) => {
  // manage value(s)
  const isCtl = controlled !== undefined;
  const [u, setU] = React.useState<string[]>(
    toArray(defaultValue ?? (type === "single" ? undefined : []))
  );
  const cur = isCtl ? toArray(controlled as any) : u;

  const setVal = (nextArr: string[]) => {
    if (!isCtl) setU(nextArr);
    onValueChange?.(type === "single" ? (nextArr[0] ?? "") : nextArr);
  };

  const isOpen = (val: string) => cur.includes(val);

  const toggle = (val: string, disabled?: boolean) => {
    if (disabled) return;
    if (type === "multiple") {
      setVal(isOpen(val) ? cur.filter((v) => v !== val) : [...cur, val]);
    } else {
      if (isOpen(val)) {
        if (collapsible) setVal([]);
      } else {
        setVal([val]);
      }
    }
  };

  // keyboard focus registry
  const triggersRef = React.useRef<Array<HTMLButtonElement | null>>([]);
  const registerTrigger = (idx: number, el: HTMLButtonElement | null) => {
    triggersRef.current[idx] = el;
  };
  const focusTrigger = (idx: number) => {
    const list = triggersRef.current.filter(Boolean);
    if (!list.length) return;
    const clamped = (idx + list.length) % list.length;
    list[clamped!]?.focus();
  };

  // value->index mapping (as rendered)
  const valueToIndex = React.useRef(new Map<string, number>());
  const getIndexByValue = (v: string) => valueToIndex.current.get(v) ?? -1;

  const ctx: Ctx = { type, isOpen, toggle, registerTrigger, focusTrigger, getIndexByValue };
  (ctx as any)._valueToIndexRef = valueToIndex;

  // Root key handler for Arrow/Home/End across triggers
  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const list = triggersRef.current.filter(Boolean);
    if (!list.length) return;
    const activeIndex = list.findIndex((el) => el === document.activeElement);
    const step = (d: number) => {
      e.preventDefault();
      const next = activeIndex < 0 ? 0 : activeIndex + d;
      focusTrigger(next);
    };
    switch (e.key) {
      case "ArrowDown": step(1); break;
      case "ArrowUp": step(-1); break;
      case "Home": e.preventDefault(); focusTrigger(0); break;
      case "End": e.preventDefault(); focusTrigger(list.length - 1); break;
    }
  };

  return (
    <div className={cx("aui-accordion", className)} onKeyDown={onKeyDown} {...rest}>
      <AccordionCtx.Provider value={ctx}>
        {React.Children.map(children, (child, idx) =>
          React.isValidElement(child)
            ? React.cloneElement(child as any, { __index: idx })
            : child
        )}
      </AccordionCtx.Provider>
    </div>
  );
};

export interface AccordionItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  disabled?: boolean;
  children: React.ReactNode;
  __index?: number; // injected
}
export const AccordionItem: React.FC<AccordionItemProps> = ({
  value, disabled, children, className, __index = 0, ...rest
}) => {
  const ctx = React.useContext(AccordionCtx);
  if (!ctx) throw new Error("AccordionItem must be inside <Accordion>");
  // register for index mapping
  React.useEffect(() => {
    (ctx as any)._valueToIndexRef.current.set(value, __index);
    return () => (ctx as any)._valueToIndexRef.current.delete(value);
  }, [value, __index, ctx]);

  return (
    <div className={cx("aui-accordion__item", disabled && "is-disabled", className)} data-disabled={disabled} {...rest}>
      {children}
    </div>
  );
};

export interface AccordionTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
  children: React.ReactNode;
  disabled?: boolean;
  __index?: number; // injected for focus registry
}
export const AccordionTrigger: React.FC<AccordionTriggerProps> = ({
  value, children, disabled, className, __index = 0, ...rest
}) => {
  const ctx = React.useContext(AccordionCtx);
  if (!ctx) throw new Error("AccordionTrigger must be inside <Accordion>");
  const { isOpen, toggle, registerTrigger } = ctx;
  const open = isOpen(value);

  const id = React.useId();
  const btnId = `acc-${id}-btn`;
  const panelId = `acc-${id}-panel`;

  const ref = React.useRef<HTMLButtonElement | null>(null);
  React.useEffect(() => { registerTrigger(__index, ref.current); }, [__index, registerTrigger]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle(value, disabled);
    }
  };

  return (
    <button
      ref={ref}
      id={btnId}
      className={cx("aui-accordion__trigger", open && "is-open", disabled && "is-disabled", className)}
      type="button"
      aria-expanded={open}
      aria-controls={panelId}
      onClick={() => toggle(value, disabled)}
      onKeyDown={onKeyDown}
      disabled={disabled}
      {...rest}
    >
      <span className="aui-accordion__label">{children}</span>
      <span className="aui-accordion__chevron" aria-hidden="true">▾</span>
    </button>
  );
};

export interface AccordionPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  children: React.ReactNode;
  keepMounted?: boolean;
}
export const AccordionPanel: React.FC<AccordionPanelProps> = ({
  value, children, className, keepMounted = true, ...rest
}) => {
  const ctx = React.useContext(AccordionCtx);
  if (!ctx) throw new Error("AccordionPanel must be inside <Accordion>");
  const open = ctx.isOpen(value);

  const id = React.useId();
  const btnId = `acc-${id}-btn`; // not used directly but unique seed
  const panelId = `acc-${id}-panel`;

  if (!keepMounted && !open) return null;

  return (
    <div
      id={panelId}
      role="region"
      aria-labelledby={btnId}
      hidden={!open}
      className={cx("aui-accordion__panel", open && "is-open", className)}
      {...rest}
    >
      {children}
    </div>
  );
};
