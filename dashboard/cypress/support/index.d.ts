declare namespace Cypress {
  interface Chainable {
    loginAsSeededAdmin(): Chainable<void>;
    logoutFromDashboard(): Chainable<void>;
  }
}
