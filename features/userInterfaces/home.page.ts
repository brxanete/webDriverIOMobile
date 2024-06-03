import { $ } from '@wdio/globals'
class homePage {
    webviewButton: any;


    public get robotImage() {
        return $('//android.widget.ScrollView[@content-desc="Home-screen"]/android.view.ViewGroup/android.widget.ImageView[1]');
    }
    public get webDriverTitle() {
        return $('//android.widget.TextView[@text="WEBDRIVER"]');
    }
    public get iOLogo() {
        return $('//android.widget.ScrollView[@content-desc="Home-screen"]/android.view.ViewGroup/android.widget.ImageView[2]');
    }
    public get infoApp() {
        return $('//android.widget.TextView[@text="Demo app for the appium-boilerplate"]')
    }
    public get appleLogo(){
        return $('//android.widget.TextView[@text="󰀵"]')
    }
    public get androidLogo(){
        return $('//android.widget.TextView[@text="󰀲"]')
    }
    public get supportText(){
        return $('//android.widget.TextView[@text="Support"]')
    }


    async isOnHome(){
        await this.androidLogo.waitForDisplayed();
    }


    async validateElements() {
        await this.robotImage.waitForDisplayed();
        await this.webDriverTitle.waitForDisplayed();
        await this.iOLogo.waitForDisplayed();
        await this.infoApp.waitForDisplayed();
        await this.appleLogo.waitForDisplayed();
        await this.androidLogo.waitForDisplayed();
        await this.supportText.waitForDisplayed();
        
    }



    }

 

export default new homePage();