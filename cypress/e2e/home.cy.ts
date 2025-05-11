describe("Home Page", () => {
  beforeEach(() => {
    cy.visit("/")
  })

  it("should display the home page correctly", () => {
    cy.get("h1").contains("Welcome to Giki.js")
    cy.get("a").contains("Create Page")
    cy.get("a").contains("Explore")
  })

  it("should navigate to create page when clicking Create Page button", () => {
    cy.get("a").contains("Create Page").click()
    cy.url().should("include", "/create")
  })

  it("should navigate to explore page when clicking Explore button", () => {
    cy.get("a").contains("Explore").click()
    cy.url().should("include", "/explore")
  })

  it("should display recent pages", () => {
    cy.get("a").contains("Recent Pages").click()
    cy.get("div").contains("Getting Started with Giki.js")
  })

  it("should display popular pages", () => {
    cy.get("a").contains("Popular Pages").click()
    cy.get("div").contains("Complete User Guide")
  })
})
