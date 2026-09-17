# WebDriverIO Mobile Automation Project

Suite de pruebas automatizadas E2E para Android usando **WebDriverIO 9**, **Mocha BDD**, **Appium 2** y **TypeScript**. Compatible con Windows y macOS, integrable con el **Test Explorer de VS Code**.

## Arquitectura del proyecto

```
webDriverIOMobile/
├── features/
│   ├── specs/                     # Casos de prueba Mocha (describe/it)
│   │   ├── login.spec.ts          #   Login (CP-001 al CP-008 + smoke)
│   │   ├── forms.spec.ts          #   Forms (CP-009 al CP-014 + smoke)
│   │   ├── swipe.spec.ts          #   Swipe (CP-015 al CP-018 + smoke)
│   │   ├── drag.spec.ts           #   Drag (CP-019 al CP-022 + smoke)
│   │   └── home.spec.ts           #   Home/WebView
│   └── userInterfaces/            # Page Objects (Patrón Page Object Model)
│       ├── home.page.ts           #   Home screen (~Home-screen)
│       ├── login.page.ts          #   Login/SignUp (~Login-screen)
│       ├── forms.page.ts          #   Forms (~Forms-screen)
│       ├── swipe.page.ts          #   Swipe carousel (~Swipe-screen)
│       ├── drag.page.ts           #   Drag puzzle (~Drag-drop-screen)
│       ├── permanentBar.page.ts   #   Bottom navigation bar
│       └── webView.page.ts        #   WebView
├── .vscode/
│   └── settings.json              # Config multiplataforma (OS vars)
├── DriverIO.apk                   # APK de la app bajo prueba
├── wdio.conf.ts                   # Config principal con detección OS
├── tsconfig.json                  # TypeScript: ESNext, ESM, strict
├── package.json                   # type: "module", scripts npm
└── README.md
```

### Stack tecnológico

| Componente | Versión |
|---|---|
| WebDriverIO | ~9.30 |
| Mocha (framework) | ~9.30 |
| Appium | ~2.5 |
| UIAutomator2 | ~3.5 |
| TypeScript | ~7.0 |
| Node.js | >=20 |
| Reporter | spec + allure (opcional) |

> **`@testing-library/webdriverio`** (`~3.2.1`) se mantiene como dependencia para escalabilidad futura: testes de **componentes web** (`@wdio/browser-runner`), pruebas **Web** E2E o validación de **WebViews**. La E2E nativa Android actual no lo usa; se resuelve con Page Objects y `accessibility id` (sección siguiente).

### Estrategia de localización de elementos

Todos los localizadores usan **`accessibility id`** (`~`) obtenidos del código fuente oficial de la app (`webdriverio/native-demo-app`). Son estables, independientes de idioma y no requieren XPath frágil. En iOS equivalen a `testID`.

```
$('~Login-screen')       → Login screen
$('~input-email')        → Campo email
$('~button-LOGIN')       → Botón login
$('~Drag-drop-screen')   → Drag puzzle
$('~Carousel')           → Swipe carrusel
```

La navegación se realiza desde la bottom bar usando los accessibility labels:
`~Home`, `~Webview`, `~Login`, `~Forms`, `~Swipe`, `~Drag`, `~Menu`.

---

## 1. Requisitos previos

### 1.1 En ambos sistemas

| Requisito | Versión mínima | Verificación |
|---|---|---|
| Node.js | 20.x | `node --version` |
| npm | 10.x | `npm --version` |
| JDK | 11 (17 recomendado) | `java --version` |
| Android Studio | Última stable | SDK Manager |
| Appium | 2.x | `npx appium --version` |

### 1.2 Windows (adicional)

```powershell
# Variables de entorno del sistema (System Properties > Environment Variables)
ANDROID_HOME = C:\Users\%USERNAME%\AppData\Local\Android\Sdk
ANDROID_SDK_ROOT = C:\Users\%USERNAME%\AppData\Local\Android\Sdk

# En PATH agregar:
%ANDROID_HOME%\platform-tools
%ANDROID_HOME%\emulator
%ANDROID_HOME%\cmdline-tools\latest\bin
```

