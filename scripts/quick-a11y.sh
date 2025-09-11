#!/usr/bin/env bash
set -Eeuo pipefail
PORT="${PORT:-6014}"
INTERVAL="${INTERVAL:-300}"
LOG_DIR="${LOG_DIR:-.logs}"
SB_URL="http://localhost:${PORT}"
mkdir -p "${LOG_DIR}"
section() { printf "\n==== %s — %s ====\n" "$1" "$(date -u +'%Y-%m-%dT%H:%M:%SZ')"; }
wait_for_storybook() {
  section "Waiting for Storybook at ${SB_URL}"
  for i in {1..60}; do
    if curl -sSf "${SB_URL}/iframe.html" >/dev/null 2>&1; then echo "Storybook is up."; return 0; fi
    sleep 2; printf "."
  done; echo; echo "ERROR: Storybook not available at ${SB_URL}"; exit 1
}
detect_runner_cmd() {
  if pnpm exec storybook test --help >/dev/null 2>&1; then
    echo "pnpm exec storybook test --url ${SB_URL} --watch=false --coverage=false"
  else
    echo "pnpm exec test-storybook --url ${SB_URL} --maxWorkers=50%"
  fi
}
RUNNER_CMD="$(detect_runner_cmd)"
wait_for_storybook
while true; do
  section "Typecheck (tsc --noEmit)"
  pnpm exec tsc --noEmit 2>&1 | tee -a "${LOG_DIR}/tsc.log" || true
  section "A11y scan via Storybook test runner"
  echo "Runner: ${RUNNER_CMD}"
  if ! bash -lc "${RUNNER_CMD}" 2>&1 | tee -a "${LOG_DIR}/a11y.log"; then
    echo "A11y runner reported violations or errors (see ${LOG_DIR}/a11y.log)."
  fi
  section "Sleeping ${INTERVAL}s before next run"
  sleep "${INTERVAL}"
done
