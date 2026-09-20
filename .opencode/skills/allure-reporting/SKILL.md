---
name: allure-reporting
description: Generar, servir e interpretar reportes Allure de la suite (activados con ALLURE_REPORT=1). Úsalo cuando se pidan evidencias, reportes o análisis de fallos de la suite.
---

# Reportes Allure

## Generar resultados

```bash
ALLURE_REPORT=1 npm run test:all
```

Escribe resultados en `allure-results/` (incluye screenshots capturados en `afterTest`).

## Servir el reporte HTML

```bash
npx allure serve allure-results
```

Abre automáticamente el navegador con el reporte (suites, gráficos, timeline, behaviors).

## Interpretar fallos

1. Abrir la suite del feature en el reporte.
2. Por cada test en rojo: leer el stack trace del step y el screenshot adjunto.
3. Clasificar el fallo: flaky (waits/estado de app), selector (accessibility id cambiado), entorno (emulador/Appium) o funcional (bug real de la app).
4. Relacionar el test con su ID `[CP-NNN]` para trazabilidad.

## Configuración

- En `wdio.conf.ts` el reporter se activa con `enableAllure` (env `ALLURE_REPORT=1`): `outputDir allure-results`, `disableWebdriverStepsReporting true`.
- La carpeta `allure-results/` no debe versionarse (ver `.gitignore`).