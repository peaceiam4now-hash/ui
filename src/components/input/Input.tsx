import * as React from "react";
import "./Input.css";

export type InputSize = "sm" | "md" | "lg";

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  hint?: string;
  error?: string;
  prefix?: React.ReactNode;   // icon or text on the left
  suffix?: React.ReactNode;   // icon or text on the right
  size?: InputSize;
  fullWidth?: boolean;
  revealPasswordToggle?: boolean; // for type="password"
  id?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      hint,
      error,
      prefix,
      suffix,
      size = "md",
      fullWidth,
      revealPasswordToggle,
      id,
      type = "text",
      ...props
    },
    ref
  ) => {
    const autoId = React.useId();
    const _id = id ?? autoId;

    const hintId = hint ? `${_id}-hint` : undefined;
    const errId = error ? `${_id}-err` : undefined;
    const describedBy = [hintId, errId].filter(Boolean).join(" ") || undefined;

    const [show, setShow] = React.useState(false);
    const isPassword = type === "password";
    const effectiveType = isPassword && revealPasswordToggle ? (show ? "text" : "password") : type;

    const wrapperClasses = ["aui-input-wrap"];
    if (size === "sm") wrapperClasses.push("aui-input--sm");
    if (size === "lg") wrapperClasses.push("aui-input--lg");
    const fieldStyle: React.CSSProperties = fullWidth ? { width: "100%" } : undefined;

    return (
      <div className="aui-field" style={fieldStyle}>
        {label && <label className="aui-label" htmlFor={_id}>{label}</label>}
        <div className={wrapperClasses.join(" ")}>
          {prefix && <span className="aui-affix" aria-hidden>{prefix}</span>}

          <input
            ref={ref}
            id={_id}
            className="aui-input"
            aria-invalid={!!error || undefined}
            aria-describedby={describedBy}
            type={effectiveType}
            {...props}
          />

          {isPassword && revealPasswordToggle ? (
            <button
              type="button"
              className="aui-reveal-btn"
              aria-label={show ? "Hide password" : "Show password"}
              aria-pressed={show}
              onClick={() => setShow(s => !s)}
            >
              {show ? "Hide" : "Show"}
            </button>
          ) : (
            suffix && <span className="aui-affix" aria-hidden>{suffix}</span>
          )}
        </div>

        {hint && <div className="aui-hint" id={hintId}>{hint}</div>}
        {error && <div className="aui-error" id={errId}>{error}</div>}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
