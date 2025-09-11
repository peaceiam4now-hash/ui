import * as React from "react";
import "./Checkbox.css";
import { cx } from "../../utils/cx";

type Size = "sm" | "md" | "lg";

function useControllable({
  value,
  defaultValue,
  onChange,
}: { value?: boolean; defaultValue?: boolean; onChange?: (v: boolean) => void }) {
  const [u, setU] = React.useState(!!defaultValue);
  const controlled = value !== undefined;
  const state = controlled ? !!value : u;
  const set = React.useCallback((v: boolean) => { if (!controlled) setU(v); onChange?.(v); }, [controlled, onChange]);
  return [state, set] as const;
}

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "checked" | "defaultChecked" | "onChange"> {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean, e: React.ChangeEvent<HTMLInputElement>) => void;
  indeterminate?: boolean;
  size?: Size;
  label?: React.ReactNode;
  description?: React.ReactNode;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { checked, defaultChecked, onChange, indeterminate, size = "md", disabled, className, id, label, description,
    "aria-describedby": ariaDescribedBy, ...rest }, ref
) {
  const [isChecked, setChecked] = useControllable({ value: checked, defaultValue: defaultChecked, onChange: (v) => onChange?.(v, lastEventRef.current!) });
  const inputRef = React.useRef<HTMLInputElement>(null);
  const lastEventRef = React.useRef<React.ChangeEvent<HTMLInputElement> | null>(null);

  React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

  React.useEffect(() => {
    if (inputRef.current) inputRef.current.indeterminate = !!indeterminate && !isChecked;
  }, [indeterminate, isChecked]);

  return (
    <label className={cx("aui-checkbox", `size-${size}`, disabled && "is-disabled", className)}>
      <input
        ref={inputRef}
        id={id}
        type="checkbox"
        className="aui-checkbox__input"
        checked={isChecked}
        onChange={(e) => { lastEventRef.current = e; setChecked(e.target.checked); }}
        aria-describedby={ariaDescribedBy}
        disabled={disabled}
        {...rest}
      />
      <span aria-hidden className="aui-checkbox__control" />
      {(label || description) && (
        <span className="aui-checkbox__text">
          {label && <span className="aui-checkbox__label">{label}</span>}
          {description && <span className="aui-checkbox__description">{description}</span>}
        </span>
      )}
    </label>
  );
});
