---
description: Ejecuta suites de prueba del proyecto (login, forms, swipe, drag, home, smoke, all) o con filtro grep de Mocha.
agent: build
---

Ejecuta la suite de pruebas de WebdriverIO del proyecto.

- Sin argumento: pregunta qué suite correr o ejecuta `npm run test:all`.
- Mapeo de argumentos: login → `test:login`, forms → `test:forms`, swipe → `test:swipe`, drag → `test:drag`, home → `test:home`, smoke → `test:smoke`, all → `test:all`.
- Si el usuario añade texto extra, trátalo como filtro grep de Mocha. Ejemplo: `/run-tests login CP-003` → `npx wdio run ./wdio.conf.ts --spec ./features/specs/login.spec.ts --mochaOpts.grep "CP-003"`.
- Si se pide con evidencias: antecede `ALLURE_REPORT=1` a `npm run test:*`.

Argumentos: $ARGUMENTS