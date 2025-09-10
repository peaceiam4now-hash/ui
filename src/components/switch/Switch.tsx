import * as React from "react";
import "./Switch.css";
import { cx } from "../../utils/cx";

function useControllable({
  value, defaultValue, onChange
}: { value?: boolean; defaultValue?: boolean; onChange?: (v:boolean)=>void; }) {
  const [u, setU] = React.useState(!!defaultValue);
  const isCtrl = value !== undefined;
  const state = isCtrl ? !!value : u;
  const set = React.useCallback((v:boolean) => { if (!isCtrl) setU(v); onChange?.(v); }, [isCtrl, onChange]);
  return [state, set] as const;
}

export interface SwitchProps extends Omit<React.HTMLAttributes<HTMLButtonElement>, "onChange"> {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked:boolean)=>void;
  disabled?: boolean;
  size?: "sm" | "md";
  id?: string;
}

export const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(function Switch(
  { checked, defaultChecked, onCheckedChange, disabled, size="md", id, className, ...rest }, ref
){
  const [on, setOn] = useControllable({ value: checked, defaultValue: defaultChecked, onChange: onCheckedChange });
  const toggle = React.useCallback(() => { if (!disabled) setOn(!on); }, [disabled, on, setOn]);

  return (
    <button
      ref={ref}
      id={id}
      type="button"
      role="switch"
      aria-checked={on}
      aria-disabled={disabled || undefined}
      className={cx("aui-switch", `sz-${size}`, on && "is-on", disabled && "is-disabled", className)}
      onClick={toggle}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); } }}
      {...rest}
    >
      <span className="aui-switch__track"><span className="aui-switch__thumb" /></span>
    </button>
  );
});
