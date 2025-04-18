import { describe, beforeEach, it } from "cypress"

describe("Authentication", () => {
  beforeEach(() => {
    cy.visit("/")
  })

  it("should show connect wallet button when not logged in", () => {
    cy.get("button").contains("Connect Wallet").should("be.visible")
  })

  it("should connect wallet and show user menu when logged in", () => {
    // Mock the wallet connection
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

    // Reload the page to apply the mock
    cy.reload()

    // Check if user menu is visible
    cy.get("button").contains("Connect Wallet").should("not.exist")
    cy.get("span").contains("Test User").should("be.visible")
  })

  it("should logout when clicking disconnect wallet", () => {
    // Mock the wallet connection
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

    // Reload the page to apply the mock
    cy.reload()

    // Open user menu and click disconnect
    cy.get("span").contains("Test User").click()
    cy.get('div[role="menuitem"]').contains("Disconnect Wallet").click()

    // Check if connect wallet button is visible again
    cy.get("button").contains("Connect Wallet").should("be.visible")
  })
})
