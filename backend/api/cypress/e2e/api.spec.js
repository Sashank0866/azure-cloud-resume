// Backend/api/cypress/e2e/api.spec.js
describe("Visitor Counter API", () => {
    const url = Cypress.env("FUNCTION_URL");
  
    it("should increment the counter on each call", () => {
      let firstCount;
  
      // 1st call – grab the initial count
      cy.request({ url, failOnStatusCode: false })
        .its("body")
        .then((body) => {
          firstCount = parseInt(body, 10);
          expect(firstCount).to.be.a("number");
        });
  
      // 2nd call – should be > firstCount
      cy.request({ url, failOnStatusCode: false })
        .its("body")
        .then((body) => {
          const secondCount = parseInt(body, 10);
          expect(secondCount).to.be.a("number");
          expect(secondCount).to.be.greaterThan(firstCount);
        });
    });
  });
  