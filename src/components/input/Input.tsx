import * as React from "react";

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "prefix"> {
  label?: string;
  hint?: React.ReactNode;
  error?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  revealPasswordToggle?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  hint,
  error,
  prefix,
  suffix,
  size = "md",
  fullWidth = false,
  revealPasswordToggle = false,
  ...props
}) => {
  const fieldStyle: React.CSSProperties | undefined = fullWidth ? { width: "100%" } : undefined;

  return (
    <div className={`aui-input aui-input--${size}`} style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
      {label && <label className="aui-input__label">{label}</label>}
      <div style={{ display: "flex", alignItems: "center", border: "1px solid #ccc", borderRadius: "0.5rem", padding: "0.5rem" }}>
        {prefix && <span className="aui-input__prefix">{prefix}</span>}
        <input {...props} style={fieldStyle} />
        {suffix && <span className="aui-input__suffix">{suffix}</span>}
      </div>
      {hint && <small className="aui-input__hint">{hint}</small>}
      {error && <small className="aui-input__error" style={{ color: "red" }}>{error}</small>}
    </div>
  );
};

export default Input;
