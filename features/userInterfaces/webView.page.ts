import { $ } from '@wdio/globals'

class webViewPage {

    private async tryClickFirstAvailable(selectors: string[]) {
        for (const selector of selectors) {
            const element = $(selector);
            try {
                await element.waitForDisplayed({ timeout: 3000, interval: 200 });
                await element.click();
                return true;
            } catch {
                // Intentionally ignored: the element was not present in the current UI state.
            }
        }

        return false;
    }

    async closeAd() {
        const clicked = await this.tryClickFirstAvailable([
            '//android.widget.Button[@text="Close"]',
            '//android.widget.Button[contains(@text, "Close")]',
            '//android.widget.TextView[@text="Close"]',
            '//android.widget.Button[@text="No thanks"]',
            '//android.widget.Button[@text="No, thanks"]',
            '//android.widget.TextView[@text="No thanks"]',
            '//android.widget.TextView[@text="No, thanks"]'
        ]);

        if (!clicked) {
            await browser.pause(1000);
        }
    }

    async goToGetStartedPage() {
        const clicked = await this.tryClickFirstAvailable([
            '//android.widget.TextView[@text="Get Started"]',
            '//android.view.View[@text="Get Started"]',
            '//android.widget.TextView[contains(@text, "Get Started")]',
            '//android.view.View[contains(@text, "Get Started")]'
        ]);

        if (!clicked) {
            await browser.pause(1000);
        }
    }
}

export default new webViewPage();


