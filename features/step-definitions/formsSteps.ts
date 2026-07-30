import { Given, When, Then } from '@wdio/cucumber-framework';
import { expect } from '@wdio/globals';
import formsPage from '../userInterfaces/forms.page.ts';

Given(/^El usuario navega a la pantalla de Forms$/, async () => {
    const permanentBar = (await import('../userInterfaces/permanentBar.page.ts')).default;
    await permanentBar.goToForms();
});

Then(/^La pantalla de Forms debe mostrar todos los elementos$/, async () => {
    await formsPage.validateElements();
});

When(/^El usuario ingresa "([^"]*)" en el campo de texto$/, async (text: string) => {
    await formsPage.enterText(text);
});

When(/^El usuario limpia el campo de texto$/, async () => {
    await formsPage.clearTextInput();
});

When(/^El usuario presiona el Switch$/, async () => {
    await formsPage.tapSwitch();
});

When(/^El usuario presiona el Switch nuevamente$/, async () => {
    await formsPage.tapSwitch();
});

When(/^El usuario selecciona "([^"]*)" del Dropdown$/, async (option: string) => {
    await formsPage.tapDropdown();
    await formsPage.selectDropdownOption(option);
});

Then(/^El texto ingresado debe mostrarse en el resultado$/, async () => {
    const result = await formsPage.getInputResult();
    await expect(result.length).toBeGreaterThan(0);
});

Then(/^El texto "([^"]*)" debe mostrarse en el resultado$/, async (expectedText: string) => {
    const result = await formsPage.getInputResult();
    await expect(result).toContain(expectedText);
});

Then(/^El estado del Switch debe cambiar a "([^"]*)"$/, async (expectedState: string) => {
    const switchText = await formsPage.getSwitchText();
    await expect(switchText).toBe(expectedState);
});

Then(/^El campo de texto debe estar vacío$/, async () => {
    const result = await formsPage.getInputResult();
    await expect(result).toBe('');
});

Then(/^La opción "([^"]*)" debe estar seleccionada en el Dropdown$/, async (expectedOption: string) => {
    const dropdownText = await formsPage.dropdown.getText();
    await expect(dropdownText).toContain(expectedOption);
});
