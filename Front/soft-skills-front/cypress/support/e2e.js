// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Suprimir errores de excepciones no capturadas en la aplicación
Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from failing the test
  console.log('Error no capturado:', err.message);
  return false;
});

beforeEach(() => {
  cy.intercept('GET', '**/api/**', (req) => {
    console.log(`Interceptando solicitud a: ${req.url}`);
  });
  
  cy.window().then((win) => {
    win.document.body.setAttribute('data-cy-test', 'true');
  });
});

const viewportSizes = {
  mobile: {
    width: 375,
    height: 667
  },
  tablet: {
    width: 768,
    height: 1024
  },
  desktop: {
    width: 1280,
    height: 800
  }
};

Cypress.Commands.add('viewportMobile', () => {
  cy.viewport(viewportSizes.mobile.width, viewportSizes.mobile.height);
});

Cypress.Commands.add('viewportTablet', () => {
  cy.viewport(viewportSizes.tablet.width, viewportSizes.tablet.height);
});

Cypress.Commands.add('viewportDesktop', () => {
  cy.viewport(viewportSizes.desktop.width, viewportSizes.desktop.height);
});