VS Code config ya incluye las rutas en `terminal.integrated.env.windows`.
El `wdio.conf.ts` busca automáticamente el SDK en `LOCALAPPDATA\Android\Sdk` y `USERPROFILE\AppData\Local\Android\Sdk` si las variables no están definidas.

### 1.3 macOS (adicional)

```bash
# En ~/.zshrc o ~/.bash_profile
export ANDROID_HOME="$HOME/Library/Android/sdk"
export ANDROID_SDK_ROOT="$HOME/Library/Android/sdk"
export PATH="$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator:$ANDROID_HOME/cmdline-tools/latest/bin:$PATH"

source ~/.zshrc
```

---

## 2. Instalación

### 2.1 Dependencias del proyecto

```bash
cd C:\Repositorios\webDriverIOMobile  # Windows
# o
cd /ruta/del/proyecto                  # macOS

npm install
```

### 2.2 Driver Appium UIAutomator2

```bash
# Una sola vez después de instalar dependencias
npx appium driver install uiautomator2

# Verificar drivers instalados
npx appium driver list --installed
```

### 2.3 Verificar conectividad

```bash
# Listar dispositivos conectados
adb devices

# Si no hay emulador, crear y arrancar uno desde Android Studio
# o desde CLI:
emulator -list-avds
emulator -avd <nombre-del-avd>
```

---

## 3. Configuración técnica (wdio.conf.ts)

El archivo `wdio.conf.ts` es la columna vertebral del proyecto. A continuación se detalla cada bloque:

### 3.1 Detección automática de OS y SDK

```typescript
const candidateSdkPaths = [
    process.env.ANDROID_HOME,
    process.env.ANDROID_SDK_ROOT,
    process.env.ANDROID_SDK_PATH,
    // macOS
    process.env.HOME ? path.join(process.env.HOME, 'Library/Android/sdk') : undefined,
    // Windows
    process.env.LOCALAPPDATA ? path.join(process.env.LOCALAPPDATA, 'Android', 'Sdk') : undefined,
    process.env.USERPROFILE ? path.join(process.env.USERPROFILE, 'AppData', 'Local', 'Android', 'Sdk') : undefined,
].filter((value): value is string => Boolean(value));
```

El algoritmo:
1. Busca variables de entorno estándar (`ANDROID_HOME`, `ANDROID_SDK_ROOT`, `ANDROID_SDK_PATH`)
2. Si no existen, prueba rutas por defecto de macOS (`~/Library/Android/sdk`)
3. Si no, prueba rutas de Windows (`LOCALAPPDATA\Android\Sdk`, `USERPROFILE\AppData\Local\Android\Sdk`)
4. Si encuentra el SDK, agrega `platform-tools` y `cmdline-tools/latest/bin` al `PATH`

### 3.2 Capabilities

```typescript
capabilities: [{
    platformName: 'Android',
    'appium:platformVersion': androidPlatformVersion,   // opcional
    'appium:deviceName': androidDeviceName,              // default: 'emulator-5554'
    'appium:automationName': 'UiAutomator2',
    'appium:app': appPath,                              // DriverIO.apk
    'appium:autoGrantPermissions': true,                 // acepta permisos automáticamente
    'appium:unicodeKeyboard': true,                      // soporte caracteres especiales
    'appium:noReset': false                              // no persiste estado entre sesiones
}]
```

### 3.3 Variables de entorno configurables

| Variable | Default | Propósito |
|---|---|---|
| `ANDROID_DEVICE_NAME` | `emulator-5554` | Nombre del device/emulador |
| `ANDROID_PLATFORM_VERSION` | `''` | Versión Android (ej: `14`) |
| `APPIUM_HOST` | `127.0.0.1` | Host de Appium |
| `APPIUM_PORT` | `4724` | Puerto de Appium |
| `CI` | `false` | Modo CI (log level warn) |

