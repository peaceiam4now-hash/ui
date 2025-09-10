# Accessibility (WCAG 2.2)

- Keyboard: Tab/Shift+Tab through controls; Esc closes `Modal`; `role="switch"` and `aria-checked` on `Switch`.
- Focus ring tokens; `:focus-visible` only.
- Associations: `label[for]` + `id`, `aria-describedby` for hint+error.
- Motion: respect `prefers-reduced-motion`.
- Tooltip: `role="tooltip"` + `aria-describedby` on trigger; appears on focus and hover.
