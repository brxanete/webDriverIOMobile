import { $ } from '@wdio/globals'

class dragPage {

    public get screen() {
        return $('~Drag-drop-screen');
    }

    public get renewButton() {
        return $('~renew');
    }

    dragPiece(pieceId: string) {
        return $(`~${pieceId}`);
    }

    dropZone(zoneId: string) {
        return $(`~${zoneId}`);
    }

    async isOnScreen() {
        await this.screen.waitForDisplayed();
    }

    async dragPieceToZone(pieceId: string, zoneId: string) {
        const piece = this.dragPiece(pieceId);
        const zone = this.dropZone(zoneId);

        await piece.waitForDisplayed();
        await zone.waitForDisplayed();

        const pieceLocation = await piece.getLocation();
        const pieceSize = await piece.getSize();
        const zoneLocation = await zone.getLocation();
        const zoneSize = await zone.getSize();

        const startX = Math.round(pieceLocation.x + pieceSize.width / 2);
        const startY = Math.round(pieceLocation.y + pieceSize.height / 2);
        const endX = Math.round(zoneLocation.x + zoneSize.width / 2);
        const endY = Math.round(zoneLocation.y + zoneSize.height / 2);

        const action = browser.action('pointer')
            .move({ x: startX, y: startY })
            .down()
            .pause(200);

        const steps = 10;
        for (let step = 1; step <= steps; step++) {
            action.move({
                x: Math.round(startX + ((endX - startX) * step) / steps),
                y: Math.round(startY + ((endY - startY) * step) / steps)
            });
        }

        await action.pause(200).up().perform();
    }

    async tapRenew() {
        await this.renewButton.click();
    }

    async resetPuzzle() {
        const retryButton = $('~button-Retry');

        if (await retryButton.isDisplayed().catch(() => false)) {
            await retryButton.click();
        } else {
            await this.renewButton.waitForDisplayed();
            await this.renewButton.click();
        }

        await this.dragPiece('drag-l1').waitForDisplayed();
    }

    async isPieceInZone(pieceId: string, zoneId: string): Promise<boolean> {
        const pieceVisible = await this.dragPiece(pieceId).isDisplayed().catch(() => false);
        const zoneVisible = await this.dropZone(zoneId).isDisplayed().catch(() => false);

        return !pieceVisible && !zoneVisible;
    }

    async solvePuzzle() {
        const pieces = ['drag-l1', 'drag-c1', 'drag-r1', 'drag-l2', 'drag-c2', 'drag-r2', 'drag-l3', 'drag-c3', 'drag-r3'];
        const zones = ['drop-l1', 'drop-c1', 'drop-r1', 'drop-l2', 'drop-c2', 'drop-r2', 'drop-l3', 'drop-c3', 'drop-r3'];

        for (let i = 0; i < pieces.length; i++) {
            await this.dragPieceToZone(pieces[i], zones[i]);
        }
    }

    async validateElements() {
        await this.screen.waitForDisplayed();
        await this.renewButton.waitForDisplayed();
        await this.dragPiece('drag-l1').waitForDisplayed();
    }
}

export default new dragPage();