### 3.4 Lifecycle hooks

```typescript
beforeEach: async () => {
    await driver.terminateApp('com.wdiodemoapp');
    await driver.activateApp('com.wdiodemoapp');
}
```

Hook (comentado en el config) que reinicia la aplicación antes de cada test. Garantiza un estado limpio y aislado entre tests, evitando efectos colaterales (ej: sesiones iniciadas). Está deshabilitado porque puede cerrar la sesión de Appium en algunos emuladores. La navegación entre pantallas se hace con `beforeEach` dentro de cada archivo de specs.

### 3.5 Mocha Options

| Opción | Valor | Propósito |
|---|---|---|
| `ui` | `bdd` | Interface `describe` / `it` de Mocha |
| `timeout` | `60000` | Timeout por test (60s) |
| `grep` | `''` | Filtro por nombre de test (regex) desde CLI |

Nota: la transpilación de TypeScript (ESM puro con `"type": "module"`) la resuelve automáticamente el CLI de WebdriverIO v9 vía `tsx`, por lo que no es necesario configurar `requireModule` ni `require`.

---

## 4. Appium Inspector

Appium Inspector es una herramienta GUI para inspeccionar elementos de la aplicación, obtener localizadores y grabar interacciones.

### 4.1 Instalación

#### Windows

```powershell
# Opción 1: Descargar el installer
# 1. Ir a https://github.com/appium/appium-inspector/releases/latest
# 2. Descargar Appium-Inspector-windows-x64.zip
# 3. Extraer y ejecutar Appium Inspector.exe

# Opción 2: Usando winget
winget install Appium.Inspector
```

#### macOS

```bash
# Opción 1: Descargar DMG desde releases
# https://github.com/appium/appium-inspector/releases/latest
# Appium-Inspector-macos-x64.dmg o Appium-Inspector-macos-arm64.dmg (Apple Silicon)

# Opción 2: Usando Homebrew
brew install --cask appium-inspector
```

### 4.2 Configuración de conexión

Con Appium corriendo, abrir Appium Inspector y configurar:

```json
{
  "appium:automationName": "UiAutomator2",
  "platformName": "Android",
  "appium:deviceName": "emulator-5554",
  "appium:app": "C:\\Repositorios\\webDriverIOMobile\\DriverIO.apk",
  "appium:autoGrantPermissions": true
}
```

**Remote Path**: `/wd/hub` (default WebDriverIO)
**Port**: `4724` (coincide con `APPIUM_PORT` del proyecto)

### 4.3 Flujo de trabajo

1. Iniciar Appium: `npx appium --port 4724`
2. Abrir Appium Inspector
3. Configurar capabilities (ver sección 4.2)
4. Click **Start Session**
5. Usar el inspector para:
   - **Select element**: Click en cualquier elemento de la UI
   - **Copy accessibility id**: Obtener el `content-desc` (equivalente a `~`)
   - **Copy XPath**: Alternativa si no hay accessibility id
6. Usar **Record** para generar snippets de código (opcional)

---

## 5. Ejecución de pruebas

### 5.1 Scripts npm

| Comando | Descripción |
|---|---|
| `npm run wdio` | Ejecuta todos los `.spec.ts` |
| `npm run test` | Ejecuta `login.spec.ts` |
| `npm run test:login` | Ejecuta `login.spec.ts` |
| `npm run test:forms` | Ejecuta `forms.spec.ts` |
| `npm run test:swipe` | Ejecuta `swipe.spec.ts` |
| `npm run test:drag` | Ejecuta `drag.spec.ts` |
| `npm run test:home` | Ejecuta `home.spec.ts` |
| `npm run test:smoke` | Ejecuta solo las validaciones visuales (grep) |
| `npm run test:all` | Ejecuta toda la suite |

### 5.2 Filtrado con Mocha grep

Con Mocha los tests se filtran por nombre (regex) con `--mochaOpts.grep`:

