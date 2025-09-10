import * as React from "react";
import "./Navbar.css";
import { cx } from "../../utils/cx";

type Position = "static" | "sticky" | "fixed";
type Scheme = "light" | "dark";

export type NavSubItem = {
  id?: string;
  label: React.ReactNode;
  href?: string;
  onClick?: (e: React.MouseEvent) => void;
  disabled?: boolean;
  description?: React.ReactNode;
  icon?: React.ReactNode;
};

export type NavGroup = {
  id?: string;
  title: React.ReactNode;
  items: NavSubItem[];
};

export type NavItem = {
  id?: string;
  label: React.ReactNode;
  href?: string;
  onClick?: (e: React.MouseEvent) => void;
  active?: boolean;
  disabled?: boolean;
  /** simple submenu items OR grouped sections for mega menu */
  children?: Array<NavSubItem | NavGroup>;
  /** force mega layout; auto when any child is a group */
  mega?: boolean;
  /** preferred column count (mega) */
  columns?: number;
};

export interface NavbarProps extends React.HTMLAttributes<HTMLElement> {
  brand?: React.ReactNode;
  items?: NavItem[];
  actions?: React.ReactNode;
  position?: Position;        // default: sticky
  transparent?: boolean;      // background transparent
  colorScheme?: Scheme;       // light | dark
  elevateOnScroll?: boolean;  // adds shadow once scrolled
  breakpointPx?: number;      // collapse width, default 768
  containerWidth?: number;    // max content width in px (0 = fluid)

