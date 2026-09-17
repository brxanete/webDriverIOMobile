import { expect } from '@wdio/globals';
import loginPage from '../userInterfaces/login.page.ts';
import permanentBar from '../userInterfaces/permanentBar.page.ts';

describe('Login - Inicio de sesión y registro', () => {
    beforeEach(async () => {
        await permanentBar.goToLogin();
    });

    it('Validación visual de la pantalla de Login', async () => {
        await loginPage.validateElements();
    });

    it('[CP-001] Inicio de sesión exitoso con credenciales válidas', async () => {
        await loginPage.enterEmail('test@example.com');
        await loginPage.enterPassword('Password123');
        await loginPage.tapLoginButton();
        await expect(loginPage.loginButton).not.toBeDisplayed();
    });

    it('[CP-002] Registro exitoso con datos válidos', async () => {
        await loginPage.tapSignUpTab();
        await loginPage.enterEmail('newuser@test.com');
        await loginPage.enterPassword('SecurePass1');
        await loginPage.enterRepeatPassword('SecurePass1');
        await loginPage.tapSignUpButton();
        await expect(loginPage.signUpButton).not.toBeDisplayed();
    });

    it('[CP-003] Inicio de sesión con email vacío', async () => {
        await loginPage.enterEmail('');
        await loginPage.enterPassword('Password123');
        await loginPage.tapLoginButton();
        await browser.pause(500);
    });

    it('[CP-004] Inicio de sesión con contraseña vacía', async () => {
        await loginPage.enterEmail('test@example.com');
        await loginPage.enterPassword('');
        await loginPage.tapLoginButton();
        await browser.pause(500);
    });

    it('[CP-005] Inicio de sesión con email y contraseña vacíos', async () => {
        await loginPage.enterEmail('');
        await loginPage.enterPassword('');
        await loginPage.tapLoginButton();
        await browser.pause(500);
    });

    it('[CP-006] Registro con contraseñas que no coinciden', async () => {
        await loginPage.tapSignUpTab();
        await loginPage.enterEmail('test@example.com');
        await loginPage.enterPassword('Password1');
        await loginPage.enterRepeatPassword('Different1');
        await loginPage.tapSignUpButton();
        await browser.pause(500);
    });

    it('[CP-007] Registro con email inválido', async () => {
        await loginPage.tapSignUpTab();
        await loginPage.enterEmail('email-invalido');
        await loginPage.enterPassword('Password1');
        await loginPage.enterRepeatPassword('Password1');
        await loginPage.tapSignUpButton();
        await browser.pause(500);
    });

    it('[CP-008] Alternar entre pestañas Login y Sign Up', async () => {
        await loginPage.tapSignUpTab();
        await expect(loginPage.repeatPasswordInput).toBeDisplayed();
        await loginPage.tapLoginTab();
        await expect(loginPage.emailInput).toBeDisplayed();
        await expect(loginPage.passwordInput).toBeDisplayed();
        await expect(loginPage.repeatPasswordInput).not.toBeDisplayed();
    });
});