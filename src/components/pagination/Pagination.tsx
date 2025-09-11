import * as React from "react";
import "./Pagination.css";
import { cx } from "../../utils/cx";

type Size = "sm" | "md" | "lg";

export interface PaginationProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onChange'> {
  count: number;                    // total pages (>= 1)
  page?: number;                    // controlled page
  defaultPage?: number;             // uncontrolled start page
  onChange?: (page: number) => void;
  siblingCount?: number;            // pages adjacent to current (default 1)
  boundaryCount?: number;           // pages at the start & end (default 1)
  showFirstLast?: boolean;          // show « and » (default true)
  showPrevNext?: boolean;           // show ‹ and › (default true)
  disabled?: boolean;               // disable all controls
  size?: Size;                      // sm | md | lg
  ariaLabel?: string;               // nav label
  className?: string;
}

type Item = number | "dots";

function range(start: number, end: number): number[] {
  const out: number[] = [];
  for (let i = start; i <= end; i++) out.push(i);
  return out;
}

function clamp(n: number, min: number, max: number) {
  return Math.min(Math.max(n, min), max);
}

function getItems(count: number, page: number, sibling = 1, boundary = 1): Item[] {
  // Inspired by MUI's pagination logic
  const startPages = range(1, Math.min(boundary, count));
  const endPages = range(Math.max(count - boundary + 1, boundary + 1), count);

  const siblingsStart = clamp(page - sibling, boundary + 2, count - boundary - (sibling * 2) - 1);
  const siblingsEnd = Math.max(
    Math.min(page + sibling, count - boundary - 1),
    siblingsStart + sibling * 2
  );

  const items: Item[] = [
    ...startPages,
    ...(siblingsStart > boundary + 2 ? ["dots"] as Item[] : (boundary + 1 < count - boundary ? [boundary + 1] : [])),
    ...range(siblingsStart, siblingsEnd),
    ...(siblingsEnd < count - boundary - 1 ? ["dots"] as Item[] : (count - boundary > boundary ? [count - boundary] : [])),
    ...endPages,
  ];

  // De-dup & keep order
  const seen = new Set<string>();
  return items.filter((i) => {
    const k = String(i);
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

export const Pagination: React.FC<PaginationProps> = ({
  count,
  page: controlled,
  defaultPage = 1,
  onChange,
  siblingCount = 1,
  boundaryCount = 1,
  showFirstLast = true,
  showPrevNext = true,
  disabled = false,
  size = "md",
  ariaLabel = "Pagination",
  className,
  ...rest
}) => {
  const isControlled = controlled !== undefined;
  const [uncontrolled, setUncontrolled] = React.useState(defaultPage);
  const page = clamp(isControlled ? (controlled as number) : uncontrolled, 1, Math.max(1, count));

  const setPage = (p: number) => {
    const next = clamp(p, 1, Math.max(1, count));
    if (!isControlled) setUncontrolled(next);
    onChange?.(next);
  };

  if (count <= 1) {
    // Nothing to paginate, but keep nav for a11y consistency if desired
    return (
      <nav className={cx("aui-pagination", `aui-pagination--${size}`, className)} aria-label={ariaLabel} {...rest} />
    );
  }

  const items = getItems(count, page, siblingCount, boundaryCount);

  const goFirst = () => setPage(1);
  const goPrev  = () => setPage(page - 1);
  const goNext  = () => setPage(page + 1);
  const goLast  = () => setPage(count);

  return (
    <nav className={cx("aui-pagination", `aui-pagination--${size}`, className)} aria-label={ariaLabel} {...rest}>
      <ul className="aui-pagination__list">
        {showFirstLast && (
          <li>
            <button
              type="button"
              className="aui-pagination__btn aui-pagination__icon"
              onClick={goFirst}
              disabled={disabled || page === 1}
              aria-label="First page"
            >
              «
            </button>
          </li>
        )}

        {showPrevNext && (
          <li>
            <button
              type="button"
              className="aui-pagination__btn aui-pagination__icon"
              onClick={goPrev}
              disabled={disabled || page === 1}
              aria-label="Previous page"
            >
              ‹
            </button>
          </li>
        )}

        {items.map((it, idx) => {
          if (it === "dots") {
            return (
              <li key={`d${idx}`} aria-hidden="true">
                <span className="aui-pagination__dots">…</span>
              </li>
            );
          }
          const p = it as number;
          const isCurrent = p === page;
          return (
            <li key={p}>
              <button
                type="button"
                className={cx("aui-pagination__btn", isCurrent && "is-current")}
                aria-current={isCurrent ? "page" : undefined}
                aria-label={`Page ${p}`}
                onClick={() => setPage(p)}
                disabled={disabled || isCurrent}
              >
                {p}
              </button>
            </li>
          );
        })}

        {showPrevNext && (
          <li>
            <button
              type="button"
              className="aui-pagination__btn aui-pagination__icon"
              onClick={goNext}
              disabled={disabled || page === count}
              aria-label="Next page"
            >
              ›
            </button>
          </li>
        )}

        {showFirstLast && (
          <li>
            <button
              type="button"
              className="aui-pagination__btn aui-pagination__icon"
              onClick={goLast}
              disabled={disabled || page === count}
              aria-label="Last page"
            >
              »
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Pagination;
