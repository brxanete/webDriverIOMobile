import { $ } from '@wdio/globals'

class bannerPage {

    public get homeButton() {
        return $('~Home');
    }

    async goToHome() {
        await this.homeButton.click();
    }
}

export default new bannerPage();
