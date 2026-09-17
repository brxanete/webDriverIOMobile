import { expect } from '@wdio/globals';
import formsPage from '../userInterfaces/forms.page.ts';
import permanentBar from '../userInterfaces/permanentBar.page.ts';

const dropdownOptions = [
    'webdriver.io is awesome',
    'Appium is awesome',
    'This app is awesome'
];

describe('Forms - Interacción con elementos de formulario', () => {
    beforeEach(async () => {
        await permanentBar.goToForms();
    });

    it('Validación visual de la pantalla de Forms', async () => {
        await formsPage.validateElements();
    });

    it('[CP-009] Ingreso de texto en el campo de formulario', async () => {
        await formsPage.enterText('Hola Mundo');
        const result = await formsPage.getInputResult();
        await expect(result.length).toBeGreaterThan(0);
    });

    it('[CP-010] Ingreso de texto con caracteres especiales', async () => {
        await formsPage.enterText('Test@123!#$%&/()');
        const result = await formsPage.getInputResult();
        await expect(result.length).toBeGreaterThan(0);
    });

    it('[CP-011] Activar y desactivar el Switch', async () => {
        await formsPage.tapSwitch();
        const switchOffState = await formsPage.getSwitchText();
        await expect(switchOffState).toBe('Click to turn the switch OFF');

        await formsPage.tapSwitch();
        const switchOnState = await formsPage.getSwitchText();
        await expect(switchOnState).toBe('Click to turn the switch ON');
    });

    it('[CP-012] Limpiar campo de texto y verificar resultado', async () => {
        await formsPage.enterText('Texto temporal');
        await formsPage.clearTextInput();
        const result = await formsPage.getInputResult();
        await expect(result).toBe('');
    });

    dropdownOptions.forEach((option) => {
        it(`[CP-013] Seleccionar opción del Dropdown: ${option}`, async () => {
            await formsPage.tapDropdown();
            await formsPage.selectDropdownOption(option);
            const dropdownText = await formsPage.dropdown.getText();
            await expect(dropdownText).toContain(option);
        });
    });

    it('[CP-014] Interacción completa del formulario', async () => {
        await formsPage.enterText('Validación completa');
        await formsPage.tapSwitch();
        await formsPage.tapDropdown();
        await formsPage.selectDropdownOption('Appium is awesome');

        const result = await formsPage.getInputResult();
        await expect(result).toContain('Validación completa');

        const switchText = await formsPage.getSwitchText();
        await expect(switchText).toBe('Click to turn the switch OFF');

        const dropdownText = await formsPage.dropdown.getText();
        await expect(dropdownText).toContain('Appium is awesome');
    });
});