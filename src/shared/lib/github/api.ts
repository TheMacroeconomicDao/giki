import { Octokit } from "octokit"
import { serverLogger } from "@shared/lib/logger"

// Временная заглушка для настроек, которую позже заменим на реальную имплементацию
// TODO: Использовать правильный модуль settings после миграции
async function getSetting(key: string): Promise<string | undefined> {
  const settings: Record<string, string> = {
    GITHUB_TOKEN: process.env.GITHUB_TOKEN || '',
    GITHUB_OWNER: process.env.GITHUB_OWNER || '',
    GITHUB_REPO: process.env.GITHUB_REPO || '',
  }
  return settings[key]
}

// Initialize Octokit client with token from settings
export async function getOctokit() {
  const token = await getSetting("GITHUB_TOKEN")

  if (!token) {
    throw new Error("GitHub token not configured")
  }

  return new Octokit({ auth: token })
}

// Get repository details from settings
export async function getRepoDetails() {
  const owner = await getSetting("GITHUB_OWNER")
  const repo = await getSetting("GITHUB_REPO")

  if (!owner || !repo) {
    throw new Error("GitHub repository details not configured")
  }

  return { owner, repo }
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
    serverLogger.error("GitHub connection test failed:", error as Error)
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
    serverLogger.error("Failed to create GitHub repository:", error as Error)
    return {
      success: false,
      error: (error as Error).message,
    }
  }
} 