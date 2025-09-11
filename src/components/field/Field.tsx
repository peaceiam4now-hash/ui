import * as React from "react";
import "./Field.css";
import { cx } from "../../utils/cx";

export interface FieldProps {
  label?: React.ReactNode;
  description?: React.ReactNode;
  error?: React.ReactNode;
  required?: boolean;
  className?: string;
  children: React.ReactElement; // the control (e.g., <input />)
}

export function Field({ label, description, error, required, className, children }: FieldProps) {
  const uid = React.useId();
  const inputId = (children.props.id as string) || `field-${uid}`;
  const descId = description ? `desc-${uid}` : undefined;
  const errId  = error ? `err-${uid}` : undefined;

  const describedBy = [errId, descId].filter(Boolean).join(" ") || undefined;

  const child = React.cloneElement(children, {
    id: inputId,
    "aria-describedby": describedBy,
    "aria-invalid": !!error || undefined,
    "aria-required": required || undefined,
  });

  return (
    <div className={cx("aui-field", !!error && "is-invalid", className)}>
      {label && (
        <label className="aui-field__label" htmlFor={inputId}>
          {label}{required && <span className="aui-field__req" aria-hidden="true"> *</span>}
        </label>
      )}
      {description && <div id={descId} className="aui-field__desc">{description}</div>}
      {child}
      {error && <div id={errId} className="aui-field__error" role="alert">{error}</div>}
    </div>
  );
}
