import { $ } from '@wdio/globals'
class permanentBarPage {

    public get webviewButton() {
        return $('//android.view.View[@content-desc="Webview"]');
    }

    public get loginButton() {
        return $('//android.view.View[@content-desc="Login"]');
    }

    public get formsButton() {
        return $('//android.view.View[@content-desc="Forms"]');
    }

    public get swipeButton() {
        return $('//android.view.View[@content-desc="Swipe"]');
    }

    public get dragButton() {
        return $('//android.view.View[@content-desc="Drag"]');
    }


    async goToWebView() {
        await this.webviewButton.click()

    }

    async validateElements(){
        await this.webviewButton.waitForDisplayed();
        await this.loginButton.waitForDisplayed();
        await this.formsButton.waitForDisplayed();
        await this.swipeButton.waitForDisplayed();
        await this.dragButton.waitForDisplayed();
    
    }

    
}

export default new permanentBarPage();
