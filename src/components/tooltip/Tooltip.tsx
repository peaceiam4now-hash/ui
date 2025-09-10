import * as React from "react";
import "./Tooltip.css";

export interface TooltipProps {
  label: string;
  children: React.ReactElement;
}

export const Tooltip: React.FC<TooltipProps> = ({ label, children }) => {
  const [open, setOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLElement>(null);
  const id = React.useId();

  const child = React.cloneElement(children, {
    ref: triggerRef,
    onMouseEnter: () => setOpen(true),
    onMouseLeave: () => setOpen(false),
    onFocus: () => setOpen(true),
    onBlur: () => setOpen(false),
    "aria-describedby": open ? id : undefined
  });

  return (
    <span className="aui-tooltip">
      {child}
      {open && <span role="tooltip" id={id} className="aui-tooltip__bubble">{label}</span>}
    </span>
  );
};
export default Tooltip;
