import { $, driver } from '@wdio/globals'

class formsPage {

    public get screen() {
        return $('~Forms-screen');
    }

    public get textInput() {
        return $('~text-input');
    }

    public get inputTextResult() {
        return $('~input-text-result');
    }

    public get switch() {
        return $('~switch');
    }

    public get switchText() {
        return $('~switch-text');
    }

    public get dropdown() {
        return $('~Dropdown');
    }

    public get dropdownValue() {
        return this.dropdown.$('//android.widget.EditText');
    }

    async isOnScreen() {
        await this.screen.waitForDisplayed();
    }

    async enterText(text: string) {
        await this.textInput.setValue(text);
    }

    async clearTextInput() {
        await this.textInput.clearValue();
    }

    async getInputResult(): Promise<string> {
        return await this.inputTextResult.getText();
    }

    async tapSwitch() {
        await this.switch.click();
    }

    async getSwitchText(): Promise<string> {
        return await this.switchText.getText();
    }

    async tapDropdown() {
        await this.hideKeyboardIfShown();
        await this.dropdown.click();
    }

    async selectDropdownOption(optionText: string) {
        const option = $(`//android.widget.CheckedTextView[@text="${optionText}"]`);
        await option.waitForDisplayed();
        await option.click();
    }

    async getSelectedDropdownText(): Promise<string> {
        return await this.dropdownValue.getText();
    }

    private async hideKeyboardIfShown(): Promise<void> {
        try {
            if (await driver.isKeyboardShown()) {
                await driver.hideKeyboard();
            }
        } catch {
        }
    }

    async validateElements() {
        await this.screen.waitForDisplayed();
        await this.textInput.waitForDisplayed();
        await this.inputTextResult.waitForDisplayed();
        await this.switch.waitForDisplayed();
        await this.switchText.waitForDisplayed();
        await this.dropdown.waitForDisplayed();
    }
}

export default new formsPage();
