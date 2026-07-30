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

        const startX = pieceLocation.x + pieceSize.width / 2;
        const startY = pieceLocation.y + pieceSize.height / 2;
        const endX = zoneLocation.x + zoneSize.width / 2;
        const endY = zoneLocation.y + zoneSize.height / 2;

        await browser.action('pointer')
            .move({ x: startX, y: startY })
            .down()
            .pause(200)
            .move({ x: endX, y: endY })
            .pause(200)
            .up()
            .perform();
    }

    async tapRenew() {
        await this.renewButton.click();
    }

    async isPieceInZone(pieceId: string, zoneId: string): Promise<boolean> {
        try {
            const piece = this.dragPiece(pieceId);
            const zone = this.dropZone(zoneId);

            const pieceLocation = await piece.getLocation();
            const zoneLocation = await zone.getLocation();

            const distance = Math.sqrt(
                Math.pow(pieceLocation.x - zoneLocation.x, 2) +
                Math.pow(pieceLocation.y - zoneLocation.y, 2)
            );

            return distance < 50;
        } catch {
            return false;
        }
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
