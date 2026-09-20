# AGENTS.md

Contexto permanente del agente para el proyecto `webDriverIOMobile` (automatización móvil QA).

## Proyecto

Suite de pruebas E2E Android con **WebDriverIO 9 + Appium 2 + Mocha (BDD) + TypeScript (ESM)**.
App bajo prueba: **WebdriverIO Demo App** (`DriverIO.apk`, paquete `com.wdiodemoapp`), ubicada en la raíz.
Ejecuta siempre desde la raíz del proyecto; nunca salgas del directorio para correr la suite.

## Comandos principales

| Comando | Descripción |
|---|---|
| `npm run wdio` | Ejecuta toda la suite (`features/specs/**/*.spec.ts`) |
| `npm run test:login\|forms\|swipe\|drag\|home` | Suite por feature |
| `npm run test:smoke` | Solo validaciones visuales (grep `Validación visual`) |
| `ALLURE_REPORT=1 npm run test:all` | Suite completa + resultados Allure en `allure-results/` |
| `npx allure serve allure-results` | Levanta el reporte HTML de Allure |
| `npx appium --port 4724` | Servidor Appium (puerto que usa `wdio.conf.ts`) |

Para el MCP de WebdriverIO: `export APPIUM_URL_PORT=4724` antes de usar las herramientas `wdio-mcp`.

## Estructura

```
features/
├── specs/                  # Casos Mocha (describe/it), nombres en español, IDs [CP-NNN]
├── userInterfaces/         # Page Objects (patrón POM), export default singleton
wdio.conf.ts                # Sesión Appium + detección automática de Android SDK
reports/                    # Salida del runner (no versionar)
allure-results/             # Resultados Allure (no versionar)
```

## Reglas de estilo

- Localizadores: **siempre** accessibility id `$('~...')`; evitar XPath salvo que no exista accessibility id.
- Page Object: getters `$('~...')`, métodos de interacción `tapX()` / `enterY()`, `validateElements()` para smoke, `export default new <Page>()`.
- Spec: `describe` en español por feature, cada `it` con ID `[CP-NNN]` y descripción en español orientada al negocio.
- Datos de prueba **inline** en el spec (no hay capa de data factories).
- Mantén el estilo del archivo que se edita: indentación 4 espacios, comillas simples.
- No agregues comentarios al código salvo que se pida explícitamente.
- Evita `browser.pause()` como wait estructural; usa `waitForDisplayed()` / `waitForExist()` / `waitForClickable()`.
- Navega entre pantallas con los métodos del `permanentBar` en el `beforeEach` del spec, no reiniciando la app.

## Automatización interactiva (MCP `wdio-mcp`)

Disponible (config global). Permite lanzar `DriverIO.apk` y tocar/swipear desde el asistente.
Requiere: emulador encendido (`adb devices` → `emulator-5554 device`) y Appium corriendo en `4724`.
Usa los mismos accessibility ids que los page objects.

## Debugging común

- Elemento `~X` no encontrado: la app quedó en estado posterior a login; reinicia la app o usa `noReset: false`.
- `Cannot read properties of undefined (reading 'fileExists')`: config de reporters/services inválida; simplifica a `reporters: ['spec']`.
- Sesión Appium cae: revisa que Appium corra en `4724` y que `adb devices` liste el emulador.
- Ver `README.md` sección 8 para el troubleshooting completo.