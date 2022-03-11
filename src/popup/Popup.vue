<template>
  <main class="w-[300px] px-4 py-5 text-center text-gray-700 flex flex-col space-y-3">
    <button class="btn mt-2" @click="openOptionsPage">
      Open Options
    </button>
    <button class="btn mt-2" @click="startTracking">
      Start Tracking
    </button>
    {{ issueId }}
    {{ projectName }}
    {{ issueName }}
  </main>
</template>

<script setup lang="ts">
import { sendMessage } from 'webext-bridge'

const issueId = ref('')
const projectName = ref('')
const issueName = ref('')

onMounted(async() => {
  const tabs = await browser.tabs.query({ active: true, lastFocusedWindow: true })
  const url = tabs[0].url

  if (url) {
    const matchedIssueId = url.match(/\/-\/issues\/(\d+)/)

    if (matchedIssueId) {
      issueId.value = matchedIssueId[1]
    }

    const machedProjectName = url.match(/\/([^\/]+)\/-\/issues/)

    if (machedProjectName) {
      projectName.value = machedProjectName[1]
    }

    if (matchedIssueId && machedProjectName) {
      const response = await sendMessage('get-issue-name', {
        issueId: matchedIssueId[1],
        projectName: machedProjectName[1],
      })

      if (response.issueName) {
        issueName.value = response.issueName
      }
    }
  }
})

function openOptionsPage() {
  browser.runtime.openOptionsPage()
}

async function startTracking() {
  await sendMessage('start-tracking', {})
}

</script>