  /** NEW: force desktop layout regardless of viewport (handy for Storybook) */
  forceDesktop?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  brand,
  items = [],
  actions,
  position = "sticky",
  transparent = false,
  colorScheme = "light",
  elevateOnScroll = true,
  breakpointPx = 768,
  containerWidth = 1200,
  forceDesktop = false,
  className,
  ...rest
}) => {
  const [open, setOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const [openDropdown, setOpenDropdown] = React.useState<number | null>(null);
  const [isDesktop, setIsDesktop] = React.useState<boolean>(() =>
    typeof window !== "undefined" ? window.innerWidth >= breakpointPx : true
  );
  const isDesktopUI = forceDesktop || isDesktop;

  const controlsId = React.useId();
  const ctrlId = `aui-nav-controls-${controlsId}`;

  // Close menu on wider screens
  React.useEffect(() => {
    const onResize = () => {
      const desktop = window.innerWidth >= breakpointPx;
      setIsDesktop(desktop);
      if (desktop || forceDesktop) setOpen(false);
      if (!desktop && !forceDesktop) setOpenDropdown(null);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [breakpointPx, forceDesktop]);

  // Esc closes mobile panel
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [open]);

  // Elevate on scroll
  React.useEffect(() => {
    if (!elevateOnScroll) return;
    const onScroll = () => setScrolled(window.scrollY > 0);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [elevateOnScroll]);

  // Click outside closes dropdown
  const rootRef = React.useRef<HTMLElement | null>(null);
  React.useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) setOpenDropdown(null);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const rootClasses = cx(
    "aui-navbar",
    `aui-navbar--${colorScheme}`,
    position !== "static" && `is-${position}`,
    transparent && "is-transparent",
    elevateOnScroll && scrolled && "is-elevated",
    forceDesktop && "is-forced-desktop",
    className
  );

  const onItemClick = (it: NavItem) => (e: React.MouseEvent) => {
    if (it.disabled) { e.preventDefault(); return; }
    it.onClick?.(e);
    setOpen(false);
    setOpenDropdown(null);
  };

  return (
    <header
      className={rootClasses}
      ref={rootRef}
      style={{
        ["--aui-navbar-breakpoint" as any]: `${breakpointPx}px`,
        ["--aui-navbar-maxw" as any]: containerWidth ? `${containerWidth}px` : "100%"
      }}
      {...rest}
    >
      <div className="aui-navbar__inner">
        <div className="aui-navbar__brand">{brand}</div>

        <nav className="aui-navbar__nav" aria-label="Primary">
          <ul className="aui-navbar__list">
            {items.map((it, idx) => {
              const key = it.id ?? String(idx);
              const classNames = cx("aui-navbar__link", it.active && "is-active", it.disabled && "is-disabled");
              const hasChildren = !!(it.children && it.children.length);
              const hasGroups = !!(it.children && it.children.some((c: any) => c && "items" in (c as any)));
              const isMega = !!(it.mega || hasGroups);

              // Trigger element
              const Trigger = () => {
                if (hasChildren && isDesktopUI) {
                  return (
                    <button
                      type="button"
                      className={cx(classNames, "has-dropdown", isMega && "is-mega")}
                      aria-haspopup="menu"
                      aria-expanded={openDropdown === idx}
                      onClick={() => setOpenDropdown(openDropdown === idx ? null : idx)}
                      onMouseEnter={() => setOpenDropdown(idx)}
                      onKeyDown={(e) => {
                        if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
                          e.preventDefault(); setOpenDropdown(idx);
                        }
                        if (e.key === "Escape") setOpenDropdown(null);
                      }}
                    >
                      {it.label}
                      <span className={cx("aui-navbar__caret", openDropdown === idx && "is-open")} aria-hidden="true">▾</span>
                    </button>
                  );
                }
                if (it.href) {
                  return (
                    <a
                      className={classNames}
                      href={it.href}
                      onClick={onItemClick(it)}
                      aria-current={it.active ? "page" : undefined}
                      aria-disabled={it.disabled || undefined}
                    >
                      {it.label}
                    </a>
                  );
                }
                return (
                  <button
                    type="button"
                    className={classNames}
                    onClick={onItemClick(it)}
                    disabled={it.disabled}
                    aria-current={it.active ? "page" : undefined}
                  >
                    {it.label}
                  </button>
                );
              };

              return (
                <li
                  key={key}
                  className={cx("aui-navbar__item", hasChildren && "has-children", isMega && "has-mega")}
                  onMouseLeave={() => { if (isDesktopUI) setOpenDropdown((cur) => (cur === idx ? null : cur)); }}
                >
                  <Trigger />
                  {hasChildren && isDesktopUI && (
                    <NavbarDropdown
                      open={openDropdown === idx}
                      onClose={() => setOpenDropdown(null)}
                      items={it.children!}
                      isMega={isMega}
                      columns={it.columns}
                      parentIndex={idx}
                      onItemClick={onItemClick}
                      scheme={colorScheme}
                    />
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="aui-navbar__actions">{actions}</div>

        <button
          type="button"
          className="aui-navbar__toggle"
          aria-controls={ctrlId}
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen(o => !o)}
        >
          <span aria-hidden="true" className={cx("aui-navbar__burger", open && "is-open")} />
        </button>
      </div>

      {/* Mobile panel */}
      <div
        id={ctrlId}
        className={cx("aui-navbar__mobile", open && "is-open")}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile menu"
        onClick={() => setOpen(false)}
      >
        <div className="aui-navbar__mobile-panel" onClick={(e) => e.stopPropagation()}>
          <ul className="aui-navbar__mobile-list">
            {items.map((it, idx) => {
              const key = it.id ?? String(idx);
              const classNames = cx("aui-navbar__mobile-link", it.active && "is-active", it.disabled && "is-disabled");
              const hasChildren = !!(it.children && it.children.length);
              const hasGroups = !!(it.children && it.children.some((c: any) => c && "items" in (c as any)));
              return (
                <li key={key}>
                  {it.href ? (
                    <a className={classNames} href={it.href} onClick={onItemClick(it)} aria-current={it.active ? "page" : undefined}>
                      {it.label}
                    </a>
                  ) : (
                    <button type="button" className={classNames} onClick={onItemClick(it)} disabled={it.disabled}>
                      {it.label}
                    </button>
                  )}

                  {/* simple children */}
                  {hasChildren && !hasGroups && (
                    <ul className="aui-navbar__mobile-sublist">
                      {it.children!.map((sub: any, sidx: number) => {
                        const skey = sub.id ?? `${key}-${sidx}`;
                        return (
                          <li key={skey}>
                            {sub.href ? (
                              <a className="aui-navbar__mobile-sublink" href={sub.href} onClick={(e) => { onItemClick(sub as any)(e); }}>
                                <span className="aui-navbar__submenu-label">{sub.label}</span>
                                {sub.description && <small className="aui-navbar__submenu-desc">{sub.description}</small>}
                              </a>
                            ) : (
                              <button type="button" className="aui-navbar__mobile-sublink" onClick={(e) => { onItemClick(sub as any)(e); }} disabled={sub.disabled}>
                                <span className="aui-navbar__submenu-label">{sub.label}</span>
                                {sub.description && <small className="aui-navbar__submenu-desc">{sub.description}</small>}
                              </button>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  )}

                  {/* grouped children (mega) */}
                  {hasChildren && hasGroups && (
                    <ul className="aui-navbar__mobile-sublist">
                      {(it.children as any[]).map((grp: any, gidx: number) => {
                        const gkey = grp.id ?? `${key}-g${gidx}`;
                        return (
                          <li key={gkey}>
                            {"items" in grp ? (
                              <div className="aui-navbar__mobile-group">
                                <div className="aui-navbar__mobile-group-title">{grp.title}</div>
                                <ul className="aui-navbar__mobile-sublist">
                                  {grp.items.map((sub: any, sidx: number) => {
                                    const skey = sub.id ?? `${gkey}-${sidx}`;
                                    return (
                                      <li key={skey}>
                                        {sub.href ? (
                                          <a className="aui-navbar__mobile-sublink" href={sub.href} onClick={(e) => { onItemClick(sub as any)(e); }}>
                                            <span className="aui-navbar__submenu-label">{sub.label}</span>
                                            {sub.description && <small className="aui-navbar__submenu-desc">{sub.description}</small>}
                                          </a>
                                        ) : (
                                          <button type="button" className="aui-navbar__mobile-sublink" onClick={(e) => { onItemClick(sub as any)(e); }} disabled={sub.disabled}>
                                            <span className="aui-navbar__submenu-label">{sub.label}</span>
                                            {sub.description && <small className="aui-navbar__submenu-desc">{sub.description}</small>}
                                          </button>
                                        )}
                                      </li>
                                    );
                                  })}
                                </ul>
                              </div>
                            ) : null}
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
          {actions && <div className="aui-navbar__mobile-actions">{actions}</div>}
        </div>
      </div>
    </header>
  );
};

export default Navbar;

/* ---------- Dropdown internals ---------- */
interface DropdownProps {
  open: boolean;
  onClose: () => void;
  items: NonNullable<NavItem["children"]>;
  isMega: boolean;
  columns?: number;
  parentIndex: number;
  onItemClick: (it: NavItem) => (e: React.MouseEvent) => void;
  scheme: Scheme;
}

const isGroup = (x: any): x is NavGroup => x && Array.isArray((x as any).items);

const NavbarDropdown: React.FC<DropdownProps> = ({
  open, onClose, items, isMega, columns, parentIndex, onItemClick, scheme
}) => {
  const menuRef = React.useRef<HTMLUListElement | null>(null);
  const itemsRef = React.useRef<Array<HTMLButtonElement | HTMLAnchorElement | null>>([]);

  React.useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => {
      const first = itemsRef.current.find(Boolean);
      (first as any)?.focus?.();
    }, 0);
    return () => clearTimeout(t);
  }, [open]);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (open && e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const onMenuKeyDown = (e: React.KeyboardEvent) => {
    const enabled = itemsRef.current.filter(Boolean) as Array<HTMLElement>;
    if (!enabled.length) return;
    const idx = enabled.findIndex((el) => el === document.activeElement);
    const step = (d: number) => {
      e.preventDefault();
      const next = (idx + d + enabled.length) % enabled.length;
      enabled[next]?.focus();
    };
    switch (e.key) {
      case "ArrowDown": step(1); break;
      case "ArrowUp": step(-1); break;
      case "Home": e.preventDefault(); enabled[0]?.focus(); break;
      case "End": e.preventDefault(); enabled[enabled.length - 1]?.focus(); break;
    }
  };

  if (!isMega) {
    return (
      <div className={cx("aui-navbar__dropdown", open && "is-open", scheme === "dark" && "is-dark")} onMouseLeave={onClose}>
        <ul role="menu" aria-label="submenu" className="aui-navbar__dropdown-panel" ref={menuRef} onKeyDown={onMenuKeyDown}>
          {items.map((sub: any, i: number) => {
            if (isGroup(sub)) return null;
            const key = sub.id ?? `${parentIndex}-${i}`;
            const common = {
              ref: (el: any) => (itemsRef.current[i] = el),
              role: "menuitem" as const,
              className: cx("aui-navbar__dropdown-item", sub.disabled && "is-disabled"),
              onClick: (e: any) => { if (sub.disabled) { e.preventDefault(); return; } onItemClick(sub as any)(e); onClose(); },
            };
            return (
              <li key={key}>
                {sub.href ? (
                  <a {...common} href={sub.href}>
                    {sub.icon && <span className="aui-navbar__submenu-icon" aria-hidden="true">{sub.icon}</span>}
                    <span className="aui-navbar__submenu-label">{sub.label}</span>
                    {sub.description && <small className="aui-navbar__submenu-desc">{sub.description}</small>}
                  </a>
                ) : (
                  <button {...common} type="button" disabled={sub.disabled}>
                    {sub.icon && <span className="aui-navbar__submenu-icon" aria-hidden="true">{sub.icon}</span>}
                    <span className="aui-navbar__submenu-label">{sub.label}</span>
                    {sub.description && <small className="aui-navbar__submenu-desc">{sub.description}</small>}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  const groups = (items as any[]).filter(isGroup) as NavGroup[];
  const cols = Math.min(4, Math.max(1, (columns ?? (groups.length || 3))));

  return (
    <div className={cx("aui-navbar__dropdown", "aui-navbar__dropdown--mega", open && "is-open", scheme === "dark" && "is-dark")} onMouseLeave={onClose}>
      <div className="aui-navbar__dropdown-panel aui-navbar__dropdown-panel--mega" style={{ gridTemplateColumns: `repeat(${cols}, minmax(180px, 1fr))` }}>
        {groups.map((grp, gi) => (
          <div className="aui-navbar__mega-col" key={grp.id ?? gi}>
            <div className="aui-navbar__mega-heading">{grp.title}</div>
            <ul role="menu" aria-label={`${grp.title}`} className="aui-navbar__mega-list" onKeyDown={onMenuKeyDown}>
              {grp.items.map((sub, si) => {
                const flatIndex = groups.slice(0, gi).reduce((acc, g) => acc + g.items.length, 0) + si;
                const key = sub.id ?? `${gi}-${si}`;
                const common = {
                  ref: (el: any) => (itemsRef.current[flatIndex] = el),
                  role: "menuitem" as const,
                  className: cx("aui-navbar__dropdown-item", sub.disabled && "is-disabled"),
                  onClick: (e: any) => { if (sub.disabled) { e.preventDefault(); return; } onItemClick(sub as any)(e); onClose(); },
                };
                return (
                  <li key={key}>
                    {sub.href ? (
                      <a {...common} href={sub.href}>
                        {sub.icon && <span className="aui-navbar__submenu-icon" aria-hidden="true">{sub.icon}</span>}
                        <span className="aui-navbar__submenu-label">{sub.label}</span>
                        {sub.description && <small className="aui-navbar__submenu-desc">{sub.description}</small>}
                      </a>
                    ) : (
                      <button {...common} type="button" disabled={sub.disabled}>
                        {sub.icon && <span className="aui-navbar__submenu-icon" aria-hidden="true">{sub.icon}</span>}
                        <span className="aui-navbar__submenu-label">{sub.label}</span>
                        {sub.description && <small className="aui-navbar__submenu-desc">{sub.description}</small>}
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};
