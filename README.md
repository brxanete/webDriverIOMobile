# WebDriverIO Mobile Automation Project

Suite de pruebas automatizadas E2E para Android usando **WebDriverIO 9**, **Cucumber BDD**, **Appium 2** y **TypeScript**. Compatible con Windows y macOS.

## Arquitectura del proyecto

```
webDriverIOMobile/
├── features/
│   ├── step-definitions/          # Implementación de pasos Gherkin
│   │   ├── loginSteps.ts          #   Pasos Login (CP-001 al CP-008)
│   │   ├── formsSteps.ts          #   Pasos Forms (CP-009 al CP-014)
│   │   ├── swipeSteps.ts          #   Pasos Swipe (CP-015 al CP-018)
│   │   ├── dragSteps.ts           #   Pasos Drag (CP-019 al CP-022)
│   │   └── elementValidationStep.ts # Pasos Home/WebView
│   ├── userInterfaces/            # Page Objects (Patrón Page Object Model)
│   │   ├── home.page.ts           #   Home screen (~Home-screen)
│   │   ├── login.page.ts          #   Login/SignUp (~Login-screen)
│   │   ├── forms.page.ts          #   Forms (~Forms-screen)
│   │   ├── swipe.page.ts          #   Swipe carousel (~Swipe-screen)
│   │   ├── drag.page.ts           #   Drag puzzle (~Drag-drop-screen)
│   │   ├── permanentBar.page.ts   #   Bottom navigation bar
│   │   ├── webView.page.ts        #   WebView
│   │   └── banner.page.ts         #   Banner
│   ├── exceptions/
│   │   └── handleLoginAlerts.ts   #   Manejo de alertas (placeholder)
│   ├── login.feature              # 8 escenarios: login/signup
│   ├── forms.feature              # 6 escenarios: input, switch, dropdown
│   ├── swipe.feature              # 5 escenarios: carrusel
│   └── drag.feature               # 4 escenarios: puzzle drag & drop
├── .vscode/
│   ├── settings.json              # Config multiplataforma (OS vars)
│   └── tasks.json                 # Tareas VS Code
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
| Cucumber | ~9.30 (framework) |
| Appium | ~2.5 |
| UIAutomator2 | ~3.5 |
| TypeScript | ~7.0 |
| Node.js | >=20 |
| Reporter | spec + allure (opcional) |

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
beforeScenario: async () => {
    await driver.terminateApp('com.wdiodemoapp');
    await driver.activateApp('com.wdiodemoapp');
}
```

Este hook se ejecuta antes de cada escenario de Cucumber. Reinicia la aplicación (termina y relanza) para garantizar un estado limpio y aislado entre escenarios, evitando efectos colaterales de pruebas anteriores (ej: sesiones iniciadas, datos persistentes).

### 3.5 Cucumber Options

| Opción | Valor | Propósito |
|---|---|---|
| `require` | `./features/step-definitions/**/*.ts` | Carga automática de todos los steps |
| `requireModule` | `['tsx']` | Transpilación TypeScript en ESM |
| `timeout` | `60000` | Timeout por step (60s) |
| `tagExpression` | `''` | Filtro por tags (@smoke, @positive, etc.) |

Nota: Se usa `tsx` en lugar de `ts-node` por compatibilidad con `"type": "module"` (ESM puro).

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
| `npm run wdio` | Ejecuta todos los `.feature` |
| `npm run test` | Ejecuta `login.feature` |
| `npm run test:login` | Ejecuta `login.feature` |
| `npm run test:all` | Ejecuta toda la suite |

### 5.2 Filtrado por tags (Cucumber)

```bash
# Solo smoke tests
npx wdio run ./wdio.conf.ts --cucumberOpts.tagExpression '@smoke'

# Solo tests positivos
npx wdio run ./wdio.conf.ts --cucumberOpts.tagExpression '@positive'

# Excluir drag
npx wdio run ./wdio.conf.ts --cucumberOpts.tagExpression 'not @drag'

# Combinación
npx wdio run ./wdio.conf.ts --cucumberOpts.tagExpression '@regression and not @negative'
```

### 5.3 Features por separado

```bash
npx wdio run ./wdio.conf.ts --spec ./features/forms.feature
npx wdio run ./wdio.conf.ts --spec ./features/swipe.feature
npx wdio run ./wdio.conf.ts --spec ./features/drag.feature
```

### 5.4 Dry run (validar steps sin ejecutar)

```bash
npx wdio run ./wdio.conf.ts --cucumberOpts.dryRun=true
```

---

## 6. Escenarios de prueba (ISTQB)

