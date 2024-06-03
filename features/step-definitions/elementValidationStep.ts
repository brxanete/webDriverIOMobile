import { Given, When, Then } from '@wdio/cucumber-framework';

import { expect } from '@wdio/globals';
import homePage from '../userInterfaces/home.page.ts';
import permanentBarPage from '../userInterfaces/permanentBar.page.ts';
import webViewPage from '../userInterfaces/webView.page.ts';

Given(/^El usuario esta en la página de inicio$/, async () => {
   await homePage.isOnHome();

   
});

Given(/^El usuario valida los elementos visuales$/, async () => {
   await homePage.validateElements();
   await permanentBarPage.validateElements();

   
});

When(/^El usuario va a la sección de webview$/, async () => {
   await permanentBarPage.goToWebView();

});

When(/^El usuario cierra el anuncio$/, async () => {
   await webViewPage.closeAd();
  

});

When(/^El usuario va a la pagina de get started$/, async () => {
   await webViewPage.goToGetStartedPage();
  

});






// Resto de tus definiciones de pasos

