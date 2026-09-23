#!/usr/bin/env bash
# Puerta de calidad: typecheck + healthcheck + smoke visual (opcional).
# Uso: bash scripts/verify.sh [--smoke]
set -uo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT" || exit 1

fail() { printf '\033[31m[%s]\033[0m %s\n' "FAIL" "$1"; exit 1; }

echo "[1/3] Typecheck (tsc --noEmit)..."
if ! npx tsc --noEmit; then
    fail "Errores de tipos"
fi
echo "[OK] TypeScript válido."
echo

echo "[2/3] Healthcheck del stack..."
if ! bash scripts/healthcheck.sh; then
    fail "Stack no listo. Ejecuta scripts/start-stack.sh"
fi
echo

if [ "${1:-}" = "--smoke" ]; then
    echo "[3/3] Smoke visual (test:smoke)..."
    if ! npm run test:smoke; then
        fail "El smoke visual falló"
    fi
    echo "[OK] Suites smoke en verde."
else
    echo "[3/3] Saltando smoke visual (usa 'bash scripts/verify.sh --smoke' para ejecutarlo)."
fi

echo
printf '\033[32mVerify completo. Código y stack en buen estado.\033[0m\n'