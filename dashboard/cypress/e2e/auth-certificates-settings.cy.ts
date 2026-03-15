const API_BASE_URL = Cypress.env('VITE_API_BASE_URL') || 'http://localhost:8787';
const API_ORIGIN = new URL(API_BASE_URL).origin;

function openPrintPreviewFromFirstCertificate() {
  cy.get('[data-testid="certificate-print-link"]')
    .first()
    .should('have.attr', 'href')
    .then((printUrl) => {
      const previewUrl = String(printUrl).replace('/print/', '/print-preview/');
      cy.visit(previewUrl);
      cy.origin(
        API_ORIGIN,
        () => {
          cy.document().its('title').should('match', /Certificate/i);
          cy.contains(/Certificate of/i).should('be.visible');
        },
      );
    });
}

function visitCertificatesAndOpenPreview() {
  cy.intercept('POST', `${API_BASE_URL}/certificates/baptismal/page`).as('getBaptismalPage');
  cy.visit('/baptismal');
  cy.wait('@getBaptismalPage').its('response.statusCode').should('eq', 200);
  cy.contains('Baptismal Certificates').should('be.visible');
  cy.get('tbody tr').should('have.length.greaterThan', 0);
  openPrintPreviewFromFirstCertificate();
}

function visitSettingsAndSave() {
  cy.intercept('GET', `${API_BASE_URL}/settings`).as('getSettings');
  cy.intercept('POST', `${API_BASE_URL}/settings`).as('saveSettings');
  cy.visit('/settings');
  cy.wait('@getSettings').its('response.statusCode').should('eq', 200);
  cy.contains('Settings').should('be.visible');
  cy.get('input[name="parishName"]').should('be.visible').invoke('val').then((value) => {
    cy.get('input[name="parishName"]').clear().type(String(value));
  });
  cy.get('[data-testid="settings-save"]').click();
  cy.wait('@saveSettings').its('response.statusCode').should('eq', 200);
}

describe('authenticated dashboard journey', () => {
  it('logs in, views certificates, opens print preview, checks settings, and logs out', () => {
    cy.loginAsSeededAdmin();
    visitCertificatesAndOpenPreview();
    visitSettingsAndSave();
    cy.logoutFromDashboard();
  });
});
