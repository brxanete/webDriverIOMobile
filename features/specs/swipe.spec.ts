import { expect } from '@wdio/globals';
import swipePage from '../userInterfaces/swipe.page.ts';
import permanentBar from '../userInterfaces/permanentBar.page.ts';

describe('Swipe - Navegación por carrusel', () => {
    beforeEach(async () => {
        await permanentBar.goToSwipe();
    });

    it('Validación visual de la pantalla de Swipe', async () => {
        await swipePage.validateElements();
    });

    it('[CP-015] Deslizar el carrusel hacia la izquierda', async () => {
        await swipePage.swipeLeft();
        const description = await swipePage.getActiveCardDescription();
        await expect(description.length).toBeGreaterThan(0);
    });

    it('[CP-016] Deslizar el carrusel hacia la derecha', async () => {
        await swipePage.swipeLeft();
        await swipePage.swipeRight();
        const description = await swipePage.getActiveCardDescription();
        await expect(description.length).toBeGreaterThan(0);
    });

    it('[CP-017] Navegar por todas las tarjetas del carrusel', async () => {
        await swipePage.swipeLeft();
        await swipePage.swipeLeft();
        const description = await swipePage.getActiveCardDescription();
        await expect(description.length).toBeGreaterThan(0);
    });

    it('[CP-018] Verificar que el logo de WebdriverIO está visible', async () => {
        const isVisible = await swipePage.isLogoVisible();
        await expect(isVisible).toBe(true);
    });
});