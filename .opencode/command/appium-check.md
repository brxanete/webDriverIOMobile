---
description: Verifica el estado del stack de automatización (adb, Appium, driver, APK) y opcionalmente inicia sesión MCP con la app.
agent: build
---

Revisa que el stack esté listo para automatizar:

1. `adb devices` — comprueba que el emulador esté encendido (busca `emulator-5554` como `device`).
2. `npx appium --version` y `npx appium driver list --installed` — Appium 2.x con `uiautomator2` instalado.
3. `ls DriverIO.apk` — que el APK exista en la raíz.
4. Si algo falla, usa el agente `appium-debugger` para diagnosticarlo.
5. Si todo está OK y el usuario lo pide, vía `wdio-mcp` lanza `start_session` con la app `DriverIO.apk` (appiumConfig port 4724, automationName UiAutomator2) y confirma el estado de la pantalla.

Argumentos: $ARGUMENTS