| ID | Feature | Tipo | Tags |
|---|---|---|---|
| CP-001 | Login | Positive login | `@smoke @positive @login-success` |
| CP-002 | Login | Positive signup | `@positive @signup-success` |
| CP-003 | Login | Negative (email vacío) | `@negative @login-validation` |
| CP-004 | Login | Negative (password vacía) | `@negative @login-validation` |
| CP-005 | Login | Negative (ambos vacíos) | `@negative @login-validation` |
| CP-006 | Login | Negative (passwords mismatch) | `@negative @signup-validation` |
| CP-007 | Login | Negative (email inválido) | `@negative @signup-validation` |
| CP-008 | Login | Edge case (alternar tabs) | `@edge-case @boundary` |
| CP-009 | Forms | Positive (texto) | `@positive` |
| CP-010 | Forms | Positive (caracteres especiales) | `@positive` |
| CP-011 | Forms | Positive (switch on/off) | `@positive` |
| CP-012 | Forms | Positive (limpiar campo) | `@positive` |
| CP-013 | Forms | Dropdown (3 opciones) | `@positive @dropdown` |
| CP-014 | Forms | Interacción completa | `@edge-case` |
| CP-015 | Swipe | Swipe left | `@positive @carousel` |
| CP-016 | Swipe | Swipe right | `@positive @carousel` |
| CP-017 | Swipe | Navegar todas las tarjetas | `@positive @carousel` |
| CP-018 | Swipe | Logo visible | `@positive` |
| CP-019 | Drag | Pieza a zona correcta | `@positive @puzzle` |
| CP-020 | Drag | Puzzle completo | `@positive @puzzle` |
| CP-021 | Drag | Botón Renew | `@positive @reset` |
| CP-022 | Drag | Pieza a zona incorrecta | `@negative` |

**Total: 22 escenarios** distribuidos en:
- **Smoke**: 4 (una validación visual por feature)
- **Positive**: 13
- **Negative**: 5
- **Edge case / Boundary**: 2

---

## 7. Reportes y evidencias

### 7.1 Spec reporter (consola)

Por defecto usa `['spec']` que muestra resultados en consola con detalle de steps pasados/fallidos.

### 7.2 Allure reporter (opcional)

Instalado como dependencia (`@wdio/allure-reporter`). Para habilitarlo:

```typescript
// En wdio.conf.ts:
reporters: ['spec', ['allure', {
    outputDir: 'allure-results',
    disableWebdriverStepsReporting: true,
    disableWebdriverScreenshotsReporting: false
}]]
```

Genera reportes en `allure-results/`. Para visualizar:
```bash
npx allure serve allure-results
```

### 7.3 Capturas de pantalla

El hook `afterStep` captura automáticamente screenshots cuando un step pasa o falla.

---

## 8. Solución de problemas

### `Cannot read properties of undefined (reading 'fileExists')`

- **Causa**: Config inválida en `reporters` (ej: Allure con opciones incorrectas) o en `services`
- **Solución**: Simplificar reporters a `['spec']` y services a `['appium']`

### `Can't call click on element with selector "~Login" because element wasn't found`

- **Causa**: La app quedó en un estado posterior a un login exitoso y la bottom bar cambió
- **Solución**: El hook `beforeScenario` ya ejecuta `terminateApp` + `activateApp` para reiniciar la app

### `Error: expect(received).toBe(expected) – Expected: true, Received: false` (Drag)

- **Causa**: La pieza no se posicionó exactamente sobre la zona esperada. El `isPieceInZone` usa distancia euclidiana < 50px
- **Solución**: Ajustar coordenadas o tolerancia en `drag.page.ts`

### `Error: Cannot find module 'ts-node/register/transpile-only'`

- **Causa**: Usar `ts-node` en proyecto ESM (`"type": "module"`)
- **Solución**: Cambiar a `requireModule: ['tsx']` (ya configurado en el proyecto)

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

## 9. VS Code

### Extensiones recomendadas

- **Cucumber (Gherkin) Full Support** — resaltado de sintaxis .feature
- **GitLens** — navegación de código
- **TypeScript + JavaScript** (built-in)

### Tasks disponibles

| Task | Descripción |
|---|---|
| `WDIO: Run all tests` | Ejecuta toda la suite |
| `WDIO: Run login feature` | Ejecuta solo login.feature |

### Config de terminal

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

- **Feature files**: `nombre.feature` (inglés, snake_case)
- **Page objects**: `nombre.page.ts` (inglés, camelCase)
- **Step definitions**: `nombreSteps.ts` (inglés, camelCase)
- **Tags**: `@categoria` (inglés, lowercase)
- **Gherkin**: Steps en español, keywords en inglés (Given/When/Then)
- **IDs de escenario**: `[CP-NNN]` (Caso de Prueba numerado)

### Estructura de Page Objects

Cada Page Object:
1. Declara getters para elementos usando `$('~accessibilityId')`
2. Expone métodos de interacción (`tapLogin()`, `enterEmail()`, etc.)
3. Incluye `validateElements()` para smoke test visual
4. Exporta una instancia singleton (`export default new XPage()`)

### Flujo de datos

1. `feature` → escenario Gherkin con datos hardcodeados o Examples
2. `step-definition` → recibe strings, llama al Page Object
3. `page object` → interactúa con `browser`/`$` via WebdriverIO API
4. `wdio.conf.ts` → gestiona sesión Appium, hooks, reporters

No hay capa de fixtures/data factories externos; los datos se definen inline en los features (enfoque BDD puro).
