import * as React from "react";
import "./Select.css";
import { cx } from "../../utils/cx";

type Size = "sm" | "md" | "lg";

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size' | 'prefix'> {
  size?: Size;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { className, size = "md", disabled, prefix, suffix, children, ...rest }, ref
) {
  return (
    <label className={cx("aui-select", `size-${size}`, disabled && "is-disabled", className)}>
      {prefix && <span className="aui-select__affix aui-select__prefix">{prefix}</span>}
      <select ref={ref} className="aui-select__control" disabled={disabled} {...rest}>
        {children}
      </select>
      <span className="aui-select__chevron" aria-hidden>▾</span>
      {suffix && <span className="aui-select__affix aui-select__suffix">{suffix}</span>}
    </label>
  );
});
