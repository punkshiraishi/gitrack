<template>
  <main class="w-[300px] px-4 py-5 text-center text-gray-700 flex flex-col space-y-3">
    <button class="btn mt-2" @click="openOptionsPage">
      Open Options
    </button>
    <div class="bg-gray-400 p-3 flex flex-col items-start">
      <div>{{ issueId }}</div>
      <div>{{ projectName }}</div>
      <div>{{ issueName }}</div>
    </div>
    <input v-model="description" class="p-1 border border-dark-100 rounded-md" type="text">
    <button class="btn mt-2" @click="startTracking">
      Start Tracking
    </button>
  </main>
</template>

<script setup lang="ts">
import { sendMessage } from 'webext-bridge'

const issueId = ref('')
const projectName = ref('')
const issueName = ref('')
const description = ref('')

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

      description.value = `#${issueId.value} ${issueName.value}`
    }
  }
})

function openOptionsPage() {
  browser.runtime.openOptionsPage()
}

async function startTracking() {
  await sendMessage('start-timetracking', {
    description: description.value,
    clockifyProjectId: 'wip',
  })
}

</script>
