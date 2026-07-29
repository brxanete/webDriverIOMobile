# WebDriverIO Mobile Automation Project

Este proyecto implementa pruebas de automatización para aplicaciones móviles Android utilizando WebDriverIO, Cucumber y Appium. La suite está diseñada para ejecutarse sobre un emulador Android o un dispositivo físico compatible con UIAutomator2.

## 1. Descripción general

El proyecto está estructurado para ejecutar escenarios BDD con Cucumber y validar flujos de navegación y elementos visuales dentro de una aplicación Android. El stack principal incluye:

- WebDriverIO v8
- Cucumber
- Appium
- UIAutomator2
- TypeScript
- Allure Reports

## 2. Requisitos previos

Antes de instalar y ejecutar el proyecto, asegúrate de tener lo siguiente instalado y configurado:

- Node.js 20 LTS o superior
- npm 10 o superior
- Java Development Kit (JDK) 11 o superior
- Android Studio instalado
- Android SDK configurado
- Un emulador Android en ejecución o un dispositivo físico conectado
- Acceso a internet para descargar dependencias y drivers

> Se recomienda usar una versión estable de Android Studio y mantener actualizados los componentes del SDK Platform Tools y Android Emulator.

## 3. Estructura del proyecto

```text
.
├── features/
│   ├── step-definitions/
│   ├── exceptions/
│   ├── userInterfaces/
│   └── login.feature
├── DriverIO.apk
├── package.json
├── tsconfig.json
├── wdio.conf.ts
└── README.md
```

## 4. Instalación

### 4.1 macOS

1. Clona el repositorio y entra a la carpeta del proyecto:

```bash
cd /ruta/del/proyecto
```

2. Instala las dependencias de Node.js:

```bash
npm install
```

3. Configura las variables de entorno de Android:

```bash
export ANDROID_HOME="$HOME/Library/Android/sdk"
export PATH="$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator:$PATH"
```

4. Verifica que el emulador o dispositivo esté disponible:

```bash
adb devices
```

Si todo está bien, deberías ver una lista que incluya tu emulador o dispositivo conectado.

5. Inicia un emulador Android si aún no está encendido:

```bash
emulator -list-avds
emulator -avd <nombre-del-emulador>
```

6. Instala el driver de Appium para Android si es necesario:

```bash
npx appium driver install uiautomator2
```

7. Ejecuta la prueba:

```bash
npx wdio run ./wdio.conf.ts --spec ./features/login.feature
```

### 4.2 Windows

1. Abre una terminal en la carpeta del proyecto.

2. Instala las dependencias:

```powershell
npm install
```

3. Configura las variables de entorno de Android en tu sistema:

- Variable: ANDROID_HOME
- Valor: C:\Users\TuUsuario\AppData\Local\Android\Sdk

Agrega también a PATH:

```text
%ANDROID_HOME%\platform-tools
%ANDROID_HOME%\emulator
```

4. Cierra y vuelve a abrir la terminal para aplicar los cambios.

5. Verifica el dispositivo:

```powershell
adb devices
```

6. Inicia el emulador desde Android Studio o desde la terminal:

```powershell
emulator -list-avds
emulator -avd <nombre-del-emulador>
```

7. Ejecuta la prueba:

```powershell
npx wdio run ./wdio.conf.ts --spec ./features/login.feature
```

### 4.3 Linux

1. Entra al directorio del proyecto:

```bash
cd /ruta/del/proyecto
```

2. Instala las dependencias:

```bash
npm install
```

3. Configura Android SDK en tu shell:

```bash
export ANDROID_HOME="$HOME/Android/Sdk"
export PATH="$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator:$PATH"
```

4. Verifica que el emulador o dispositivo esté disponible:

```bash
adb devices
```

5. Inicia el emulador:

```bash
emulator -list-avds
emulator -avd <nombre-del-emulador>
```

6. Ejecuta la prueba:

```bash
npx wdio run ./wdio.conf.ts --spec ./features/login.feature
```

## 5. Ejecución de pruebas

### Ejecutar una feature específica

```bash
npx wdio run ./wdio.conf.ts --spec ./features/login.feature
```

### Ejecutar todas las features disponibles

```bash
npx wdio run ./wdio.conf.ts
```

## 6. Configuración principal

La configuración del runner se encuentra en [wdio.conf.ts](wdio.conf.ts). Allí se definen:

- el puerto de Appium
- la capacidad del dispositivo Android
- el archivo APK a instalar
- el framework de pruebas Cucumber
- los reportes de ejecución

El archivo de prueba principal se encuentra en [features/login.feature](features/login.feature), y las definiciones de pasos en [features/step-definitions/elementValidationStep.ts](features/step-definitions/elementValidationStep.ts).

## 7. Solución de problemas comunes

### Appium no responde

Asegúrate de que el puerto 4723 esté libre y que Appium esté disponible. Puedes comprobarlo con:

```bash
lsof -i :4723
```

### El emulador no aparece en adb devices

- Verifica que el emulador esté encendido.
- Asegúrate de haber aceptado los permisos de Android Studio.
- Intenta reiniciar el emulador.

### El APK no se encuentra

Comprueba que el archivo [DriverIO.apk](DriverIO.apk) exista en la raíz del proyecto.

### Error de driver UIAutomator2

Instala o actualiza el driver con:

```bash
npx appium driver install uiautomator2
```

## 8. Recomendaciones de uso

- Mantén el emulador en buen estado y con suficiente almacenamiento.
- Usa una versión de Android compatible con la aplicación objetivo.
- Si trabajas con varios dispositivos, define el nombre del dispositivo correctamente en la configuración o mediante variables de entorno.
- Para entornos de CI, se recomienda parametrizar la configuración del dispositivo y las rutas del SDK.

## 9. Contribución

Si deseas extender o mejorar este proyecto, se recomienda:

1. Mantener los pasos BDD claros y legibles.
2. Usar selectores robustos y estables.
3. Mantener la configuración centralizada.
4. Añadir validaciones que faciliten el diagnóstico en caso de fallo.

---

Este proyecto está preparado para ejecutarse localmente con un entorno Android funcional y una configuración mínima de Appium. Si necesitas, también puedo preparar una versión de este README orientada a CI/CD, Docker o ejecución en GitHub Actions.
