---
name: istqb-test-design
description: Aplica técnicas de diseño de casos de prueba ISTQB (partición de equivalencia, valores límite, tablas de decisiones, transición de estados, pairwise) al escribir specs de este proyecto. Úsalo al planificar cobertura, crear nuevos bloques it() o revisar si un spec cubre bien escenarios negativos y de límite.
---

# Diseño de casos de prueba (ISTQB Foundation)

## Técnicas y cuándo usarlas

### 1. Partición de equivalencia (EP)
- Divide el dominio de entrada en clases que la app trata igual (válidas e inválidas).
- **Un caso representativo por partición** basta. No dupliques casos que caen en la misma clase.

Ejemplo (campo email de Login): válida `test@example.com`, inválida `email-invalido`, vacía `''` → 3 casos, no 30.

### 2. Análisis de valores límite (BVA)
- Prueba los **bordes** de cada partición: min−1, min, min+1, max−1, max, max+1.
- En la app demo: longitud de contraseña, inputs con `inputLength` de Forms, límites del carrusel (primera/última tarjeta), zonas del drag puzzle.

### 3. Tablas de decisiones
- Condiciones (inputs/estados) × acciones (resultados). Una fila por combinación **relevante**, no todas las combinaciones (evita explosión: usa pairwise si hay >3 condiciones).

Ejemplo (Login Sign Up): `password != repeat` → no se registra; `email inválido || password corta` → no se registra; todo válido → se registra.

### 4. Transición de estados
- Modela la app como estados: estados, transiciones (eventos), estados finales.
- Útil para flujos: Home → Login → (Login ok) → estado logueado; Drag: puzzle incompleto → completo → botón Renew.

### 5. Escenarios / casos de uso
- Flujo principal (happy path) + flujos alternativos y de excepción por cada acción de usuario.

### 6. Combinaciones por pares (pairwise)
- Con muchas condiciones de entrada, usa combinaciones por pares (herramientas: `npx pairwise`, AllPairs) en lugar de producto cartesiano.

## Mapeo a este proyecto

| Técnica | Cómo se expresa en `features/specs/*.spec.ts` |
|---|---|
| EP | Un `it()` por partición (positiva y negativa) |
| BVA | `it()` sobre la frontera (min/max ±1) con datos inline |
| Tabla de decisiones | Un `it()` por fila relevante; `describe` agrupando la tabla |
| Transición de estados | `it()` por transición; `beforeEach` lleva al estado inicial |
| Escenarios | Happy path + alternativos por pantalla |

Cada `it()` conserva `[CP-NNN]` (numeración continua) y descripción en español orientada al negocio.

## Plantilla mínima por feature

1. `Validación visual de la pantalla de X` (smoke: `validateElements()`).
2. Un happy path (positivo) representativo.
3. Un negativo por cada validación del formulario (EP inválidas).
4. BVA donde la pantalla tenga límites (longitudes, rangos, bordes de interacción).
5. Edge/estado (alternar tabs, estados límite del carrusel o puzzle).

## Checklist de cubrimiento

- [ ] Smoke visual con `validateElements()`.
- [ ] Al menos un escenario positivo.
- [ ] Un negativo por regla de negocio (válidas las no válidas explícitas).
- [ ] Límites (min/max) cubiertos donde aplique.
- [ ] Flujo alternativo o de estado cubierto (navegación, toggle, renew, etc.).
- [ ] IDs `[CP-NNN]` nuevos sin colisionar con los existentes.

## Convenciones de aserciones

- Positivo: `await expect(elemento).toBeDisplayed()` / `toHaveText()`/`toHaveValue()`.
- Negativo: assert que el estado NO cambia (ej: `toHaveText()` del mensaje de error, o el botón sigue visible).