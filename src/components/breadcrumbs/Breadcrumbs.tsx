import * as React from "react";
import "./Breadcrumbs.css";
import { cx } from "../../utils/cx";

export type Crumb = {
  id?: string;
  label: React.ReactNode;
  href?: string;
  onClick?: (e: React.MouseEvent) => void;
};

export interface BreadcrumbsProps extends React.HTMLAttributes<HTMLElement> {
  items: Crumb[];
  separator?: React.ReactNode;        // default: "/"
  ariaLabel?: string;                 // default: "Breadcrumb"
  className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items,
  separator = "/",
  ariaLabel = "Breadcrumb",
  className,
  ...rest
}) => {
  const lastIdx = items.length - 1;

  return (
    <nav className={cx("aui-breadcrumbs", className)} aria-label={ariaLabel} {...rest}>
      <ol className="aui-breadcrumbs__list">
        {items.map((item, idx) => {
          const isCurrent = idx === lastIdx;
          const key = item.id ?? String(idx);

          return (
            <li className="aui-breadcrumbs__item" key={key}>
              {isCurrent ? (
                <span className="aui-breadcrumbs__link is-current" aria-current="page" title={typeof item.label === "string" ? item.label : undefined}>
                  {item.label}
                </span>
              ) : item.href ? (
                <a
                  className="aui-breadcrumbs__link"
                  href={item.href}
                  onClick={item.onClick}
                  title={typeof item.label === "string" ? item.label : undefined}
                >
                  {item.label}
                </a>
              ) : (
                <button
                  type="button"
                  className="aui-breadcrumbs__link aui-breadcrumbs__button"
                  onClick={item.onClick}
                  title={typeof item.label === "string" ? item.label : undefined}
                >
                  {item.label}
                </button>
              )}
              {idx < lastIdx && (
                <span className="aui-breadcrumbs__sep" aria-hidden="true">{separator}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
