# WebDriverIO Mobile Automation Project

Este proyecto implementa pruebas automatizadas para una app Android usando WebDriverIO, Cucumber, Appium y TypeScript. Está pensado para ejecutarse en macOS con un emulador Android o un dispositivo físico compatible con UIAutomator2.

## 1. Qué incluye este proyecto

- WebDriverIO 9
- Cucumber para BDD
- Appium para la automatización móvil
- UIAutomator2 como driver de Android
- TypeScript
- Allure Reports para evidencias
- Configuración preparada para ejecutarse desde VS Code

## 2. Requisitos previos en macOS

Asegúrate de tener instalado y configurado lo siguiente:

- Node.js 20 o superior
- npm 10 o superior
- Java Development Kit (JDK) 11 o superior
- Android Studio
- Android SDK instalado en:
  - $HOME/Library/Android/sdk
- Un emulador Android en ejecución o un dispositivo físico conectado
- Appium y el driver UIAutomator2

## 3. Instalación

### 3.1 Clonar y entrar al proyecto

```bash
cd /ruta/del/proyecto
```

### 3.2 Instalar dependencias

```bash
npm install
```

### 3.3 Configurar Android SDK en macOS

Agrega estas líneas a tu archivo de perfil shell, por ejemplo .zshrc o .bash_profile:

```bash
export ANDROID_HOME="$HOME/Library/Android/sdk"
export ANDROID_SDK_ROOT="$HOME/Library/Android/sdk"
export PATH="$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator:$ANDROID_HOME/cmdline-tools/latest/bin:$PATH"
```

Guarda el archivo y recarga la terminal:

```bash
source ~/.zshrc
```

### 3.4 Verificar que Android esté disponible

```bash
adb devices
```

Si el emulador está encendido, deberías ver un dispositivo listado.

### 3.5 Iniciar un emulador si hace falta

```bash
emulator -list-avds
emulator -avd <nombre-del-emulador>
```

### 3.6 Instalar el driver de Appium

```bash
npx appium driver install uiautomator2
```

## 4. Estructura del proyecto

```text
.
├── features/
│   ├── step-definitions/
│   ├── exceptions/
│   ├── userInterfaces/
│   └── login.feature
├── .vscode/
│   ├── settings.json
│   └── tasks.json
├── DriverIO.apk
├── package.json
├── tsconfig.json
├── wdio.conf.ts
└── README.md
```

## 5. Ejecutar pruebas

### 5.1 Ejecutar toda la suite

```bash
npm run wdio
```

### 5.2 Ejecutar una feature específica

```bash
npm run wdio -- --spec ./features/login.feature
```

### 5.3 Ejecutar desde VS Code

Puedes usar las tareas configuradas en [.vscode/tasks.json](.vscode/tasks.json):

- WDIO: Run all tests
- WDIO: Run login feature

También puedes ir a la paleta de comandos con Cmd+Shift+P y buscar "Tasks: Run Task".

## 6. Configuración principal

La configuración central está en [wdio.conf.ts](wdio.conf.ts). Allí se definen:

- el host y puerto de Appium
- la capacidad del dispositivo Android
- la ruta del APK a instalar
- el framework Cucumber
- los reportes de Allure
- la detección automática del SDK Android en macOS

## 7. Reportes

Las ejecuciones generan capturas y reportes en la carpeta:

```text
allure-results/
```

Puedes abrirlos con Allure o revisar los artefactos generados por la ejecución.

## 8. Solución de problemas comunes

### Appium no inicia

Verifica que el SDK esté bien configurado:

```bash
echo $ANDROID_HOME
echo $ANDROID_SDK_ROOT
which adb
```

Si no aparecen valores, revisa el archivo de perfil shell y vuelve a cargarlo.

### Error: Neither ANDROID_HOME nor ANDROID_SDK_ROOT environment variable was exported

Esto ocurre cuando Appium no detecta el SDK. En este proyecto la configuración intenta resolverlo automáticamente, pero si sigue apareciendo, revisa tus variables de entorno y el path de Android SDK.

### El emulador no aparece en adb devices

- Verifica que el emulador está arrancado.
- Asegúrate de haber aceptado los permisos de Android Studio.
- Reinicia el emulador si hace falta.

### El APK no se encuentra

Comprueba que el archivo [DriverIO.apk](DriverIO.apk) exista en la raíz del proyecto.

### El driver UIAutomator2 falla

Instálalo o actualízalo con:

```bash
npx appium driver install uiautomator2
```

## 9. Recomendaciones

- Mantén el emulador actualizado y con espacio suficiente.
- Usa selectores robustos en tus step definitions.
- Mantén centralizada la configuración del dispositivo y del SDK.
- Si vas a ejecutar desde CI o desde otros equipos, parametriza las rutas del SDK y del dispositivo.

## 10. Notas para desarrollo en VS Code

El proyecto ya incluye configuración básica para trabajar mejor desde VS Code:

- tareas para ejecutar pruebas desde la barra de tareas
- configuración de Cucumber/feature files
- soporte para ejecutar el runner de forma directa desde el editor

Si quieres, en el siguiente paso puedo preparar también una guía de integración con el Test Explorer y extensiones de Cucumber para VS Code.
