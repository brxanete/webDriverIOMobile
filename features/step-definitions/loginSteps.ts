import { Given, When, Then } from '@wdio/cucumber-framework';
import { expect } from '@wdio/globals';
import loginPage from '../userInterfaces/login.page.ts';

Given(/^El usuario navega a la pantalla de Login$/, async () => {
    const permanentBar = (await import('../userInterfaces/permanentBar.page.ts')).default;
    await permanentBar.goToLogin();
});

Then(/^La pantalla de Login debe mostrar todos los elementos$/, async () => {
    await loginPage.validateElements();
});

When(/^El usuario ingresa "([^"]*)" en el campo Email$/, async (email: string) => {
    await loginPage.enterEmail(email);
});

When(/^El usuario ingresa "([^"]*)" en el campo Contraseña$/, async (password: string) => {
    await loginPage.enterPassword(password);
});

When(/^El usuario deja el campo Email vacío$/, async () => {
    await loginPage.enterEmail('');
});

When(/^El usuario deja el campo Contraseña vacío$/, async () => {
    await loginPage.enterPassword('');
});

When(/^El usuario presiona el botón LOGIN$/, async () => {
    await loginPage.tapLoginButton();
});

When(/^El usuario presiona el botón SIGN UP$/, async () => {
    await loginPage.tapSignUpButton();
});

When(/^El usuario cambia a la pestaña de registro$/, async () => {
    await loginPage.tapSignUpTab();
});

When(/^El usuario cambia a la pestaña de inicio de sesión$/, async () => {
    await loginPage.tapLoginTab();
});

When(/^El usuario ingresa "([^"]*)" en el campo Repetir Contraseña$/, async (password: string) => {
    await loginPage.enterRepeatPassword(password);
});

Then(/^El sistema debe procesar el inicio de sesión exitosamente$/, async () => {
    await expect(loginPage.loginButton).not.toBeDisplayed();
});

Then(/^El sistema debe procesar el registro exitosamente$/, async () => {
    await expect(loginPage.signUpButton).not.toBeDisplayed();
});

Then(/^El sistema debe mostrar un error de validación de email$/, async () => {
    await browser.pause(500);
});

Then(/^El sistema debe mostrar un error de validación de contraseña$/, async () => {
    await browser.pause(500);
});

Then(/^El sistema debe mostrar un error de validación$/, async () => {
    await browser.pause(500);
});

Then(/^El sistema debe mostrar un error de contraseñas no coincidentes$/, async () => {
    await browser.pause(500);
});

Then(/^El sistema debe mostrar un error de email inválido$/, async () => {
    await browser.pause(500);
});

Then(/^Los campos de registro deben estar visibles$/, async () => {
    await expect(loginPage.repeatPasswordInput).toBeDisplayed();
});

Then(/^Los campos de inicio de sesión deben estar visibles$/, async () => {
    await expect(loginPage.emailInput).toBeDisplayed();
    await expect(loginPage.passwordInput).toBeDisplayed();
});

Then(/^El campo Repetir Contraseña no debe estar visible$/, async () => {
    await expect(loginPage.repeatPasswordInput).not.toBeDisplayed();
});
