import * as React from "react";
import "./Textarea.css";
import { cx } from "../../utils/cx";

type Size = "sm" | "md" | "lg";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  size?: Size;
  resize?: "none" | "vertical" | "horizontal" | "both";
  maxLength?: number;
  showCount?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className, size = "md", resize = "vertical", maxLength, showCount, onChange, ...rest }, ref
) {
  const [len, setLen] = React.useState((rest.defaultValue?.toString() ?? rest.value?.toString() ?? "").length);
  return (
    <div className={cx("aui-textarea", `size-${size}`, className)}>
      <textarea
        ref={ref}
        className="aui-textarea__control"
        style={{ resize }}
        maxLength={maxLength}
        onChange={(e) => { setLen(e.target.value.length); onChange?.(e); }}
        {...rest}
      />
      {showCount && typeof maxLength === "number" && (
        <div className="aui-textarea__count" aria-live="polite">{len}/{maxLength}</div>
      )}
    </div>
  );
});
