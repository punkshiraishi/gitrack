import { optionsSchema } from '~/logic'

async function getOptions() {
  return optionsSchema.parse(
    JSON.parse((await browser.storage.local.get('options')).options),
  )
}

export async function postTimeentries() {
  const { clockifyToken, clockifyWorkspace } = await getOptions()
  const url = `https://api.clockify.me/api/v1/workspaces/${clockifyWorkspace}/time-entries`

  const response = await fetch(url, {
    method: 'post',
    headers: {
      'X-Api-Key': clockifyToken,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      start: new Date(),
    }),
    credentials: 'include',
  })
  return await response.json()
}
