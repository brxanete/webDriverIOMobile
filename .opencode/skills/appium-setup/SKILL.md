---
name: appium-setup
description: Cómo levantar y verificar el stack Appium 2 + Android emulator + WebdriverIO y conectar el MCP de WebdriverIO. Úsalo al configurar, iniciar o diagnosticar la ejecución local de la suite.
---

# Stack local (Appium 2 + UiAutomator2 + emulador)

## Checklist antes de ejecutar

1. Emulador: `adb devices` → `emulator-5554 device`
2. Appium: `npx appium --port 4724` (el `wdio.conf.ts` lee `APPIUM_PORT`, default 4724)
3. Driver: `npx appium driver list --installed` → debe incluir `uiautomator2`
4. APK: `DriverIO.apk` en la raíz

## Variables de entorno

| Variable | Default | Notas |
|---|---|---|
| `APPIUM_PORT` | 4724 | puerto que usa `wdio.conf.ts` y Appium |
| `APPIUM_URL_PORT` | 4723 | puerto que usa `wdio-mcp` |
| `ANDROID_DEVICE_NAME` | emulator-5554 | dispositivo destino |
| `ANDROID_PLATFORM_VERSION` | '' | versión de Android |
| `ALLURE_REPORT` | 0 | 1 = generar allure-results |

Para el MCP (wdio-mcp) usar el puerto 4724: `export APPIUM_URL_PORT=4724` y arrancar `npx appium --port 4724`.

## Capabilities del proyecto

`platformName Android` · `appium:automationName UiAutomator2` · `appium:app ./DriverIO.apk` · `autoGrantPermissions true` · `unicodeKeyboard true` · `noReset false`

## Troubleshooting rápido

- Puerto ocupado: `lsof -i :4724` (macOS) y relanzar Appium en 4724.
- SDK no detectado: setear `ANDROID_HOME` (macOS: `~/Library/Android/sdk`; Windows: `%LOCALAPPDATA%\Android\Sdk`).
- Sesión que cae tras el primer test: revisar `noReset` y el hook `beforeEach` comentado en `wdio.conf.ts`.