// This is a mock service for page operations
// In a real app, this would interact with a database

export type PageVisibility = "public" | "private" | "community"

export interface Page {
  id: string
  title: string
  content: string
  language: string
  createdAt: Date
  updatedAt: Date
  createdBy: string
  updatedBy: string
  visibility: PageVisibility
  translations?: Record<string, string>
  status: "draft" | "published" | "scheduled"
  publishedAt?: Date
  scheduledFor?: Date
}

// Mock database
let pages: Page[] = [
  {
    id: "1",
    title: "Getting Started with Giki.js",
    content: "# Getting Started\n\nWelcome to Giki.js! This guide will help you get started with our platform.",
    language: "en",
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-02"),
    createdBy: "0x1234567890123456789012345678901234567890",
    updatedBy: "0x1234567890123456789012345678901234567890",
    visibility: "public",
    status: "published",
    publishedAt: new Date("2023-01-02"),
  },
  {
    id: "2",
    title: "Advanced Features",
    content: "# Advanced Features\n\nExplore the advanced features of Giki.js.",
    language: "en",
    createdAt: new Date("2023-01-03"),
    updatedAt: new Date("2023-01-04"),
    createdBy: "0x1234567890123456789012345678901234567890",
    updatedBy: "0x1234567890123456789012345678901234567890",
    visibility: "community",
    status: "published",
    publishedAt: new Date("2023-01-04"),
  },
  {
    id: "3",
    title: "Private Notes",
    content: "# Private Notes\n\nThese are my private notes.",
    language: "en",
    createdAt: new Date("2023-01-05"),
    updatedAt: new Date("2023-01-05"),
    createdBy: "0x2345678901234567890123456789012345678901",
    updatedBy: "0x2345678901234567890123456789012345678901",
    visibility: "private",
    status: "draft",
  },
]

// Get all pages
export async function getAllPages(userAddress?: string): Promise<Page[]> {
  // If no user is logged in, return only public pages
  if (!userAddress) {
    return pages.filter((page) => page.visibility === "public" && page.status === "published")
  }

  // If user is logged in, return public pages, community pages, and their private pages
  return pages.filter(
    (page) =>
      (page.visibility === "public" && page.status === "published") ||
      (page.visibility === "community" && page.status === "published") ||
      (page.visibility === "private" && page.createdBy === userAddress),
  )
}

// Get page by ID
export async function getPageById(id: string, userAddress?: string): Promise<Page | null> {
  const page = pages.find((p) => p.id === id)

  if (!page) {
    return null
  }

  // Check visibility permissions
  if (
    page.visibility === "public" ||
    (page.visibility === "community" && userAddress) ||
    (page.visibility === "private" && page.createdBy === userAddress)
  ) {
    return page
  }

  return null
}

// Create a new page
export async function createPage(
  page: Omit<Page, "id" | "createdAt" | "updatedAt">,
  userAddress: string,
): Promise<Page> {
  const newPage: Page = {
    ...page,
    id: Math.random().toString(36).substring(2, 11),
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: userAddress,
    updatedBy: userAddress,
  }

  pages.push(newPage)
  return newPage
}

// Update a page
export async function updatePage(
  id: string,
  updates: Partial<Omit<Page, "id" | "createdAt" | "createdBy">>,
  userAddress: string,
): Promise<Page | null> {
  const pageIndex = pages.findIndex((p) => p.id === id)

  if (pageIndex === -1) {
    return null
  }

  // Check if user has permission to update
  const page = pages[pageIndex]
  if (page.createdBy !== userAddress && page.visibility === "private") {
    return null
  }

  const updatedPage: Page = {
    ...page,
    ...updates,
    updatedAt: new Date(),
    updatedBy: userAddress,
  }

  pages[pageIndex] = updatedPage
  return updatedPage
}

// Delete a page
export async function deletePage(id: string, userAddress: string): Promise<boolean> {
  const pageIndex = pages.findIndex((p) => p.id === id)

  if (pageIndex === -1) {
    return false
  }

  // Check if user has permission to delete
  const page = pages[pageIndex]
  if (page.createdBy !== userAddress && page.visibility === "private") {
    return false
  }

  pages = pages.filter((p) => p.id !== id)
  return true
}

// Get page history (mock implementation)
export async function getPageHistory(id: string): Promise<Omit<Page, "content">[]> {
  // In a real app, this would fetch the version history from a database
  // For now, we'll return a mock history
  const page = pages.find((p) => p.id === id)

  if (!page) {
    return []
  }

  // Generate mock history entries
  const history: Omit<Page, "content">[] = []
  const now = new Date()

  for (let i = 0; i < 5; i++) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
    history.push({
      ...page,
      updatedAt: date,
      updatedBy: i % 2 === 0 ? page.createdBy : "0x3456789012345678901234567890123456789012",
    })
  }

  return history
}

// Publish a page
export async function publishPage(id: string, userAddress: string): Promise<Page | null> {
  return updatePage(
    id,
    {
      status: "published",
      publishedAt: new Date(),
    },
    userAddress,
  )
}

// Save as draft
export async function saveDraft(id: string, userAddress: string): Promise<Page | null> {
  return updatePage(
    id,
    {
      status: "draft",
    },
    userAddress,
  )
}

// Schedule publishing
export async function schedulePage(id: string, scheduledFor: Date, userAddress: string): Promise<Page | null> {
  return updatePage(
    id,
    {
      status: "scheduled",
      scheduledFor,
    },
    userAddress,
  )
}

export type VisibilityLevel = "public" | "private" | "community"

export async function savePage(
  contents: Record<string, { title: string; content: string; language: string }>,
  userId: string,
  pageId?: string,
  visibility: VisibilityLevel = "private",
  status: "draft" | "published" | "scheduled" = "draft",
  scheduledPublishDate?: Date,
  tags: string[] = [],
): Promise<any> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  const now = new Date()

  if (pageId) {
    // Update existing page
    const pageIndex = pages.findIndex((p) => p.id === pageId)
    if (pageIndex === -1) {
      throw new Error("Page not found")
    }

    // Check if user has permission to edit this page
    const page = pages[pageIndex]
    if (page.visibility === "private" && page.createdBy !== userId) {
      throw new Error("You don't have permission to edit this page")
    }

    // In a real app, we would update the page in the database
    return {
      id: pageId,
      contents,
      updatedAt: now,
      updatedBy: userId,
      visibility,
      status,
      scheduledPublishDate,
      tags,
    }
  } else {
    // Create new page
    const primaryLanguage = Object.keys(contents)[0]
    const newPageId = Math.random().toString(36).substring(2, 15)

    // In a real app, we would save the page to the database
    return {
      id: newPageId,
      contents,
      createdAt: now,
      updatedAt: now,
      createdBy: userId,
      updatedBy: userId,
      visibility,
      status,
      scheduledPublishDate,
      tags,
    }
  }
}
