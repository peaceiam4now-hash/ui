#!/usr/bin/env bash
set -euo pipefail

sep() { printf "\n%s\n" "────────────────────────────────────────────────────────"; }
hdr() { sep; echo "▶ $*"; sep; }

hdr "Basic env"
echo "PWD: $(pwd)"
echo "Node: $(node -v 2>/dev/null || echo 'node not found')"
echo "PNPM: $(pnpm -v 2>/dev/null || echo 'pnpm not found')"

hdr "Git status"
git status -sb || true
git remote -v || true

hdr "Project layout (top)"
ls -la

hdr "Key directories"
for d in src src/components src/components/button src/components/tabs src/components/card stories .storybook; do
  echo "## $d"
  if [ -d "$d" ]; then ls -la "$d"; else echo "(missing)"; fi
done

hdr "package.json (scripts & deps)"
if command -v jq >/dev/null 2>&1; then
  jq '{name, version, scripts, dependencies, devDependencies}' package.json
else
  cat package.json
fi

hdr "Storybook config files"
for f in .storybook/main.ts .storybook/main.js .storybook/preview.ts .storybook/preview.js; do
  if [ -f "$f" ]; then
    echo "## $f"
    sed -n '1,160p' "$f"
  fi
done

hdr "Story discovery glob check"
# Extract 'stories' globs from main config if present
grep -R --line-number --no-messages "stories:" .storybook/* || true
grep -R --line-number --no-messages ".stories.tsx" stories || true

hdr "Token CSS presence"
for f in src/tokens/tokens.css src/styles/reset.css; do
  if [ -f "$f" ]; then
    echo "## Found $f"
    head -n 30 "$f" || true
  else
    echo "## Missing $f"
  fi
done

hdr "Components existence"
for f in \
  src/components/button/Button.tsx \
  src/components/button/Button.css \
  src/components/tabs/Tabs.tsx \
  src/components/tabs/Tabs.css \
  src/components/card/Card.tsx \
  src/components/card/Card.css
do
  if [ -f "$f" ]; then echo "OK: $f"; else echo "MISSING: $f"; fi
done

hdr "Quick exports check"
grep -nE "export (const|default) Button" src/components/button/Button.tsx 2>/dev/null || true
grep -nE "export (const|default) Tabs"   src/components/tabs/Tabs.tsx 2>/dev/null || true
grep -nE "export (const|default) Card"   src/components/card/Card.tsx 2>/dev/null || true

hdr "Search for classnames in CSS"
grep -n "aui-btn"  src/components/button/Button.css 2>/dev/null || true
grep -n "aui-tabs" src/components/tabs/Tabs.css   2>/dev/null || true
grep -n "aui-card" src/components/card/Card.css   2>/dev/null || true

hdr "Stories present"
ls stories | sort
echo
echo "Story file heads:"
for s in stories/*.stories.tsx; do
  echo "## $s"
  head -n 30 "$s"
done

hdr "TypeScript typecheck"
pnpm exec tsc --noEmit || true

hdr "Storybook cache size"
du -sh node_modules/.cache/storybook 2>/dev/null || echo "(no SB cache)"

hdr "Common Storybook v8 pitfalls quick scan"
echo "- Checking if preview imports tokens/reset:"
grep -nE 'tokens\.css|reset\.css' .storybook/preview.* || echo "  (tokens/reset not imported in preview)"
echo "- Checking main.ts stories globs:"
grep -nE 'stories.*\[(|)' .storybook/main.* 2>/dev/null || true
echo "- Checking for MDX stories (ok if none):"
ls stories/*.mdx 2>/dev/null || echo "  (no .mdx stories found — fine)"

hdr "END REPORT"
