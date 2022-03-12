import * as convertKeys from 'convert-keys'
import { z } from 'zod'
import { optionsSchema } from '~/logic'

async function getOptions() {
  return optionsSchema.parse(
    JSON.parse((await browser.storage.local.get('options')).options),
  )
}

async function fetchClocify(method: 'get' | 'post', path: string, body: Record<string, string | Date>) {
  const { clockifyToken, clockifyWorkspace } = await getOptions()
  const url = `https://api.clockify.me/api/v1/workspaces/${clockifyWorkspace}/${path}`

  const response = await fetch(url, {
    method,
    headers: {
      'X-Api-Key': clockifyToken,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(convertKeys.toSnake(body)) : undefined,
    credentials: 'include',
  })

  return convertKeys.toCamel(await response.json())
}

export async function postTimeentries(projectId: string, description: string) {
  const response = await fetchClocify(
    'post',
    'time-entries',
    {
      start: new Date(),
      projectId,
      description,
    },
  )

  return response
}

async function fetchGitlab(method: 'get' | 'post', path: string, body?: Record<string, string | Date>) {
  const { gitlabToken } = await getOptions()
  const url = `https://gitlab.com/api/v4/${path}`

  const response = await fetch(url, {
    method,
    headers: {
      'Private-Token': gitlabToken,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(convertKeys.toSnake(body)) : undefined,
    credentials: 'include',
  })

  return convertKeys.toCamel(await response.json())
}

/**
 * GET /projects
 */
const gitlabProjectsSchema = z.array(z.object({
  id: z.number(),
}))

export type GitlabProjects = z.infer<typeof gitlabProjectsSchema>

export async function getProjectsByName(projectName: string) {
  const response = await fetchGitlab(
    'get',
    `projects?search=${projectName}`,
  )

  return gitlabProjectsSchema.parse(response)
}

/**
 * GET /issues
 */
const gitlabIssueSchema = z.object({
  title: z.string(),
})

export type GitlabIssues = z.infer<typeof gitlabIssueSchema>

export async function getIssue(projectId: string, issueId: string) {
  const response = await fetchGitlab(
    'get',
    `projects/${projectId}/issues/${issueId}`,
  )

  return gitlabIssueSchema.parse(response)
}
