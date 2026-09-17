import { expect } from '@wdio/globals';
import dragPage from '../userInterfaces/drag.page.ts';
import permanentBar from '../userInterfaces/permanentBar.page.ts';

const puzzlePieces = [
    'drag-l1', 'drag-c1', 'drag-r1',
    'drag-l2', 'drag-c2', 'drag-r2',
    'drag-l3', 'drag-c3', 'drag-r3'
];

describe('Drag - Puzzle de arrastrar y soltar', () => {
    beforeEach(async () => {
        await permanentBar.goToDrag();
    });

    it('Validación visual de la pantalla de Drag', async () => {
        await dragPage.validateElements();
    });

    it('[CP-019] Arrastrar una pieza a su zona correcta', async () => {
        await dragPage.dragPieceToZone('drag-l1', 'drop-l1');
        const isCorrect = await dragPage.isPieceInZone('drag-l1', 'drop-l1');
        await expect(isCorrect).toBe(true);
    });

    it('[CP-020] Resolver el puzzle completo', async () => {
        await dragPage.solvePuzzle();
        for (const piece of puzzlePieces) {
            const zone = piece.replace('drag', 'drop');
            const isCorrect = await dragPage.isPieceInZone(piece, zone);
            await expect(isCorrect).toBe(true);
        }
    });

    it('[CP-021] Reiniciar el puzzle con el botón Renew', async () => {
        await dragPage.solvePuzzle();
        await dragPage.tapRenew();
        await dragPage.dragPiece('drag-l1').waitForDisplayed();
        await expect(dragPage.dragPiece('drag-l1')).toBeDisplayed();
    });

    it('[CP-022] Arrastrar una pieza a una zona incorrecta', async () => {
        await dragPage.dragPieceToZone('drag-l1', 'drop-r3');
        const isCorrect = await dragPage.isPieceInZone('drag-l1', 'drop-r3');
        await expect(isCorrect).toBe(false);
    });
});