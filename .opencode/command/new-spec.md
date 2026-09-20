---
description: Genera un nuevo spec de Mocha y su page object siguiendo las convenciones del proyecto.
agent: build
---

Crea un nuevo par spec + page object para la feature que indique el usuario.

1. Determina un nombre en inglés camelCase (ej: `search` → `search.spec.ts` / `search.page.ts`).
2. Usa el agente `page-object-generator` para crear `features/userInterfaces/<nombre>.page.ts` con los accessibility ids reales de la pantalla (obténlos vía wdio-mcp con get_elements o Appium Inspector si no se conocen).
3. Usa el agente `test-writer` para crear `features/specs/<nombre>.spec.ts`: describe en español, navegación vía `permanentBar` en `beforeEach`, y casos `[CP-NNN]` continuando la numeración mayor existente.
4. Añade el script en `package.json`: `"test:<nombre>": "npm run wdio -- --spec ./features/specs/<nombre>.spec.ts"`.
5. Resume lo creado y qué scripts ejecutar para validarlo (con y sin Allure).

Feature: $ARGUMENTS