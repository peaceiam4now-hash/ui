import * as React from "react";
import "./PaginationFooter.css";
import { cx } from "../../utils/cx";
import { Pagination } from "./Pagination";

type Size = "sm" | "md" | "lg";

export interface PaginationFooterProps extends React.HTMLAttributes<HTMLElement> {
  totalItems: number;

  // page (controlled/uncontrolled)
  page?: number;
  defaultPage?: number;
  onPageChange?: (page: number) => void;

  // page size (controlled/uncontrolled)
  pageSize?: number;
  defaultPageSize?: number;
  onPageSizeChange?: (size: number) => void;

  // UI/options
  pageSizeOptions?: number[];         // default: [10, 25, 50, 100]
  siblingCount?: number;              // to Pagination
  boundaryCount?: number;             // to Pagination
  showFirstLast?: boolean;            // default true
  showPrevNext?: boolean;             // default true
  disabled?: boolean;
  size?: Size;                        // sm | md | lg
  compact?: boolean;                  // hide label text when space-constrained
  keepPageOnSizeChange?: boolean;     // try to preserve item position across size change
  ariaLabel?: string;
  className?: string;
  rowsPerPageLabel?: string;          // default: "Rows per page"
}

function clamp(n: number, min: number, max: number) {
  return Math.min(Math.max(n, min), max);
}

export const PaginationFooter: React.FC<PaginationFooterProps> = ({
  totalItems,
  page: controlledPage,
  defaultPage = 1,
  onPageChange,
  pageSize: controlledSize,
  defaultPageSize = 10,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50, 100],
  siblingCount = 1,
  boundaryCount = 1,
  showFirstLast = true,
  showPrevNext = true,
  disabled = false,
  size = "md",
  compact = false,
  keepPageOnSizeChange = false,
  ariaLabel = "Pagination footer",
  rowsPerPageLabel = "Rows per page",
  className,
  ...rest
}) => {
  // state: page
  const isPageControlled = controlledPage !== undefined;
  const [internalPage, setInternalPage] = React.useState(defaultPage);
  const page = isPageControlled ? (controlledPage as number) : internalPage;

  // state: page size
  const isSizeControlled = controlledSize !== undefined;
  const [internalSize, setInternalSize] = React.useState(defaultPageSize);
  const pageSize = isSizeControlled ? (controlledSize as number) : internalSize;

  const totalPages = Math.max(1, Math.ceil((totalItems || 0) / Math.max(1, pageSize)));
  const currentPage = clamp(page, 1, totalPages);

  const setPage = (p: number) => {
    const next = clamp(p, 1, totalPages);
    if (!isPageControlled) setInternalPage(next);
    onPageChange?.(next);
  };

  const setSize = (sz: number) => {
    const nextSize = Math.max(1, sz);
    let nextPage = 1;

    if (keepPageOnSizeChange) {
      // try to preserve first-item index across size changes
      const firstItemIndex = (currentPage - 1) * pageSize + 1;
      nextPage = Math.floor((firstItemIndex - 1) / nextSize) + 1;
    }

    if (!isSizeControlled) setInternalSize(nextSize);
    onPageSizeChange?.(nextSize);

    // recompute pages with the new size
    const nextTotalPages = Math.max(1, Math.ceil((totalItems || 0) / nextSize));
    setPage(clamp(nextPage, 1, nextTotalPages));
  };

  const start = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const end = totalItems === 0 ? 0 : Math.min(totalItems, currentPage * pageSize);

  return (
    <footer
      className={cx("aui-pagination-footer", `aui-pagination-footer--${size}`, compact && "is-compact", className)}
      aria-label={ariaLabel}
      {...rest}
    >
      <div className="aui-pagination-footer__left">
        <label className="aui-pagination-footer__label">
          {!compact && <span>{rowsPerPageLabel}</span>}
          <select
            className="aui-pagination-footer__select"
            value={pageSize}
            onChange={(e) => setSize(parseInt(e.target.value, 10))}
            disabled={disabled}
            aria-label={rowsPerPageLabel}
          >
            {pageSizeOptions.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </label>
        <span className="aui-pagination-footer__range">
          {start.toLocaleString()}–{end.toLocaleString()} of {totalItems.toLocaleString()}
        </span>
      </div>

      <div className="aui-pagination-footer__right">
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={setPage}
          siblingCount={siblingCount}
          boundaryCount={boundaryCount}
          showFirstLast={showFirstLast}
          showPrevNext={showPrevNext}
          disabled={disabled}
          size={size}
          ariaLabel="Pagination pages"
        />
      </div>
    </footer>
  );
};

export default PaginationFooter;
