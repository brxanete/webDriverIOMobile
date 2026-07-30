import { $ } from '@wdio/globals'

class loginPage {

    public get screen() {
        return $('~Login-screen');
    }

    public get loginTab() {
        return $('~button-login-container');
    }

    public get signUpTab() {
        return $('~button-sign-up-container');
    }

    public get emailInput() {
        return $('~input-email');
    }

    public get passwordInput() {
        return $('~input-password');
    }

    public get repeatPasswordInput() {
        return $('~input-repeat-password');
    }

    public get loginButton() {
        return $('~button-LOGIN');
    }

    public get signUpButton() {
        return $('~button-SIGN UP');
    }

    public get biometricButton() {
        return $('~button-biometric');
    }

    async isOnScreen() {
        await this.screen.waitForDisplayed();
    }

    async tapLoginTab() {
        await this.loginTab.click();
    }

    async tapSignUpTab() {
        await this.signUpTab.click();
    }

    async enterEmail(email: string) {
        await this.emailInput.setValue(email);
    }

    async enterPassword(password: string) {
        await this.passwordInput.setValue(password);
    }

    async enterRepeatPassword(password: string) {
        await this.repeatPasswordInput.setValue(password);
    }

    async tapLoginButton() {
        await this.loginButton.click();
    }

    async tapSignUpButton() {
        await this.signUpButton.click();
    }

    async login(email: string, password: string) {
        await this.tapLoginTab();
        await this.enterEmail(email);
        await this.enterPassword(password);
        await this.tapLoginButton();
    }

    async signUp(email: string, password: string, repeatPassword: string) {
        await this.tapSignUpTab();
        await this.enterEmail(email);
        await this.enterPassword(password);
        await this.enterRepeatPassword(repeatPassword);
        await this.tapSignUpButton();
    }

    async validateElements() {
        await this.screen.waitForDisplayed();
        await this.loginTab.waitForDisplayed();
        await this.signUpTab.waitForDisplayed();
        await this.emailInput.waitForDisplayed();
        await this.passwordInput.waitForDisplayed();
    }
}

export default new loginPage();
