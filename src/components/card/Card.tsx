import * as React from "react";
import { cx } from "../../utils/cx";
import "./Card.css";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "elevated" | "outline";
}

export const Card: React.FC<CardProps> = ({ variant = "elevated", className, children, ...rest }) => {
  return (
    <div
      className={cx(
        "aui-card",
        variant === "outline" && "aui-card--outline",
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
};

export default Card;
