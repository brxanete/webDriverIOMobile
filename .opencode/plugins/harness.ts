import { spawnSync } from 'node:child_process'
import { type Plugin, tool } from '@opencode-ai/plugin'

const APP_PORT = '4724'
const VALID_SUITES = ['login', 'forms', 'swipe', 'drag', 'home', 'smoke', 'all'] as const

const SPEC_MAP: Record<string, string> = {
    login: './features/specs/login.spec.ts',
    forms: './features/specs/forms.spec.ts',
    swipe: './features/specs/swipe.spec.ts',
    drag: './features/specs/drag.spec.ts',
    home: './features/specs/home.spec.ts',
}

function runShell(command: string, cwd: string) {
    const res = spawnSync(command, {
        cwd,
        shell: true,
        encoding: 'utf8',
        timeout: 600000,
        maxBuffer: 10 * 1024 * 1024,
    })
    return {
        ok: res.status === 0,
        status: res.status ?? -1,
        stdout: (res.stdout as string | undefined) ?? '',
        stderr: (res.stderr as string | undefined) ?? '',
    }
}

export const qaHarness: Plugin = async ({ client }) => {
    await client.app.log({
        body: {
            service: 'qa-harness',
            level: 'info',
            message: 'Harness QA cargado (env Appium + qa_run_suite + evidencias)',
        },
    })

    return {
        'shell.env': async (_input, output) => {
            output.env.APPIUM_URL_PORT = process.env.APPIUM_URL_PORT || APP_PORT
            output.env.APPIUM_PORT = process.env.APPIUM_PORT || APP_PORT
        },

        tool: {
            qa_run_suite: tool({
                description:
                    'Ejecuta suites de pruebas de WebdriverIO del proyecto (login, forms, swipe, drag, home, smoke, all) y devuelve la salida del runner con su exit code. Opciones: grep filtra por nombre de test (regex de Mocha), allure=true genera reportes Allure. Ejecuta siempre desde el worktree del proyecto.',
                args: {
                    suite: tool.schema
                        .string()
                        .optional()
                        .describe('Nombre de la suite: login|forms|swipe|drag|home|smoke|all'),
                    grep: tool.schema
                        .string()
                        .optional()
                        .describe('Filtro regex de Mocha sobre el nombre del test (opcional)'),
                    allure: tool.schema
                        .boolean()
                        .optional()
                        .describe('true genera reportes Allure (ALLURE_REPORT=1)'),
                },
                async execute(args, context) {
                    const { worktree } = context
                    const suite = args.suite ?? 'all'
                    if (!VALID_SUITES.includes(suite as (typeof VALID_SUITES)[number])) {
                        return `Suite inválida "${suite}". Válidas: ${VALID_SUITES.join(', ')}`
                    }

                    let command: string
                    if (suite === 'all') command = 'npm run wdio'
                    else if (suite === 'smoke') command = 'npm run test:smoke'
                    else command = `npm run wdio -- --spec ${SPEC_MAP[suite]}`

                    if (args.allure) command = `ALLURE_REPORT=1 ${command}`
                    if (args.grep) command += ` --mochaOpts.grep "${args.grep.replace(/"/g, '\\"')}"`

                    const res = runShell(command, worktree)
                    const tail = (res.stdout + res.stderr).trim().slice(-4000)
                    const label = `qa_run_suite: ${suite}` + (args.grep ? ` (grep: ${args.grep})` : '')

                    return {
                        title: label,
                        output: res.ok
                            ? `SUITE ${suite} EN VERDE\n${tail}`
                            : `SUITE ${suite} FALLÓ (exit ${res.status})\n${tail}`,
                        metadata: {
                            suite,
                            grep: args.grep ?? null,
                            allure: args.allure ?? false,
                            exitCode: res.status,
                        },
                    }
                },
            }),
        },

        'tool.execute.after': async (input) => {
            if (input.tool === 'wdio-mcp_get_screenshot') {
                await client.app.log({
                    body: {
                        service: 'qa-harness',
                        level: 'info',
                        message: 'Screenshot capturado como evidencia',
                        extra: { callID: input.callID },
                    },
                })
            }
        },
    }
}

export default qaHarness