```bash
# Solo validaciones visuales (smoke)
npx wdio run ./wdio.conf.ts --mochaOpts.grep "Validación visual"

# Solo tests positivos (por ID de caso de prueba)
npx wdio run ./wdio.conf.ts --mochaOpts.grep "\[CP-001\]"

# Excluir una categoría (invertir el grep)
npx wdio run ./wdio.conf.ts --mochaOpts.invert --mochaOpts.grep "Arrastrar"

# Combinación de specs con filtro
npx wdio run ./wdio.conf.ts --spec ./features/specs/login.spec.ts --mochaOpts.grep "CP-003|CP-004"
```

### 5.3 Specs por separado

```bash
npx wdio run ./wdio.conf.ts --spec ./features/specs/forms.spec.ts
npx wdio run ./wdio.conf.ts --spec ./features/specs/swipe.spec.ts
npx wdio run ./wdio.conf.ts --spec ./features/specs/drag.spec.ts
```

### 5.4 Un solo test (durante desarrollo)

Dentro de un archivo de specs puedes usar `it.only(...)` para ejecutar solo ese test o `it.skip(...)` para omitirlo. También puedes filtrar por nombre desde CLI (sección 5.2).

---

## 6. Escenarios de prueba (ISTQB)

| ID | Feature | Tipo | `it()` en |
|---|---|---|---|
| CP-001 | Login | Positive login | `login.spec.ts` |
| CP-002 | Login | Positive signup | `login.spec.ts` |
| CP-003 | Login | Negative (email vacío) | `login.spec.ts` |
| CP-004 | Login | Negative (password vacía) | `login.spec.ts` |
| CP-005 | Login | Negative (ambos vacíos) | `login.spec.ts` |
| CP-006 | Login | Negative (passwords mismatch) | `login.spec.ts` |
| CP-007 | Login | Negative (email inválido) | `login.spec.ts` |
| CP-008 | Login | Edge case (alternar tabs) | `login.spec.ts` |
| CP-009 | Forms | Positive (texto) | `forms.spec.ts` |
| CP-010 | Forms | Positive (caracteres especiales) | `forms.spec.ts` |
| CP-011 | Forms | Positive (switch on/off) | `forms.spec.ts` |
| CP-012 | Forms | Positive (limpiar campo) | `forms.spec.ts` |
| CP-013 | Forms | Dropdown (3 opciones) | `forms.spec.ts` |
| CP-014 | Forms | Interacción completa | `forms.spec.ts` |
| CP-015 | Swipe | Swipe left | `swipe.spec.ts` |
| CP-016 | Swipe | Swipe right | `swipe.spec.ts` |
| CP-017 | Swipe | Navegar todas las tarjetas | `swipe.spec.ts` |
| CP-018 | Swipe | Logo visible | `swipe.spec.ts` |
| CP-019 | Drag | Pieza a zona correcta | `drag.spec.ts` |
| CP-020 | Drag | Puzzle completo | `drag.spec.ts` |
| CP-021 | Drag | Botón Renew | `drag.spec.ts` |
| CP-022 | Drag | Pieza a zona incorrecta | `drag.spec.ts` |

**Total: 31 tests en la suite**
- **Smoke visual**: 4 (una validación visual por feature: login, forms, swipe, drag)
- **Positive**: 16 (13 CP + 3 variantes del dropdown CP-013)
- **Negative**: 6 (CP-003 al CP-007 y CP-022)
- **Edge case / Boundary**: 2 (CP-008 y CP-014)
- **Home / WebView**: 3 (pantalla de inicio, cierre de anuncio, Get Started)

Los IDs `[CP-NNN]` se conservan en el nombre de cada `it()` para trazabilidad con la gestión de casos de prueba.

---

## 7. Reportes y evidencias

### 7.1 Spec reporter (consola)

Por defecto usa `['spec']` que muestra resultados en consola con detalle de tests pasados/fallidos.

### 7.2 Allure reporter (opcional)

Instalado como dependencia (`@wdio/allure-reporter`). Se activa por variable de entorno `ALLURE_REPORT=1` (por defecto los reportes usan solo `spec`):

