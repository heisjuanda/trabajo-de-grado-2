// ***********************************************
// Este archivo define comandos personalizados para Cypress
// 
// Para más información sobre cómo agregar comandos personalizados:
// https://on.cypress.io/custom-commands
// ***********************************************

Cypress.Commands.add('login', (email = 'usuario.prueba@example.com', name = 'Usuario Prueba') => {
  cy.window().then((win) => {
    win.localStorage.setItem('isAuthenticated', 'true');
    win.localStorage.setItem('user', JSON.stringify({
      email: email,
      name: name,
      picture: 'https://example.com/avatar.jpg'
    }));
    cy.reload();
  });
});

Cypress.Commands.add('logout', () => {
  cy.window().then((win) => {
    win.localStorage.removeItem('isAuthenticated');
    win.localStorage.removeItem('user');
    cy.reload();
  });
});

Cypress.Commands.add('navegarAOratoria', () => {
  cy.visit('/dashboard');
  cy.contains('Oratoria').click();
  cy.url().should('include', '/activity/oratoria');
});

Cypress.Commands.add('navegarAPensamientoCritico', () => {
  cy.visit('/dashboard');
  cy.contains('Pensamiento Crítico').click();
  cy.url().should('include', '/activity/pensamientocritico');
});

Cypress.Commands.add('iniciarPracticaOratoria', (tema = 'Tecnología') => {
  cy.navegarAOratoria();
  cy.contains('Practicar').click();
  cy.url().should('include', '/activity/oratoria/start');
  cy.get('select').select(tema);
  cy.contains('Comenzar').click();
});

Cypress.Commands.add('iniciarDebate', (tema = 'politica') => {
  cy.navegarAPensamientoCritico();
  cy.contains('Debate con IA').click();
  cy.url().should('include', '/activity/pensamientocritico/debateia');
  cy.get('[data-testid="select-topic"]').select(tema);
  cy.get('[data-testid="debate-button"]').click();
});

Cypress.Commands.add('esAccesible', (selector) => {
  cy.get(selector).should('have.attr', 'aria-label').and('not.be.empty');
});

Cypress.Commands.add('verificarContenidoMultilingue', (selectorEs, contenidoEs, selectorEn, contenidoEn) => {
  cy.get(selectorEs).should('contain', contenidoEs);
  
  cy.get('[data-testid="cambiar-idioma"]').click();
  cy.get('[data-testid="idioma-en"]').click();
  
  cy.get(selectorEn).should('contain', contenidoEn);
  
  cy.get('[data-testid="cambiar-idioma"]').click();
  cy.get('[data-testid="idioma-es"]').click();
}); 