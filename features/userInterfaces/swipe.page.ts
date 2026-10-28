import { $ } from '@wdio/globals'

class swipePage {

    public get screen() {
        return $('~Swipe-screen');
    }

    public get card() {
        return $('~card');
    }

    public get horizontalTitle() {
        return $('//android.widget.TextView[@text="Swipe horizontal"]');
    }

    public get webdriverioLogo() {
        return $('//android.widget.TextView[@text="\u{F02A4}"]');
    }

    async isOnScreen() {
        await this.screen.waitForDisplayed();
    }

    async swipeLeft() {
        await this.swipeCard(0.8, 0.2);
    }

    async swipeRight() {
        await this.swipeCard(0.2, 0.8);
    }

    private async swipeCard(startRatio: number, endRatio: number) {
        await this.card.waitForDisplayed();
        const location = await this.card.getLocation();
        const size = await this.card.getSize();
        const centerY = Math.round(location.y + size.height / 2);
        const startX = Math.round(location.x + size.width * startRatio);
        const endX = Math.round(location.x + size.width * endRatio);

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
        const title = $('(//android.view.ViewGroup[@content-desc="card"])[1]/following-sibling::android.widget.TextView[2]');
        await title.waitForDisplayed();
        return await title.getText();
    }

    async isLogoVisible(): Promise<boolean> {
        try {
            return await this.webdriverioLogo.isDisplayed();
        } catch {
            return false;
        }
    }

    async resetToFirstCard(): Promise<void> {
        for (let attempt = 0; attempt < 6; attempt++) {
            if (await this.isLogoVisible()) {
                return;
            }
            await this.swipeRight();
        }
    }

    async validateElements() {
        await this.screen.waitForDisplayed();
        await this.horizontalTitle.waitForDisplayed();
        await this.card.waitForDisplayed();
    }
}

export default new swipePage();
