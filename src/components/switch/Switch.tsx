import * as React from "react";
import "./Switch.css";

export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  id?: string;
}

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ label, checked, defaultChecked, onCheckedChange, id, ...rest }, ref) => {
    const [internal, setInternal] = React.useState(!!defaultChecked);
    const isControlled = checked !== undefined;
    const value = isControlled ? !!checked : internal;
    const toggle = () => {
      const next = !value;
      if (!isControlled) setInternal(next);
      onCheckedChange?.(next);
    };
    const inputId = id ?? React.useId();

    return (
      <label className="aui-switch" data-checked={value} htmlFor={inputId}>
        <input
          ref={ref}
          id={inputId}
          className="aui-switch__input"
          role="switch"
          aria-checked={value}
          type="checkbox"
          checked={isControlled ? checked : internal}
          onChange={toggle}
          {...rest}
        />
        <span className="aui-switch__track" aria-hidden="true"><span className="aui-switch__thumb" /></span>
        {label && <span>{label}</span>}
      </label>
    );
  }
);
Switch.displayName = "Switch";
export default Switch;
