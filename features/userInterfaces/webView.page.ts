import { $ } from '@wdio/globals'

class webViewPage {


    public get closeAdButton() {
        return $('//android.widget.Button[@text="Close"]');
    }

    public get watchOnYTButton() {
        return $('//android.widget.TextView[@text="Watch on YouTube"]');
    }

    public get getStartedButton(){
        return $('//android.widget.TextView[@text="Get Started"]')
    }

    async closeAd() {
        await browser.waitUntil(async () => {
            return await this.closeAdButton.isDisplayed();
        }, {
            timeout: 10000,
            timeoutMsg: 'El botón "closeAdButton" no se mostró después de 10 segundos'
        });

        await this.closeAdButton.click();

    }

    async goToGetStartedPage(){
        await this.getStartedButton.click();
    }


}

export default new webViewPage();


