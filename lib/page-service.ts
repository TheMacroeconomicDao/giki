import type { Language } from "./translation-service"

// Types for page data
export interface PageContent {
  title: string
  content: string
  language: Language
}

export interface Page {
  id: string
  slug: string
  contents: Record<Language, PageContent>
  createdAt: Date
  updatedAt: Date
  createdBy: string
  updatedBy: string
}

// In-memory storage for demo purposes
// In a real app, this would be a database
const pages: Page[] = []

// Generate a unique ID
function generateId(): string {
  return Math.random().toString(36).substring(2, 15)
}

// Create a slug from a title
function createSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

// Save a page
export async function savePage(
  contents: Record<Language, PageContent>,
  userId: string,
  pageId?: string,
): Promise<Page> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  const now = new Date()

  if (pageId) {
    // Update existing page
    const pageIndex = pages.findIndex((p) => p.id === pageId)
    if (pageIndex === -1) {
      throw new Error("Page not found")
    }

    const updatedPage = {
      ...pages[pageIndex],
      contents,
      updatedAt: now,
      updatedBy: userId,
    }

    pages[pageIndex] = updatedPage
    return updatedPage
  } else {
    // Create new page
    const primaryLanguage = contents.en.title ? "en" : "ru"
    const newPage: Page = {
      id: generateId(),
      slug: createSlug(contents[primaryLanguage].title),
      contents,
      createdAt: now,
      updatedAt: now,
      createdBy: userId,
      updatedBy: userId,
    }

    pages.push(newPage)
    return newPage
  }
}

// Get a page by ID
export async function getPageById(id: string): Promise<Page | null> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  const page = pages.find((p) => p.id === id)
  return page || null
}

// Get a page by slug
export async function getPageBySlug(slug: string): Promise<Page | null> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  const page = pages.find((p) => p.slug === slug)
  return page || null
}

// List all pages
export async function listPages(): Promise<Page[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  return [...pages]
}

// Delete a page
export async function deletePage(id: string): Promise<boolean> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  const pageIndex = pages.findIndex((p) => p.id === id)
  if (pageIndex === -1) {
    return false
  }

  pages.splice(pageIndex, 1)
  return true
}
