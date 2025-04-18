describe("Giki.js Application Tests", () => {
  // Store errors for reporting
  const errors: string[] = []

  // Override window.console.error to catch errors
  before(() => {
    cy.visit("/").then(() => {
      cy.window().then((win) => {
        const originalError = win.console.error
        win.console.error = (...args) => {
          const errorMessage = args.join(" ")
          errors.push(errorMessage)
          originalError.apply(win.console, args)
        }
      })
    })
  })

  // After all tests, log collected errors
  after(() => {
    cy.log("Collected errors:")
    errors.forEach((error, index) => {
      cy.log(`Error ${index + 1}: ${error}`)
    })
  })

  // Test home page
  it("should load the home page", () => {
    cy.visit("/")
    cy.contains("Welcome to Giki.js").should("be.visible")
    cy.contains("Create Page").should("be.visible")
    cy.contains("Explore").should("be.visible")
  })

  // Test navigation links
  it("should navigate to main pages", () => {
    const pages = [
      { path: "/", title: "Welcome to Giki.js" },
      { path: "/search", title: "Search" },
      { path: "/pages", title: "Pages" },
      { path: "/create", title: "Create New Page" },
    ]

    pages.forEach((page) => {
      cy.visit(page.path)
      cy.contains(page.title).should("be.visible")
    })
  })

  // Test authentication flow
  it("should handle wallet connection", () => {
    cy.visit("/")

    // Mock wallet connection
    cy.window().then((win) => {
      win.localStorage.setItem("walletConnected", "true")
      win.localStorage.setItem("walletAddress", "0x1234567890abcdef1234567890abcdef12345678")
      win.localStorage.setItem("auth_token", "mock-token")
      win.localStorage.setItem(
        "auth_user",
        JSON.stringify({
          id: "1",
          address: "0x1234567890abcdef1234567890abcdef12345678",
          name: "Test User",
          role: "editor",
        }),
      )
    })

    // Reload to apply mock auth
    cy.reload()

    // Check if user menu is visible
    cy.get("button").contains("Connect Wallet").should("not.exist")

    // Test authenticated pages
    cy.visit("/dashboard")
    cy.contains("Dashboard").should("be.visible")

    cy.visit("/settings/profile")
    cy.contains("Profile Settings").should("be.visible")

    // Clean up
    cy.window().then((win) => {
      win.localStorage.removeItem("walletConnected")
      win.localStorage.removeItem("walletAddress")
      win.localStorage.removeItem("auth_token")
      win.localStorage.removeItem("auth_user")
    })
  })

  // Test all buttons on home page
  it("should test all buttons on home page", () => {
    cy.visit("/")

    // Test main action buttons
    cy.contains("button", "Create Page").should("be.visible").and("not.be.disabled")
    cy.contains("a", "Explore").should("be.visible")

    // Test tab buttons
    cy.contains("button", "Recent Pages").should("be.visible").click()
    cy.contains("button", "Popular Pages").should("be.visible").click()

    // Test card buttons
    cy.contains("a", "Browse Public Pages").should("be.visible")
    cy.contains("a", "Browse Community Pages").should("be.visible")
    cy.contains("a", "My Private Pages").should("be.visible")
  })

  // Test search functionality
  it("should test search functionality", () => {
    cy.visit("/search")
    cy.get('input[type="search"]').type("test search{enter}")
    cy.url().should("include", "search?q=test%20search")
  })

  // Test create page form
  it("should test create page form", () => {
    cy.visit("/create")
    cy.get("input#title").type("Test Page Title")

    // Test radio buttons
    cy.contains("label", "Public").click()
    cy.contains("label", "Community").click()
    cy.contains("label", "Private").click()

    // Test editor tabs
    cy.contains("button", "Write").should("be.visible")
    cy.contains("button", "Preview").should("be.visible").click()
    cy.contains("button", "Write").click()
  })
})
