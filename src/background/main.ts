import { sendMessage, onMessage } from 'webext-bridge'
import { Tabs } from 'webextension-polyfill'
import { postTimeentries } from './api'

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

async function getIssues(token: string, project: string) {
  const url = `https://gitlab.com/api/v4/projects/${project}/issues`
  const response = await fetch(url, {
    method: 'get',
    headers: {
      'Private-Token': token,
    },
    credentials: 'include',
  })

  const data = await response.json()

  // eslint-disable-next-line no-console
  console.log(data)

  return data
}

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

    // ストレージから options の値を取得
    const options = JSON.parse((await browser.storage.local.get('options')).options)
    getIssues(options.gitlabToken, '12004953')

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

onMessage('reload-issues', async() => {
  // ストレージから options の値を取得
  const options = JSON.parse((await browser.storage.local.get('options')).options)
  const issues = await getIssues(options.gitlabToken, '12004953')
  await browser.storage.local.set({ issues: JSON.stringify(issues) })
  return issues
})

onMessage('start-tracking', async() => {
  await postTimeentries()
})
