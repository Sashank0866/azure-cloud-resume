// frontend/cypress/e2e/ui.spec.js

describe("Resume Site Smoke Tests", () => {
    
    beforeEach(() => {
      // 1) spy on the HTTP-trigger call (catches the code query-param too)
      cy.intercept({
        method: "GET",
        path: "/api/http_trigger*"
      }).as("getCount");
  
      // 2) visit the root
      cy.visit("/");
  
      // 3) wait for our logic.js fetch to complete
      cy.wait("@getCount");
    });
  
    it("loads the header correctly", () => {
      cy.get("header h1")
        .should("contain.text", "Sashank Konathala");
    });
  
    it("displays and logs the visitor counter", () => {
      cy.get("#visitor-counter")
        .should("exist")
        .invoke("text")
        .then((text) => {
          cy.log(" Visitor counter after API call:", text);
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
  