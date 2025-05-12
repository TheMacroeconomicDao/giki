// TODO: Перенести сюда код из lib/github.ts 
import { Octokit } from 'octokit'
import { logger } from '@shared/lib/logger'
import { getSetting } from '@shared/lib/settings'

async function getOctokit() {
	const token = await getSetting('GITHUB_TOKEN')
	if (!token) throw new Error('GitHub token not configured')
	return new Octokit({ auth: token })
}

async function getRepoDetails() {
	const owner = await getSetting('GITHUB_OWNER')
	const repo = await getSetting('GITHUB_REPO')
	if (!owner || !repo) throw new Error('GitHub repository details not configured')
	return { owner, repo }
}

export async function syncPageToGitHub(page: any): Promise<{ success: boolean; commitUrl?: string; error?: string }> {
	try {
		const octokit = await getOctokit()
		const { owner, repo } = await getRepoDetails()
		const content = Buffer.from(JSON.stringify(page, null, 2)).toString('base64')
		let sha: string | undefined
		try {
			const { data } = await octokit.rest.repos.getContent({ owner, repo, path: `pages/${page.id}.json` })
			if ('sha' in data) sha = data.sha
		} catch (error) {
			logger.debug(`File pages/${page.id}.json doesn't exist yet, creating new file`)
		}
		const result = await octokit.rest.repos.createOrUpdateFileContents({
			owner,
			repo,
			path: `pages/${page.id}.json`,
			message: `Update page: ${page.title}`,
			content,
			sha,
		})
		return { success: true, commitUrl: result.data.commit.html_url }
	} catch (error) {
		logger.error(`Error syncing page to GitHub:`, error as Error)
		return { success: false, error: (error as Error).message }
	}
}

export async function syncPagesToGitHub(pages: any[]): Promise<{ results: any[] }> {
	const results = []
	for (const page of pages) {
		try {
			const result = await syncPageToGitHub(page)
			results.push({ id: page.id, title: page.title, success: result.success, commitUrl: result.commitUrl, error: result.error })
		} catch (error) {
			results.push({ id: page.id, title: page.title, success: false, error: (error as Error).message })
		}
	}
	return { results }
}

export async function testGitHubConnection(): Promise<{ success: boolean; error?: string }> {
	try {
		const octokit = await getOctokit()
		const { owner, repo } = await getRepoDetails()
		await octokit.rest.repos.get({ owner, repo })
		return { success: true }
	} catch (error) {
		logger.error('GitHub connection test failed:', error as Error)
		return { success: false, error: (error as Error).message }
	}
}

export async function createRepositoryIfNeeded(): Promise<{ success: boolean; error?: string }> {
	try {
		const octokit = await getOctokit()
		const { owner, repo } = await getRepoDetails()
		try {
			await octokit.rest.repos.get({ owner, repo })
			return { success: true }
		} catch (error) {
			await octokit.rest.repos.createInOrg({ org: owner, name: repo, description: 'Giki.js content backup repository', private: true, auto_init: true })
			const readmeContent = Buffer.from(`# Giki.js Content Backup\n\nThis repository contains automated backups of content from the Giki.js wiki platform.\n\n## Structure\n\n- /pages/ - JSON files containing page content and metadata\n- /backups/ - Full database backups\n\nThis repository is automatically updated by the Giki.js platform.\n`).toString('base64')
			await octokit.rest.repos.createOrUpdateFileContents({ owner, repo, path: 'README.md', message: 'Initial commit: Add README', content: readmeContent })
			return { success: true }
		}
	} catch (error) {
		logger.error('Failed to create GitHub repository:', error as Error)
		return { success: false, error: (error as Error).message }
	}
}

export * from './api'
export * from './sync' 