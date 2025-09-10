# Architecture

- **Vite + React + TS** for fast dev and ESM builds.
- **Tokens** in TS + CSS variables; theme via `[data-theme]`.
- **Components** isolated (css per folder), tree-shakable.
- **Stories** for playgrounds and docs; **Vitest** for unit tests.
- **No global side effects** beyond tokens/reset to maximize consumer control.
