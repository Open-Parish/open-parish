const DEFAULT_ADMIN_EMAIL = 'admin@example.com';
const DEFAULT_ADMIN_PASSWORD = 'change-this-password';

function adminEmail() {
  return Cypress.env('ADMIN_EMAIL') || DEFAULT_ADMIN_EMAIL;
}

function adminPassword() {
  return Cypress.env('ADMIN_PASSWORD') || DEFAULT_ADMIN_PASSWORD;
}

Cypress.Commands.add('loginAsSeededAdmin', () => {
  cy.visit('/login');
  cy.get('[data-testid="login-email"]').should('be.visible').clear().type(adminEmail());
  cy.get('[data-testid="login-password"]').should('be.visible').clear().type(adminPassword(), { log: false });
  cy.get('[data-testid="login-submit"]').click();
  cy.location('pathname').should('eq', '/dashboard');
  cy.contains('Dashboard').should('be.visible');
});

Cypress.Commands.add('logoutFromDashboard', () => {
  cy.get('[data-testid="logout-button"]').should('be.visible').click();
  cy.location('pathname').should('eq', '/login');
  cy.get('[data-testid="login-submit"]').should('be.visible');
});
