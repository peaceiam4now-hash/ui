import * as React from "react";
import { cx } from "../../utils/cx";
import "./Button.css";

export type ButtonVariant = "solid" | "ghost" | "link";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "solid", className, children, ...rest }, ref) => {
    return (
      <button
        ref={ref}
        className={cx("aui-btn", variant === "ghost" && "aui-btn--ghost", variant === "link" && "aui-btn--link", className)}
        {...rest}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
export default Button;
