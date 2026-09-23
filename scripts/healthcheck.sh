#!/usr/bin/env bash
# Verifica que el stack de automatización esté listo para correr la suite.
# Uso: bash scripts/healthcheck.sh
set -uo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
APP_PORT="${APPIUM_PORT:-4724}"
DEVICE_NAME="${ANDROID_DEVICE_NAME:-emulator-5554}"
FAIL=0

say()  { printf '\033[1m%-26s\033[0m %s\n' "$1" "${2:-}"; }
ok()   { printf '\033[32m  OK\033[0m %s\n' "$1"; }
fail() { printf '\033[31m FAIL\033[0m %s\n' "$1"; FAIL=1; }

cd "$ROOT" || exit 1

say "Stack WebdriverIO/Appium" "$(pwd)"
echo "  Appium: $APP_PORT | Device: $DEVICE_NAME"
echo

# 1) APK presente
say "APK bajo prueba"
if [ -f "$ROOT/DriverIO.apk" ]; then
    ok "DriverIO.apk en la raíz"
else
    fail "DriverIO.apk no encontrado en la raíz"
fi

# 2) Emulador conectado
say "Dispositivo ($DEVICE_NAME)"
if command -v adb >/dev/null 2>&1; then
    if adb devices | grep -qE "^${DEVICE_NAME}[[:space:]]+device$"; then
        ok "$DEVICE_NAME conectado"
    else
        fail "$DEVICE_NAME no está en 'adb devices'; encender emulador o usar start-stack.sh"
    fi
else
    fail "adb no está en PATH (revisa ANDROID_HOME/platform-tools)"
fi

# 3) Appium respondiendo en el puerto
say "Appium en :$APP_PORT"
if curl -sf -o /dev/null "http://127.0.0.1:${APP_PORT}/status" 2>/dev/null; then
    ok "Appium responde en :$APP_PORT"
else
    fail "Appium no responde en :$APP_PORT (correr 'npx appium --port $APP_PORT' o start-stack.sh)"
fi

# 4) Driver uiautomator2 instalado
say "Driver uiautomator2"
APPIUM_BIN="$ROOT/node_modules/.bin/appium"
if [ -x "$APPIUM_BIN" ]; then
    if "$APPIUM_BIN" driver list --installed 2>&1 | grep -q uiautomator2; then
        ok "uiautomator2 instalado"
    else
        fail "uiautomator2 no instalado ('npx appium driver install uiautomator2')"
    fi
else
    fail "appium no instalado localmente (correr 'npm install')"
fi

echo
if [ "$FAIL" -eq 0 ]; then
    printf '\033[32mStack listo para ejecutar la suite.\033[0m\n'
    exit 0
else
    printf '\033[31mStack incompleto. Corrige los puntos fallidos o usa scripts/start-stack.sh\033[0m\n'
    exit 1
fi