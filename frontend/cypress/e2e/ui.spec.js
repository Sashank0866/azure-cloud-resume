// frontend/cypress/e2e/ui.spec.js

describe("Resume Site Smoke Tests", () => {
    beforeEach(() => {
      cy.intercept({
        method: "GET",
        path: "/api/http_trigger*"
      }).as("getCount");
  
      cy.visit("/");
      // wait for the actual Azure Function call
      cy.wait("@getCount").its("response.statusCode").should("eq", 200);
    });
  
    it("displays and logs the visitor counter", () => {
      cy.get("#visitor-counter")
        .should("exist")
        // make sure we didn’t fall into the catch() setting “N/A”
        .should("not.have.text", "N/A")
        .invoke("text")
        .then((text) => {
          cy.log("🚀 Visitor counter after API call:", text);
          expect(text).to.match(/^\d+$/);
        });
    });
  
    it("toggles theme when button clicked", () => {
      // our logic.js attaches to #theme-toggle
      cy.get("#theme-toggle").as("btn");
  
      // start in dark
      cy.get("body")
        .should("not.have.class", "light-mode");
  
      // switch to light
      cy.get("@btn").click();
      cy.get("body")
        .should("have.class", "light-mode");
  
      // back to dark
      cy.get("@btn").click();
      cy.get("body")
        .should("not.have.class", "light-mode");
    });
  });
  