describe("Resume Site Smoke Tests", () => {
    const baseUrl = Cypress.env("SITE_URL"); 
    
  
    before(() => {
      cy.visit(baseUrl);
    });
  
    it("loads the header correctly", () => {
      cy.get("header h1").should("contain.text", "Sashank Konathala");
    });
  
    it("displays the visitor counter", () => {
      cy.get("#visitor-counter")
        .should("exist")
        .and("not.have.text", "")       // eventually replaced by the fetch
        .and(($span) => {
          // after API runs, it should be digits
          expect($span.text()).to.match(/^\d+$/);
        });
    });
  
    it("toggles theme when button clicked", () => {
      cy.get("#theme-toggle").as("btn");
  
      // initial: dark mode (no .light-mode class)
      cy.get("body").should("not.have.class", "light-mode");
      cy.get("@btn").click();
  
      // now in light mode
      cy.get("body").should("have.class", "light-mode");
      cy.get("@btn").click();
  
      // back to dark
      cy.get("body").should("not.have.class", "light-mode");
    });
  });
  