```bash
# Ejecutar la suite generando resultados Allure en allure-results/
ALLURE_REPORT=1 npm run test:all

# Generar y visualizar el reporte HTML
npx allure serve allure-results
```

Para ver la configuración del reporter activada vía env, consulta `reporters` en `wdio.conf.ts`.

### 7.3 Capturas de pantalla

El hook `afterTest` captura automáticamente screenshots cuando un test pasa o falla.

---

## 8. Solución de problemas

### `Cannot read properties of undefined (reading 'fileExists')`

- **Causa**: Config inválida en `reporters` (ej: reporter con opciones incorrectas) o en `services`
- **Solución**: Simplificar reporters a `['spec']` y services a `['appium']`

### `Can't call click on element with selector "~Login" because element wasn't found`

- **Causa**: La app quedó en un estado posterior a un login exitoso y la bottom bar cambió
- **Solución**: Activar el hook `beforeEach` (sección 3.4) para reiniciar la app entre tests

### `Error: expect(received).toBe(expected) – Expected: true, Received: false` (Drag)

- **Causa**: La pieza no se posicionó exactamente sobre la zona esperada. El `isPieceInZone` usa distancia euclidiana < 50px
- **Solución**: Ajustar coordenadas o tolerancia en `drag.page.ts`

### `Cannot find module` al ejecutar tests `.ts`

- **Causa**: Ejecutar los tests fuera del runner de WebdriverIO (ej: con Mocha a secas)
- **Solución**: Ejecuta siempre con `wdio run ./wdio.conf.ts` (vía scripts npm o la extensión oficial de VS Code). WebdriverIO v9 transpila TS con `tsx` automáticamente

### APK no encontrado

```bash
# Verificar que DriverIO.apk existe en la raíz del proyecto
ls -la DriverIO.apk    # macOS
dir DriverIO.apk       # Windows
```

### Appium no inicia

```bash
# Verificar que el puerto no esté ocupado
npx appium --port 4724 --log-level debug
npx appium --port 4724 --use-drivers uiautomator2
```

---

## 9. VS Code y Test Explorer

### 9.1 Extensión oficial de WebdriverIO (recomendada)

Instala **WebdriverIO** desde el Visual Studio Marketplace (identificador `webdriverio.vscode-webdriverio`). Es la extensión oficial publicada por el equipo de WebdriverIO y usa las APIs de `TestController` de VS Code (≥ 1.96) para ofrecer el **Test Explorer / Testing view** nativo.

Requisitos:
- Visual Studio Code >= 1.96.0
- WebdriverIO >= v9.0.0
- Existe un archivo de config con el patrón `*wdio*.conf*.{ts,js,mjs,cjs}` en el workspace (`wdio.conf.ts` → lo detecta automáticamente)

Funcionalidades:
- **Testing view**: lista todos los tests, con estados passed / failed / skipped
- **Run / Debug** individual: el icono ▶ junto a cada `it()` ejecuta solo ese test con el runner real de WebdriverIO (Appium incluido)
- **Run all / Refresh**: botones en la barra lateral
- Soporta todos los frameworks que soporta WebdriverIO (aquí, Mocha)

> A diferencia de la extensión genérica "Mocha Test Explorer", esta extensión lanza **WebdriverIO en sí** para ejecutar el test, por lo que el `browser`, `$`, `expect` y la sesión de Appium están disponibles.

### 9.2 Estructura del archivo de specs

La extensión descubre los tests a partir de los bloques `describe` / `it` de los archivos `.spec.ts`:

```typescript
import { expect } from '@wdio/globals';
import loginPage from '../userInterfaces/login.page.ts';

describe('Login', () => {
    it('[CP-001] Inicio de sesión exitoso', async () => {
        await loginPage.enterEmail('test@example.com');
        await loginPage.tapLoginButton();
        await expect(loginPage.loginButton).not.toBeDisplayed();
    });
});
```

