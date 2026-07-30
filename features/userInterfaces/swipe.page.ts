import { $ } from '@wdio/globals'

class swipePage {

    public get screen() {
        return $('~Swipe-screen');
    }

    public get carousel() {
        return $('~Carousel');
    }

    public get webdriverioLogo() {
        return $('~WebdriverIO logo');
    }

    async isOnScreen() {
        await this.screen.waitForDisplayed();
    }

    async swipeLeft() {
        await this.carousel.waitForDisplayed();
        const size = await this.carousel.getSize();
        const location = await this.carousel.getLocation();
        const startX = location.x + size.width * 0.8;
        const endX = location.x + size.width * 0.2;
        const centerY = location.y + size.height / 2;

        await browser.action('pointer')
            .move({ x: startX, y: centerY })
            .down()
            .pause(100)
            .move({ x: endX, y: centerY })
            .pause(100)
            .up()
            .perform();
    }

    async swipeRight() {
        await this.carousel.waitForDisplayed();
        const size = await this.carousel.getSize();
        const location = await this.carousel.getLocation();
        const startX = location.x + size.width * 0.2;
        const endX = location.x + size.width * 0.8;
        const centerY = location.y + size.height / 2;

        await browser.action('pointer')
            .move({ x: startX, y: centerY })
            .down()
            .pause(100)
            .move({ x: endX, y: centerY })
            .pause(100)
            .up()
            .perform();
    }

    async getActiveCardDescription(): Promise<string> {
        const activeCard = await $('//android.widget.ScrollView[@content-desc="Swipe-screen"]//android.widget.TextView');
        await activeCard.waitForDisplayed();
        return await activeCard.getText();
    }

    async isLogoVisible(): Promise<boolean> {
        return await this.webdriverioLogo.isDisplayed();
    }

    async validateElements() {
        await this.screen.waitForDisplayed();
        await this.carousel.waitForDisplayed();
    }
}

export default new swipePage();
