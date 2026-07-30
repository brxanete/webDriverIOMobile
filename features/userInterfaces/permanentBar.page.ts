import { $ } from '@wdio/globals'

class permanentBarPage {

    public get homeButton() {
        return $('~Home');
    }

    public get webviewButton() {
        return $('~Webview');
    }

    public get loginButton() {
        return $('~Login');
    }

    public get formsButton() {
        return $('~Forms');
    }

    public get swipeButton() {
        return $('~Swipe');
    }

    public get dragButton() {
        return $('~Drag');
    }

    public get menuButton() {
        return $('~Menu');
    }

    async goToHome() {
        await this.homeButton.click();
    }

    async goToWebView() {
        await this.webviewButton.click();
    }

    async goToLogin() {
        await this.loginButton.click();
    }

    async goToForms() {
        await this.formsButton.click();
    }

    async goToSwipe() {
        await this.swipeButton.click();
    }

    async goToDrag() {
        await this.dragButton.click();
    }

    async goToMenu() {
        await this.menuButton.click();
    }

    async validateElements() {
        await this.homeButton.waitForDisplayed();
        await this.webviewButton.waitForDisplayed();
        await this.loginButton.waitForDisplayed();
        await this.formsButton.waitForDisplayed();
        await this.swipeButton.waitForDisplayed();
        await this.dragButton.waitForDisplayed();
        await this.menuButton.waitForDisplayed();
    }
}

export default new permanentBarPage();