### 9.3 Otras extensiones recomendadas

- **GitLens** — navegación de código
- **TypeScript + JavaScript** (built-in)
- (**Opcional**) Mocha Test Explorer — solo para descubrir los tests; la ejecución de E2E debe hacerse con la extensión oficial de WebdriverIO

### 9.4 Config de terminal

El archivo `.vscode/settings.json` configura variables de entorno específicas por OS:

```json
// macOS
"terminal.integrated.env.osx": {
    "ANDROID_HOME": "${env:HOME}/Library/Android/sdk",
    "PATH": "${env:PATH}:${env:HOME}/Library/Android/sdk/platform-tools"
}

// Windows
"terminal.integrated.env.windows": {
    "ANDROID_HOME": "${env:LOCALAPPDATA}\\Android\\Sdk",
    "PATH": "${env:PATH};${env:LOCALAPPDATA}\\Android\\Sdk\\platform-tools"
}
```

---

## 10. Convenciones del proyecto

### Nomenclatura

- **Specs**: `nombre.spec.ts` (inglés, camelCase) → `login.spec.ts`, `forms.spec.ts`
- **Page objects**: `nombre.page.ts` (inglés, camelCase)
- **Describe**: feature o pantalla (ej: `describe('Login - Inicio de sesión y registro')`)
- **It**: un escenario/caso con su ID (`[CP-NNN] Descripción`)
- **IDs de caso de prueba**: `[CP-NNN]` (Caso de Prueba numerado), conservados de la versión Cucumber

### Estructura de Page Objects

Cada Page Object:
1. Declara getters para elementos usando `$('~accessibilityId')`
2. Expone métodos de interacción (`tapLogin()`, `enterEmail()`, etc.)
3. Incluye `validateElements()` para smoke test visual
4. Exporta una instancia singleton (`export default new XPage()`)

### Flujo de datos

1. `spec` → `describe` / `it` con datos hardcodeados o data providers (loop sobre un array)
2. `it()` → secuencia de pasos que llaman al Page Object
3. `page object` → interactúa con `browser`/`$` via WebdriverIO API
4. `wdio.conf.ts` → gestiona sesión Appium, hooks, reporters

No hay capa de fixtures/data factories externos; los datos se definen inline en los specs.

### Equivalencias Cucumber → Mocha

| Cucumber | Mocha |
|---|---|
| `.feature` + `step-definitions` | `.spec.ts` con `describe` / `it` |
| `Background` | `beforeEach()` |
| `Scenario Outline` + `Examples` | Loop sobre un array dentro del `describe` |
| Tag `@smoke` | Filtro `--mochaOpts.grep` |
| `Given/When/Then(...)` steps | Métodos del Page Object invocados en el `it()` |
| `beforeScenario` hook | `beforeEach` hook de wdio |

---

## 11. Automatización interactiva con WebdriverIO MCP

Además de ejecutar la suite Mocha, este proyecto puede automatizarse de forma **interactiva** desde un asistente de IA (opencode) mediante el servidor MCP de WebdriverIO (`@wdio/mcp`). Esto permite lanzar `DriverIO.apk`, tocar botones, hacer swipe y capturar evidencias con instrucciones en lenguaje natural, sin escribir specs de Mocha. Ver la guía completa en `Guia-MCP-WebdriverIO-Appium.md`.

### Arquitectura del stack

```
Asistente IA (opencode) → @wdio/mcp → WebDriverIO → Appium → Dispositivo
```

- El servidor MCP actúa de puente entre el asistente y el dispositivo.
- **Sesión única**: solo un navegador o app activa a la vez; el estado se mantiene entre llamadas.
- Las sesiones con `noReset: true` se desvinculan solas al cerrar (auto-detach).
- Los errores se devuelven como texto **sin perder el estado de la sesión**, así puedes encadenar intentos sin reiniciar.

### Configuración en opencode

