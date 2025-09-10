import * as React from "react";
import "./Input.css";
import { cx } from "../../utils/cx";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  size?: "sm" | "md" | "lg";
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, size = "md", ...rest }, ref
) {
  return (
    <input
      ref={ref}
      className={cx("aui-input", `sz-${size}`, className)}
      {...rest}
    />
  );
});
