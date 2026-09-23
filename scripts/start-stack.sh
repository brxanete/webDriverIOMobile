#!/usr/bin/env bash
# Arranca el emulador (si falta) y Appium en el puerto del proyecto.
# Uso: bash scripts/start-stack.sh
set -uo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
APP_PORT="${APPIUM_PORT:-4724}"
DEVICE_NAME="${ANDROID_DEVICE_NAME:-emulator-5554}"
OUT_DIR="$ROOT/reports"
mkdir -p "$OUT_DIR"

cd "$ROOT" || exit 1

# 1) Emulador
if adb devices 2>/dev/null | grep -qE "^${DEVICE_NAME}[[:space:]]+device$"; then
    echo "[OK] Emulador $DEVICE_NAME ya está encendido."
else
    echo "[..] $DEVICE_NAME no conectado. Buscando AVD disponible..."
    EMU_BIN="${ANDROID_HOME:-}/emulator/emulator"
    [ ! -x "$EMU_BIN" ] && EMU_BIN="$(command -v emulator || true)"
    if [ -z "$EMU_BIN" ]; then
        echo "[FAIL] 'emulator' no está en PATH. Agrega \$ANDROID_HOME/emulator al PATH o abre Android Studio."
        exit 1
    fi
    AVD="$("$EMU_BIN" -list-avds 2>/dev/null | head -n1)"
    if [ -z "$AVD" ]; then
        echo "[FAIL] No hay AVDs creados. Crea uno en Android Studio (Device Manager)."
        exit 1
    fi
    echo "[..] Arrancando AVD '$AVD' en segundo plano (log: reports/emulator.log)..."
    nohup "$EMU_BIN" -avd "$AVD" -no-snapshot-load -no-boot-anim >"$OUT_DIR/emulator.log" 2>&1 &
    echo "[..] Esperando que adb detecte el dispositivo (puede tardar)..."
    adb wait-for-device
    echo "[OK] Emulador en boot. Verifica con: adb devices | bash scripts/healthcheck.sh"
fi

# 2) Appium
if curl -sf -o /dev/null "http://127.0.0.1:${APP_PORT}/status" 2>/dev/null; then
    echo "[OK] Appium ya responde en :$APP_PORT (no se relanza)."
else
    APP=$(command -v appium || printf '%s' "$ROOT/node_modules/.bin/appium")
    if [ -x "$ROOT/node_modules/.bin/appium" ]; then
        APP="$ROOT/node_modules/.bin/appium"
    fi
    if [ -z "$APP" ] || [ ! -x "$APP" ]; then
        echo "[FAIL] appium no instalado localmente. Corre 'npm install'."
        exit 1
    fi
    LOG="$OUT_DIR/appium-$APP_PORT.log"
    echo "[..] Levantando Appium en :$APP_PORT (log: reports/appium-$APP_PORT.log)..."
    nohup "$APP" --port "$APP_PORT" >"$LOG" 2>&1 &
    sleep 4
    if curl -sf -o /dev/null "http://127.0.0.1:${APP_PORT}/status" 2>/dev/null; then
        echo "[OK] Appium corriendo en :$APP_PORT."
    else
        echo "[FAIL] Appium no levantó en :$APP_PORT. Revisa $LOG"
        tail -n 20 "$LOG"
        exit 1
    fi
fi

echo
echo "Stack listo. Ejecuta la suite: npm run test:login (o bash scripts/healthcheck.sh)"