El servidor se ejecuta con `npx` (sin instalación local). Para que opencode lo cargue en todos tus proyectos, agrégalo a tu config global `~/.config/opencode/opencode.jsonc`:

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "wdio-mcp": {
      "type": "local",
      "command": ["npx", "-y", "@wdio/mcp"],
      "enabled": true
    }
  }
}
```

> Reinicia opencode tras guardar la configuración y verifica la conexión con `opencode mcp list`.
> La primera descarga de `npx @wdio/mcp` puede superar los 30 s de timeout: precárgala una vez con `npx -y @wdio/mcp`.

### Conexión con Appium

El servidor MCP se conecta a Appium mediante estas variables de entorno:

| Variable | Default | Propósito |
|---|---|---|
| `APPIUM_URL` | `127.0.0.1` | Host de Appium |
| `APPIUM_URL_PORT` | `4723` | Puerto de Appium |
| `APPIUM_PATH` | `/` | Ruta base |

En este proyecto Appium suele correr en el puerto `4724`. Para que el MCP lo reutilice:

```bash
export APPIUM_URL_PORT=4724
appium --port 4724
```

### Estado listo para automatizar (checklist)

```bash
appium --version                    # 2.19.0 ✓
appium driver list --installed      # uiautomator2 ✓
adb devices                         # emulator-5554 device ✓
```

Emulador encendido + Appium corriendo + opencode con el MCP conectado = ya puedes pedirle al asistente que controle la app.

### Herramientas principales (movil)

| Herramienta | Descripción |
|---|---|
| `start_session` | Inicia una app en iOS/Android con su APK/IPA |
| `tap_element` | Toca un elemento o coordenadas |
| `swipe` | Desliza en una dirección |
| `drag_and_drop` | Arrastra y suelta |
| `get_app_state` | Comprueba el estado de la app |
| `get_contexts` / `switch_context` | Cambio nativo ↔ WebView en apps híbridas |
| `rotate_device` | Rota a vertical/horizontal |
| `set_geolocation` / `set_value` | Fija GPS / escribe texto |
| `hide_keyboard` | Oculta el teclado |
| `get_screenshot` | Captura optimizada (máx. 1 MB) |
| `get_elements` | Elementos visibles/interactuables |
| `execute_script` | Comandos móviles de Appium (`mobile: pressKey`, `deepLink`, `shell`) |

### Selectores

Prioriza siempre el **Accessibility ID** (`~`), el mismo que usa este proyecto. Es multiplataforma y el más estable.

```
~Login-screen        → Login screen   (Accessibility ID)
~input-email         → Campo email
android=new UiSelector().text("Login")   → UiAutomator (Android)
-ios predicate string:label == "Login"   → iOS Predicate
//XCUIElementTypeButton[@label="Login"]  → XPath
```

### Flujo de ejemplo con tu APK

1. Enciende emulador y Appium (checklist de arriba).
2. En opencode pide: *"Inicia la app `DriverIO.apk` en el emulador Android"* → `start_session`.
3. Interactúa: *"Toca el botón de login"* → `tap_element` · *"Escribe 'demo' en el campo email"* → `set_value` · *"Haz swipe hacia arriba"* → `swipe`.
4. Evidencia: *"Toma un screenshot"* → `get_screenshot` · *"Muéstrame los elementos visibles"* → `get_elements`.

### Buenas prácticas

- Sesión única: cierra la sesión antes de cambiar de blanco.
- Apps híbridas (nativo + WebView): lista los contextos con `get_contexts` y cambia con `switch_context`.
- El servidor consume tokens del contexto de la IA: sé selectivo con los MCPs habilitados.

### Documentación oficial

- MCP WebdriverIO: <https://webdriver.io/docs/mcp>
- Configuración: <https://webdriver.io/docs/mcp/configuration>
- Especificación MCP: <https://modelcontextprotocol.io>
- Repositorio: <https://github.com/webdriverio/mcp> · Paquete: `@wdio/mcp`
- Extensión VS Code WebdriverIO: <https://marketplace.visualstudio.com/items?itemName=webdriverio.vscode-webdriverio>