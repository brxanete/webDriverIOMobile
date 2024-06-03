import { $ } from '@wdio/globals'
class bannerPage {

    public get homeBotton() {
        return $('//android.widget.TextView[@text="Home"]');
    }
 

    async goToHome() {
        await this.homeBotton.click();
    }

}

export default new bannerPage();