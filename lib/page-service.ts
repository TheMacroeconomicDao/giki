import { query, queryOne } from "@/lib/db"
import { logger } from "@/lib/logger"

export interface Page {
  id: string
  title: string
  content: string
  visibility: "public" | "community" | "private"
  author_id: string
  created_at: string
  updated_at: string
  views: number
}

export interface PageVersion {
  id: string
  page_id: string
  content: string
  created_at: string
  created_by: string
}

export interface TranslatedContent {
  id: string
  page_id: string
  language: string
  content: string
  created_at: string
  updated_at: string
}

export interface PageWithAuthor extends Page {
  author: {
    id: string
    name: string | null
    address: string
  }
}

export interface PageWithDetails extends PageWithAuthor {
  translations: string[]
  version_count: number
}

export async function createPage(pageData: {
  title: string
  content: string
  visibility: "public" | "community" | "private"
  author_id: string
}): Promise<Page | null> {
  try {
    // Insert the page
    const page = await queryOne<Page>(
      `
      INSERT INTO pages (title, content, visibility, author_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `,
      [pageData.title, pageData.content, pageData.visibility, pageData.author_id],
    )

    if (!page) return null

    // Create the initial version
    await query(
      `
      INSERT INTO page_versions (page_id, content, created_by)
      VALUES ($1, $2, $3)
    `,
      [page.id, pageData.content, pageData.author_id],
    )

    return page
  } catch (error) {
    logger.error("Error creating page:", error as Error)
    return null
  }
}

export async function getPageById(id: string): Promise<PageWithDetails | null> {
  try {
    const page = await queryOne<PageWithDetails>(
      `
      SELECT 
        p.*,
        u.id as author_id,
        u.name as author_name,
        u.address as author_address,
        ARRAY(SELECT DISTINCT language FROM translated_content WHERE page_id = p.id) as translations,
        (SELECT COUNT(*) FROM page_versions WHERE page_id = p.id) as version_count
      FROM pages p
      JOIN users u ON p.author_id = u.id
      WHERE p.id = $1
    `,
      [id],
    )

    if (!page) return null

    // Format the page object
    return {
      ...page,
      author: {
        id: page.author_id,
        name: page.author_name,
        address: page.author_address,
      },
    }
  } catch (error) {
    logger.error("Error getting page by ID:", error as Error)
    return null
  }
}

export async function updatePage(
  id: string,
  data: {
    title?: string
    content?: string
    visibility?: "public" | "community" | "private"
  },
  userId: string,
): Promise<Page | null> {
  try {
    // Build the update query
    const fields = []
    const values = []
    let paramIndex = 1

    if (data.title !== undefined) {
      fields.push(`title = $${paramIndex}`)
      values.push(data.title)
      paramIndex++
    }

    if (data.content !== undefined) {
      fields.push(`content = $${paramIndex}`)
      values.push(data.content)
      paramIndex++
    }

    if (data.visibility !== undefined) {
      fields.push(`visibility = $${paramIndex}`)
      values.push(data.visibility)
      paramIndex++
    }

    fields.push(`updated_at = NOW()`)

    // Add the page ID to values
    values.push(id)

    // Update the page
    const page = await queryOne<Page>(
      `
      UPDATE pages
      SET ${fields.join(", ")}
      WHERE id = $${paramIndex}
      RETURNING *
    `,
      values,
    )

    if (!page) return null

    // If content was updated, create a new version
    if (data.content !== undefined) {
      await query(
        `
        INSERT INTO page_versions (page_id, content, created_by)
        VALUES ($1, $2, $3)
      `,
        [id, data.content, userId],
      )
    }

    return page
  } catch (error) {
    logger.error("Error updating page:", error as Error)
    return null
  }
}

export async function deletePage(id: string): Promise<boolean> {
  try {
    const result = await query(
      `
      DELETE FROM pages
      WHERE id = $1
      RETURNING id
    `,
      [id],
    )

    return result.length > 0
  } catch (error) {
    logger.error("Error deleting page:", error as Error)
    return false
  }
}

