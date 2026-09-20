---
name: page-object-conventions
description: Convenciones para crear y mantener Page Objects de WebdriverIO/Appium en este proyecto. Úsalo al crear, editar o revisar archivos features/userInterfaces/*.page.ts, o al agregar localizadores.
---

# Convenciones de Page Objects

## Reglas

1. Cada pantalla tiene un archivo `features/userInterfaces/<nombre>.page.ts`.
2. Getters para cada elemento usando accessibility id:

   ```ts
   public get emailInput() {
       return $('~input-email');
   }
   ```

3. Métodos de interacción async con nombre camelCase en inglés: `tapLoginButton()`, `enterEmail(texto)`.
4. `isOnScreen()` hace `await this.screen.waitForDisplayed()`.
5. `validateElements()` espera los elementos clave (para el smoke visual).
6. Export singleton: `export default new loginPage();`
7. Preferir accessibility id (`~`) sobre XPath; la native-demo-app expone los ids oficiales.

## Selectores conocidos de la app (extracto)

- Pantallas: `~Login-screen`, `~Forms-screen`, `~Swipe-screen`, `~Drag-drop-screen`, `~Home-screen`
- Bottom bar: `~Home`, `~Webview`, `~Login`, `~Forms`, `~Swipe`, `~Drag`, `~Menu`
- Navegación: métodos del `permanentBar` (`goToLogin()`, `goToForms()`, `goToSwipe()`, `goToDrag()`, `goToHome()`)

## Anti-patterns

- No usar `browser.pause()` como wait estructural; usar `waitForDisplayed` / `waitForExist` con timeout explícito.
- No repetir selectores mágicos en el spec; encapsularlos en el page object.
- No añadir comentarios salvo que se pidan explícitamente.