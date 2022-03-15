import { sendMessage, onMessage } from 'webext-bridge'
import { Tabs } from 'webextension-polyfill'
import { clockify, gitlab } from '~/api'

// only on dev mode
if (import.meta.hot) {
  // @ts-expect-error for background HMR
  import('/@vite/client')
  // load latest content script
  import('./contentScriptHMR')
}

browser.runtime.onInstalled.addListener((): void => {
  // eslint-disable-next-line no-console
  console.log('Extension installed')
})

let previousTabId = 0

// communication example: send previous tab title from background page
// see shim.d.ts for type declaration
browser.tabs.onActivated.addListener(async({ tabId }) => {
  if (!previousTabId) {
    previousTabId = tabId
    return
  }

  let tab: Tabs.Tab

  try {
    tab = await browser.tabs.get(previousTabId)

    previousTabId = tabId
  }
  catch {
    return
  }

  // eslint-disable-next-line no-console
  console.log('previous tab', tab)
  sendMessage('tab-prev', { title: tab.title }, { context: 'content-script', tabId })
})

onMessage('get-current-tab', async() => {
  try {
    const tab = await browser.tabs.get(previousTabId)
    return {
      title: tab?.title,
    }
  }
  catch {
    return {
      title: undefined,
    }
  }
})

onMessage('start-timetracking', async({ data }) => {
  await clockify.postTimeentries(data.clockifyProjectId, data.description)
})

onMessage('get-issue-name', async({ data }) => {
  const projects = await gitlab.getProjectsByName(data.projectName)

  let issueName = ''

  if (projects.length > 0) {
    const { title } = await gitlab.getIssue(projects[0].id.toString(), data.issueId)
    issueName = title
  }

  return {
    issueName,
  }
})

onMessage('get-merge-request-name', async({ data }) => {
  const projects = await gitlab.getProjectsByName(data.projectName)

  let mergeRequestName = ''

  if (projects.length > 0) {
    const { title } = await gitlab.getMergeRequest(projects[0].id.toString(), data.mergeRequestId)
    mergeRequestName = title
  }

  return {
    mergeRequestName,
  }
})

onMessage('get-clockify-projects', async({ data }) => {
  return await clockify.getProjects(data.projectName)
})