export async function listPages(
  options: {
    visibility?: string
    author_id?: string
    limit?: number
    offset?: number
    search?: string
  } = {},
): Promise<{ pages: PageWithAuthor[]; total: number }> {
  try {
    const { visibility, author_id, limit = 10, offset = 0, search } = options

    // Build the WHERE clause
    const conditions = []
    const params: any[] = []
    let paramIndex = 1

    if (visibility) {
      conditions.push(`p.visibility = $${paramIndex}`)
      params.push(visibility)
      paramIndex++
    }

    if (author_id) {
      conditions.push(`p.author_id = $${paramIndex}`)
      params.push(author_id)
      paramIndex++
    }

    if (search) {
      conditions.push(`(p.title ILIKE $${paramIndex} OR p.content ILIKE $${paramIndex})`)
      params.push(`%${search}%`)
      paramIndex++
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : ""

    // Get total count
    const countResult = await queryOne<{ count: string }>(
      `
      SELECT COUNT(*) as count
      FROM pages p
      ${whereClause}
    `,
      params,
    )

    const total = Number.parseInt(countResult?.count || "0", 10)

    // Get pages with pagination
    const paginationParams = [...params, limit, offset]
    const pages = await query<PageWithAuthor>(
      `
      SELECT 
        p.*,
        u.id as author_id,
        u.name as author_name,
        u.address as author_address
      FROM pages p
      JOIN users u ON p.author_id = u.id
      ${whereClause}
      ORDER BY p.updated_at DESC
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `,
      paginationParams,
    )

    // Format pages with author
    const formattedPages = pages.map((page) => ({
      ...page,
      author: {
        id: page.author_id,
        name: page.author_name,
        address: page.author_address,
      },
    }))

    return { pages: formattedPages, total }
  } catch (error) {
    logger.error("Error listing pages:", error as Error)
    return { pages: [], total: 0 }
  }
}

export async function incrementPageViews(id: string): Promise<boolean> {
  try {
    await query(
      `
      UPDATE pages
      SET views = views + 1
      WHERE id = $1
    `,
      [id],
    )
    return true
  } catch (error) {
    logger.error("Error incrementing page views:", error as Error)
    return false
  }
}

export async function getPageVersions(pageId: string): Promise<PageVersion[]> {
  try {
    const versions = await query<PageVersion>(
      `
      SELECT *
      FROM page_versions
      WHERE page_id = $1
      ORDER BY created_at DESC
    `,
      [pageId],
    )

    return versions
  } catch (error) {
    logger.error("Error getting page versions:", error as Error)
    return []
  }
}

export async function getPageVersion(versionId: string): Promise<PageVersion | null> {
  try {
    const version = await queryOne<PageVersion>(
      `
      SELECT *
      FROM page_versions
      WHERE id = $1
    `,
      [versionId],
    )

    return version
  } catch (error) {
    logger.error("Error getting page version:", error as Error)
    return null
  }
}

export async function addTranslation(translationData: {
  page_id: string
  language: string
  content: string
}): Promise<TranslatedContent | null> {
  try {
    const translation = await queryOne<TranslatedContent>(
      `
      INSERT INTO translated_content (page_id, language, content)
      VALUES ($1, $2, $3)
      ON CONFLICT (page_id, language) 
      DO UPDATE SET 
        content = EXCLUDED.content,
        updated_at = NOW()
      RETURNING *
    `,
      [translationData.page_id, translationData.language, translationData.content],
    )

    return translation
  } catch (error) {
    logger.error("Error adding translation:", error as Error)
    return null
  }
}

export async function getTranslation(pageId: string, language: string): Promise<TranslatedContent | null> {
  try {
    const translation = await queryOne<TranslatedContent>(
      `
      SELECT *
      FROM translated_content
      WHERE page_id = $1 AND language = $2
    `,
      [pageId, language],
    )

    return translation
  } catch (error) {
    logger.error("Error getting translation:", error as Error)
    return null
  }
}

export async function getPageTranslations(pageId: string): Promise<TranslatedContent[]> {
  try {
    const translations = await query<TranslatedContent>(
      `
      SELECT *
      FROM translated_content
      WHERE page_id = $1
      ORDER BY language
    `,
      [pageId],
    )

    return translations
  } catch (error) {
    logger.error("Error getting page translations:", error as Error)
    return []
  }
}
