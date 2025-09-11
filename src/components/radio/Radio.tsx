import * as React from "react";
import "./Radio.css";
import { cx } from "../../utils/cx";

type Size = "sm" | "md" | "lg";

type GroupCtx = {
  name?: string;
  value?: string;
  setValue?: (v: string) => void;
  disabled?: boolean;
};
const Ctx = React.createContext<GroupCtx | null>(null);

function useControllable<T>({
  value,
  defaultValue,
  onChange,
}: { value?: T; defaultValue?: T; onChange?: (v: T) => void }) {
  const [u, setU] = React.useState<T | undefined>(defaultValue);
  const controlled = value !== undefined;
  const state = (controlled ? value : u) as T;
  const set = React.useCallback((v: T) => { if (!controlled) setU(v); onChange?.(v); }, [controlled, onChange]);
  return [state, set] as const;
}

export interface RadioGroupProps {
  name?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (v: string) => void;
  disabled?: boolean;
  orientation?: "vertical" | "horizontal";
  className?: string;
  children: React.ReactNode;
}
export function RadioGroup({
  name,
  value,
  defaultValue,
  onValueChange,
  disabled,
  orientation = "vertical",
  className,
  children,
}: RadioGroupProps) {
  const [val, setVal] = useControllable<string>({ value, defaultValue, onChange: onValueChange });
  return (
    <div
      role="radiogroup"
      className={cx("aui-radio-group", `is-${orientation}`, className)}
      aria-disabled={disabled || undefined}
    >
      <Ctx.Provider value={{ name, value: val, setValue: setVal, disabled }}>{children}</Ctx.Provider>
    </div>
  );
}

export interface RadioProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "type" | "onChange" | "checked" | "defaultChecked"> {
  size?: Size;
  label?: React.ReactNode;
  description?: React.ReactNode;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean, e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(function Radio(
  { size = "md", label, description, className, disabled, name, value, checked, defaultChecked, onChange, id, ...rest },
  ref
) {
  const ctx = React.useContext(Ctx);
  const groupName = ctx?.name ?? name;
  const isGroup = !!ctx;
  const isChecked = isGroup ? ctx!.value === value : checked;

  const inputRef = React.useRef<HTMLInputElement>(null);
  React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

  return (
    <label className={cx("aui-radio", `size-${size}`, (disabled || ctx?.disabled) && "is-disabled", className)}>
      <input
        ref={inputRef}
        id={id}
        className="aui-radio__input"
        type="radio"
        name={groupName}
        value={value}
        checked={isGroup ? isChecked : checked}
        defaultChecked={isGroup ? undefined : defaultChecked}
        onChange={(e) => {
          if (isGroup) ctx?.setValue?.(e.target.value);
          onChange?.(e.target.checked, e);
        }}
        disabled={disabled || ctx?.disabled}
        {...rest}
      />
      <span aria-hidden className="aui-radio__control" />
      {(label || description) && (
        <span className="aui-radio__text">
          {label && <span className="aui-radio__label">{label}</span>}
          {description && <span className="aui-radio__description">{description}</span>}
        </span>
      )}
    </label>
  );
});
