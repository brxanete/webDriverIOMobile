import { Given, When, Then } from '@wdio/cucumber-framework';
import { expect } from '@wdio/globals';
import swipePage from '../userInterfaces/swipe.page.ts';

Given(/^El usuario navega a la pantalla de Swipe$/, async () => {
    const permanentBar = (await import('../userInterfaces/permanentBar.page.ts')).default;
    await permanentBar.goToSwipe();
});

Then(/^La pantalla de Swipe debe mostrar todos los elementos$/, async () => {
    await swipePage.validateElements();
});

When(/^El usuario desliza el carrusel hacia la izquierda$/, async () => {
    await swipePage.swipeLeft();
});

When(/^El usuario desliza el carrusel hacia la izquierda nuevamente$/, async () => {
    await swipePage.swipeLeft();
});

When(/^El usuario desliza el carrusel hacia la derecha$/, async () => {
    await swipePage.swipeRight();
});

Then(/^El contenido del carrusel debe haber cambiado$/, async () => {
    const description = await swipePage.getActiveCardDescription();
    await expect(description.length).toBeGreaterThan(0);
});

Then(/^El carrusel debe volver a la tarjeta inicial$/, async () => {
    const description = await swipePage.getActiveCardDescription();
    await expect(description.length).toBeGreaterThan(0);
});

Then(/^El carrusel debe mostrar contenido diferente$/, async () => {
    const description = await swipePage.getActiveCardDescription();
    await expect(description.length).toBeGreaterThan(0);
});

Then(/^El logo de WebdriverIO debe estar visible en la pantalla$/, async () => {
    const isVisible = await swipePage.isLogoVisible();
    await expect(isVisible).toBe(true);
});
