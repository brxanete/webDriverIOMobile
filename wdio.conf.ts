import * as fs from 'fs';
import * as path from 'path';

const projectRoot = process.cwd();
const appPath = path.resolve(projectRoot, 'DriverIO.apk');
const androidDeviceName = process.env.ANDROID_DEVICE_NAME || 'emulator-5554';
const androidPlatformVersion = process.env.ANDROID_PLATFORM_VERSION || '';
const appiumHost = process.env.APPIUM_HOST || '127.0.0.1';
const appiumPort = Number(process.env.APPIUM_PORT || 4724);
const isCI = Boolean(process.env.CI);

const candidateSdkPaths = [
    process.env.ANDROID_HOME,
    process.env.ANDROID_SDK_ROOT,
    process.env.ANDROID_SDK_PATH,
    process.env.HOME ? path.join(process.env.HOME, 'Library/Android/sdk') : undefined,
    process.env.HOME ? path.join(process.env.HOME, 'android-sdk') : undefined,
    process.env.LOCALAPPDATA ? path.join(process.env.LOCALAPPDATA, 'Android', 'Sdk') : undefined,
    process.env.USERPROFILE ? path.join(process.env.USERPROFILE, 'AppData', 'Local', 'Android', 'Sdk') : undefined,
].filter((value): value is string => Boolean(value));

const detectedSdkPath = candidateSdkPaths.find((sdkPath) => fs.existsSync(sdkPath));

if (detectedSdkPath) {
    if (!process.env.ANDROID_HOME) {
        process.env.ANDROID_HOME = detectedSdkPath;
    }
    if (!process.env.ANDROID_SDK_ROOT) {
        process.env.ANDROID_SDK_ROOT = detectedSdkPath;
    }

    const platformToolsPath = path.join(detectedSdkPath, 'platform-tools');
    const cmdlineToolsPath = path.join(detectedSdkPath, 'cmdline-tools', 'latest', 'bin');
    const extraPaths = [platformToolsPath, cmdlineToolsPath].filter((entry) => fs.existsSync(entry));

    if (extraPaths.length > 0) {
        const currentPath = process.env.PATH || '';
        const mergedPath = [currentPath, ...extraPaths]
            .filter(Boolean)
            .join(path.delimiter);

        process.env.PATH = mergedPath;
    }
}

const detectedOs = process.platform;
console.log(`--- Inicializando configuración para ${detectedOs === 'darwin' ? 'macOS' : detectedOs === 'win32' ? 'Windows' : detectedOs} ---`);
if (detectedSdkPath) {
    console.log(`✓ Android SDK detectado en: ${detectedSdkPath}`);
} else {
    console.log('⚠ Android SDK no detectado. Define ANDROID_HOME como variable de entorno.');
}

console.log('Configurando los reporters...');
export const config = {
    runner: 'local',
    hostname: appiumHost,
    port: appiumPort,

    // Do not terminate and reactivate the app before every scenario.
    // This can close the Appium session unexpectedly on some Android emulators.
    // beforeScenario: async () => {
    //     await driver.terminateApp('com.wdiodemoapp');
    //     await driver.activateApp('com.wdiodemoapp');
    // },

    specs: [
        './features/**/*.feature'
    ],

    exclude: [],

    maxInstances: 1,

    capabilities: [{
        platformName: 'Android',
        ...(androidPlatformVersion ? { 'appium:platformVersion': androidPlatformVersion } : {}),
        'appium:deviceName': androidDeviceName,
        'appium:automationName': 'UiAutomator2',
        'appium:app': appPath,
        'appium:autoGrantPermissions': true,
        'appium:unicodeKeyboard': true,
        'appium:noReset': false
    }],

    logLevel: isCI ? 'warn' : 'info',

    bail: 0,

    waitforTimeout: 10000,

    connectionRetryTimeout: 120000,

    connectionRetryCount: 3,

    services: ['appium'],

    outputDir: './reports',

    specFileRetries: 0,

    specFileRetriesDelay: 0,

    framework: 'cucumber',

    reporters: ['spec'],

    cucumberOpts: {
        require: ['./features/step-definitions/**/*.ts'],
        requireModule: ['tsx'],
        backtrace: false,
        dryRun: false,
        failFast: false,
        name: [],
        snippets: true,
        source: true,
        strict: false,
        tagExpression: '',
        timeout: 60000,
        ignoreUndefinedDefinitions: false
    },
}
