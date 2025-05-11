import { Octokit } from "octokit"
import { logger } from "./logger"
import { getSetting } from "./settings-service"

// Initialize Octokit client with token from settings
async function getOctokit() {
  const token = await getSetting("GITHUB_TOKEN")

  if (!token) {
    throw new Error("GitHub token not configured")
  }

  return new Octokit({ auth: token })
}

// Get repository details from settings
async function getRepoDetails() {
  const owner = await getSetting("GITHUB_OWNER")
  const repo = await getSetting("GITHUB_REPO")

  if (!owner || !repo) {
    throw new Error("GitHub repository details not configured")
  }

  return { owner, repo }
}

// Function to sync a page to GitHub
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

// Function to sync multiple pages to GitHub
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

// Function to test GitHub connection
export async function testGitHubConnection(): Promise<{ success: boolean; error?: string }> {
  try {
    const octokit = await getOctokit()
    const { owner, repo } = await getRepoDetails()

    // Try to get repository info
    await octokit.rest.repos.get({
      owner,
      repo,
    })

    return { success: true }
  } catch (error) {
    logger.error("GitHub connection test failed:", error as Error)
    return {
      success: false,
      error: (error as Error).message,
    }
  }
}

// Function to create a new repository if it doesn't exist
export async function createRepositoryIfNeeded(): Promise<{ success: boolean; error?: string }> {
  try {
    const octokit = await getOctokit()
    const { owner, repo } = await getRepoDetails()

    try {
      // Check if repo exists
      await octokit.rest.repos.get({
        owner,
        repo,
      })

      // Repo exists, return success
      return { success: true }
    } catch (error) {
      // Repo doesn't exist, create it
      await octokit.rest.repos.createInOrg({
        org: owner,
        name: repo,
        description: "Giki.js content backup repository",
        private: true,
        auto_init: true,
      })

      // Create README
      const readmeContent = Buffer.from(`# Giki.js Content Backup

This repository contains automated backups of content from the Giki.js wiki platform.

## Structure

- \`/pages/\` - JSON files containing page content and metadata
- \`/backups/\` - Full database backups

This repository is automatically updated by the Giki.js platform.
`).toString("base64")

      await octokit.rest.repos.createOrUpdateFileContents({
        owner,
        repo,
        path: "README.md",
        message: "Initial commit: Add README",
        content: readmeContent,
      })

      return { success: true }
    }
  } catch (error) {
    logger.error("Failed to create GitHub repository:", error as Error)
    return {
      success: false,
      error: (error as Error).message,
    }
  }
}
