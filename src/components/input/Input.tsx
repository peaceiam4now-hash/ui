import * as React from "react";
import "./Input.css";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  id?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, hint, error, id, ...props }, ref) => {
    const inputId = React.useId();
    const _id = id ?? inputId;
    const hintId = hint ? `${_id}-hint` : undefined;
    const errId = error ? `${_id}-err` : undefined;

    return (
      <div className="aui-field">
        {label && <label className="aui-label" htmlFor={_id}>{label}</label>}
        <input
          ref={ref}
          id={_id}
          className="aui-input"
          aria-invalid={!!error || undefined}
          aria-describedby={[hintId, errId].filter(Boolean).join(" ") || undefined}
          {...props}
        />
        {hint && <div className="aui-hint" id={hintId}>{hint}</div>}
        {error && <div className="aui-error" id={errId}>{error}</div>}
      </div>
    );
  }
);
Input.displayName = "Input";
export default Input;
