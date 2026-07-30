import { Given, When, Then } from '@wdio/cucumber-framework';
import { expect } from '@wdio/globals';
import dragPage from '../userInterfaces/drag.page.ts';

Given(/^El usuario navega a la pantalla de Drag$/, async () => {
    const permanentBar = (await import('../userInterfaces/permanentBar.page.ts')).default;
    await permanentBar.goToDrag();
});

Then(/^La pantalla de Drag debe mostrar todos los elementos$/, async () => {
    await dragPage.validateElements();
});

When(/^El usuario arrastra la pieza "([^"]*)" a la zona "([^"]*)"$/, async (pieceId: string, zoneId: string) => {
    await dragPage.dragPieceToZone(pieceId, zoneId);
});

When(/^El usuario resuelve el puzzle completo$/, async () => {
    await dragPage.solvePuzzle();
});

When(/^El usuario presiona el botón Renew$/, async () => {
    await dragPage.tapRenew();
});

Then(/^La pieza "([^"]*)" debe estar en la posición correcta$/, async (pieceId: string) => {
    const zoneId = pieceId.replace('drag', 'drop');
    const isCorrect = await dragPage.isPieceInZone(pieceId, zoneId);
    await expect(isCorrect).toBe(true);
});

Then(/^Todas las piezas deben estar en sus posiciones correctas$/, async () => {
    const pieces = ['drag-l1', 'drag-c1', 'drag-r1', 'drag-l2', 'drag-c2', 'drag-r2', 'drag-l3', 'drag-c3', 'drag-r3'];
    for (const piece of pieces) {
        const zone = piece.replace('drag', 'drop');
        const isCorrect = await dragPage.isPieceInZone(piece, zone);
        await expect(isCorrect).toBe(true);
    }
});

Then(/^Las piezas deben volver a sus posiciones iniciales$/, async () => {
    await dragPage.dragPiece('drag-l1').waitForDisplayed();
    await expect(dragPage.dragPiece('drag-l1')).toBeDisplayed();
});

Then(/^La pieza "([^"]*)" no debe estar en la posición correcta$/, async (pieceId: string) => {
    const zoneId = pieceId.replace('drag', 'drop');
    const isCorrect = await dragPage.isPieceInZone(pieceId, zoneId);
    await expect(isCorrect).toBe(false);
});
