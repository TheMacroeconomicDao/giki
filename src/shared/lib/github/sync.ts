import { serverLogger as logger } from '@shared/lib/logger'
import { getOctokit, getRepoDetails } from './api'

/**
 * Function to sync a page to GitHub
 */
export async function syncPageToGitHub(page: any): Promise<{ success: boolean; commitUrl?: string; error?: string }> {
  try {
    const octokit = await getOctokit()
    const { owner, repo } = await getRepoDetails()

    // Convert page content to Base64
    const content = Buffer.from(JSON.stringify(page, null, 2)).toString("base64")

    // Check if file already exists
    let sha: string | undefined
    try {
      const { data } = await octokit.rest.repos.getContent({
        owner,
        repo,
        path: `pages/${page.id}.json`,
      })

      if ("sha" in data) {
        sha = data.sha
      }
    } catch (error) {
      // File doesn't exist yet, which is fine
      logger.debug(`File pages/${page.id}.json doesn't exist yet, creating new file`)
    }

    // Create or update file
    const result = await octokit.rest.repos.createOrUpdateFileContents({
      owner,
      repo,
      path: `pages/${page.id}.json`,
      message: `Update page: ${page.title}`,
      content,
      sha,
    })

    return {
      success: true,
      commitUrl: result.data.commit.html_url,
    }
  } catch (error) {
    logger.error(`Error syncing page to GitHub:`, error as Error)
    return {
      success: false,
      error: (error as Error).message,
    }
  }
}

/**
 * Function to sync multiple pages to GitHub
 */
export async function syncPagesToGitHub(pages: any[]): Promise<{ results: any[] }> {
  const results = []

  for (const page of pages) {
    try {
      const result = await syncPageToGitHub(page)
      results.push({
        id: page.id,
        title: page.title,
        success: result.success,
        commitUrl: result.commitUrl,
        error: result.error,
      })
    } catch (error) {
      results.push({
        id: page.id,
        title: page.title,
        success: false,
        error: (error as Error).message,
      })
    }
  }

  return { results }
} 