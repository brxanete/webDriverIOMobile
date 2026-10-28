import { execFile, spawn, type ChildProcess } from 'node:child_process';
import { existsSync } from 'node:fs';
import * as path from 'node:path';
import { pathToFileURL } from 'node:url';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
const isWindows = process.platform === 'win32';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function resolveSdkPath(): string | undefined {
    const candidates = [
        process.env.ANDROID_HOME,
        process.env.ANDROID_SDK_ROOT,
        process.env.ANDROID_SDK_PATH,
        process.env.HOME ? path.join(process.env.HOME, 'Library/Android/sdk') : undefined,
        process.env.HOME ? path.join(process.env.HOME, 'android-sdk') : undefined,
        process.env.LOCALAPPDATA ? path.join(process.env.LOCALAPPDATA, 'Android', 'Sdk') : undefined,
        process.env.USERPROFILE ? path.join(process.env.USERPROFILE, 'AppData', 'Local', 'Android', 'Sdk') : undefined,
    ].filter((value): value is string => Boolean(value));

    return candidates.find((candidate) => existsSync(candidate));
}

function executable(dir: string, name: string): string {
    return path.join(dir, isWindows ? `${name}.exe` : name);
}

async function run(bin: string, args: string[], timeoutMs = 30000): Promise<string> {
    const { stdout } = await execFileAsync(bin, args, {
        timeout: timeoutMs,
        windowsHide: true,
        maxBuffer: 1024 * 1024,
    });
    return stdout.trim();
}

async function listConnectedDevices(adb: string): Promise<string[]> {
    const output = await run(adb, ['devices']);
    return output
        .split(/\r?\n/)
        .slice(1)
        .map((line) => line.trim())
        .filter((line) => /\s+device$/.test(line))
        .map((line) => line.split(/\s+/)[0]);
}

async function isBootCompleted(adb: string, serial: string): Promise<boolean> {
    try {
        const output = await run(adb, ['-s', serial, 'shell', 'getprop', 'sys.boot_completed'], 15000);
        return output.trim() === '1';
    } catch {
        return false;
    }
}

async function listAvds(emulator: string): Promise<string[]> {
    const output = await run(emulator, ['-list-avds']);
    return output
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean);
}

/**
 * Garantiza que haya un dispositivo Android disponible. Si no hay ninguno
 * conectado, arranca el AVD indicado y espera a que termine el boot.
 * Devuelve el serial del dispositivo listo para usar (ej: emulator-5554).
 */
export async function ensureEmulatorRunning(): Promise<string> {
    const sdk = resolveSdkPath();
    if (!sdk) {
        throw new Error('Android SDK no encontrado. Define ANDROID_HOME o ANDROID_SDK_ROOT.');
    }

    const adb = executable(path.join(sdk, 'platform-tools'), 'adb');
    const emulator = executable(path.join(sdk, 'emulator'), 'emulator');

    if (!existsSync(adb)) {
        throw new Error(`adb no encontrado en ${adb}. Instala Android SDK Platform-Tools.`);
    }
    if (!existsSync(emulator)) {
        throw new Error(`Emulador no encontrado en ${emulator}. Instálalo desde el SDK Manager.`);
    }

    const connected = await listConnectedDevices(adb);
    if (connected.length > 0) {
        console.log(`✓ Dispositivo Android ya conectado: ${connected.join(', ')}`);
        return connected[0];
    }

    const avds = await listAvds(emulator);
    if (avds.length === 0) {
        throw new Error('No hay AVDs creados. Crea uno en Android Studio (Device Manager) o con avdmanager.');
    }

    const avd = process.env.ANDROID_AVD || avds[0];
    if (!avds.includes(avd)) {
        throw new Error(`El AVD "${avd}" no existe. Disponibles: ${avds.join(', ')}`);
    }

    console.log(`▶ Iniciando emulador "${avd}"...`);
    const child: ChildProcess = spawn(emulator, ['-avd', avd, '-no-snapshot-save'], {
        detached: true,
        stdio: 'ignore',
        windowsHide: true,
    });
    child.unref();

    const timeoutMs = Number(process.env.EMULATOR_BOOT_TIMEOUT || 240000);
    const startedAt = Date.now();

    while (Date.now() - startedAt < timeoutMs) {
        const devices = await listConnectedDevices(adb);
        const serial = devices[0];
        if (serial && (await isBootCompleted(adb, serial))) {
            console.log(`✓ Emulador listo: ${serial}`);
            return serial;
        }
        await sleep(3000);
    }

    throw new Error(`Timeout (${timeoutMs} ms) esperando el arranque del emulador "${avd}".`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
    ensureEmulatorRunning().catch((error) => {
        console.error(`✖ ${error instanceof Error ? error.message : error}`);
        process.exit(1);
    });
}