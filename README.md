# WebDriverIO Mobile Automation Project - OpenCode Assist

Suite E2E Android con **WebdriverIO 9 + Mocha + Appium 2 + TypeScript**. **31 tests** en 5 features, ejecutable en **macOS y Windows**, con asistentes y automatizaciones de **OpenCode** en `.opencode/`.

## Stack

| Componente | Versión |
|---|---|
| WebDriverIO / Mocha | ~9.30 |
| Appium / UiAutomator2 | 2.x (2.19.0) / ~3.5 |
| TypeScript / Node.js | ~7.0 / >=20 |
| Reporter | `spec` + Allure opcional |

## Estructura

```
webDriverIOMobile/
├── features/
│   ├── specs/                  # login, forms, swipe, drag, home (.spec.ts)
│   └── userInterfaces/         # Page Objects (*.page.ts)
├── .opencode/                  # OpenCode Assist (agents, commands, skills, plugin)
├── scripts/emulator.ts         # Arranque automático del emulador
├── DriverIO.apk                # App bajo prueba (gitignored)
├── wdio.conf.ts                # Configuración WDIO + Appium + detección de OS/SDK
└── Guia-MCP-WebdriverIO-Appium.md / .pdf
```

## Requisitos

Node 20+, JDK 17, Android Studio (SDK + Platform-Tools + Emulator), al menos un AVD, Appium 2 con `uiautomator2` y `DriverIO.apk` en la raíz.

```bash
# macOS
export ANDROID_HOME="$HOME/Library/Android/sdk"
export PATH="$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator:$PATH"
```

```powershell
# Windows PowerShell
$env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"
$env:Path += ";$env:ANDROID_HOME\platform-tools;$env:ANDROID_HOME\emulator"
```

```bash
npm install
npx appium driver install uiautomator2
```

> `npm run test:*` detecta el SDK, arranca el emulador si no hay dispositivo y levanta Appium automáticamente. El APK no viaja en el clon: cópialo en la raíz.

## Ejecución

| Comando | Descripción |
|---|---|
| `npm run emulator` | Arranca el emulador y espera el boot |
| `npm run test:all` | Toda la suite (31 tests) |
| `npm run test:login` · `test:forms` · `test:swipe` · `test:drag` · `test:home` | Por feature |
| `npm run test:smoke` | Solo validaciones visuales |
| `npx wdio run ./wdio.conf.ts --spec ./features/specs/drag.spec.ts --mochaOpts.grep "CP-019"` | Spec + filtro por caso |

```bash
# Allure (macOS/Linux)
ALLURE_REPORT=1 npm run test:all
npx allure serve allure-results
```

```powershell
# Allure (Windows PowerShell)
$env:ALLURE_REPORT = "1"; npm run test:all; Remove-Item Env:ALLURE_REPORT
npx allure serve allure-results
```

Variables útiles: `ANDROID_AVD`, `EMULATOR_BOOT_TIMEOUT` (240000), `ANDROID_DEVICE_NAME`, `ANDROID_PLATFORM_VERSION`, `ALLURE_REPORT`.

## Cobertura

| Feature | Tests | Casos |
|---|---|---|
| Login | 9 | CP-001 a CP-008 + smoke |
| Forms | 9 | CP-009 a CP-014 + smoke |
| Swipe | 5 | CP-015 a CP-018 + smoke |
| Drag | 5 | CP-019 a CP-022 + smoke |
| Home | 3 | Inicio, anuncio, Get Started |
| **Total** | **31** | CP-001 a CP-022 + 5 smoke |

## OpenCode Assist (`.opencode/`)

| Componente | Qué aporta |
|---|---|
| `plugins/harness.ts` | Tool `qa_run_suite` (suite, `grep`, `allure`) y entorno Appium `4724` para MCP/suite; registra screenshots como evidencia |
| `agent/` | 4 subagentes: `appium-debugger`, `page-object-generator`, `test-writer`, `test-reviewer` |
| `command/` | 3 comandos: `/appium-check`, `/new-spec`, `/run-tests` |
| `skills/` | 4 skills: `appium-setup`, `page-object-conventions`, `istqb-test-design`, `allure-reporting` |

```text
/run-tests all
/run-tests drag CP-019
/new-spec search
/appium-check
```

> El plugin fija `APPIUM_URL_PORT` y `APPIUM_PORT` en `4724` para que MCP y suite apunten al mismo Appium. Se versionan agents, commands, skills y el plugin; `.opencode/node_modules` y sus manifiestos quedan ignorados.

## Troubleshooting rápido

| Síntoma | Solución |
|---|---|
| Emulador colgado / `invalid session id` | `adb emu kill` + `npm run emulator` |
| APK no encontrado | Copiar `DriverIO.apk` a la raíz |
| SDK no detectado en Windows | Definir `ANDROID_HOME` (ver arriba) |
| `~Carousel` no existe | Usar `~Swipe-screen` y `~card` |
| Alert de login bloquea la bottom bar | Pulsar `OK` |
| Teclado tapa la bottom bar | `hide_keyboard` / `driver.hideKeyboard()` |

## Documentación

- Guía MCP + Appium + comandos macOS/Windows: `Guia-MCP-WebdriverIO-Appium.md` y `.pdf`.
- Convenciones de specs y Page Objects: `.opencode/skills/`.
