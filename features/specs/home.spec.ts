import homePage from '../userInterfaces/home.page.ts';
import permanentBarPage from '../userInterfaces/permanentBar.page.ts';
import webViewPage from '../userInterfaces/webView.page.ts';

describe('Home y WebView', () => {
    beforeEach(async () => {
        await homePage.isOnHome();
    });

    it('Valida los elementos visuales de la pantalla de inicio', async () => {
        await homePage.validateElements();
        await permanentBarPage.validateElements();
    });

    it('Cierra el anuncio en la sección de WebView', async () => {
        await permanentBarPage.goToWebView();
        await webViewPage.closeAd();
    });

    it('Navega a la página de Get Started', async () => {
        await permanentBarPage.goToWebView();
        await webViewPage.goToGetStartedPage();
    });
});