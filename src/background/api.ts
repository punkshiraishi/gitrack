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
    body: JSON.stringify(body),
    credentials: 'include',
  })

  return await response.json()
}

export async function postTimeentries() {
  const response = await fetchClocify(
    'post',
    'time-entries',
    { start: new Date() },
  )

  return await response.json()
}
